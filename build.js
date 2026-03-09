const fs = require("fs");

const postsDir = "./posts";
const files = fs.readdirSync(postsDir);

let posts = [];
let postsHtml = "";
let rssItems = "";
let sitemapUrls = "";

let tagMap = {};

/* Markdown → HTML */

function markdownToHtml(md) {

  return md
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/\n/g, "<br>");

}

/* 記事読み込み */

files.forEach(file => {

  if (!file.endsWith(".md")) return;

  const slug = file.replace(".md", "");
  const md = fs.readFileSync(`${postsDir}/${file}`, "utf8");

  const lines = md.split("\n");

  let date = "";
  let tags = [];
  let thumbnail = "";
  let description = "";
  let contentStart = 0;

  if (lines[0].startsWith("date:")) {
    date = lines[0].replace("date:", "").trim();
    contentStart = 1;
  }

  if (lines[1] && lines[1].startsWith("tags:")) {
    tags = lines[1].replace("tags:", "").trim().split(",");
    contentStart = 2;
  }

  if (lines[2] && lines[2].startsWith("thumbnail:")) {
    thumbnail = lines[2].replace("thumbnail:", "").trim();
    contentStart = 3;
  }

  if (lines[3] && lines[3].startsWith("description:")) {
    description = lines[3].replace("description:", "").trim();
    contentStart = 4;
  }

  const content = lines.slice(contentStart).join("\n");
  const html = markdownToHtml(content);

  let tagsHtml = "";

  tags.forEach(tag => {

    tag = tag.trim();

    tagsHtml += `<a class="tag" href="../tags/${tag}.html">${tag}</a> `;

    if (!tagMap[tag]) tagMap[tag] = [];
    tagMap[tag].push(slug);

  });

  posts.push({
    slug,
    date
  });

  postsHtml += `
<div class="post-card">

<img class="thumb" src="images/${thumbnail}">

<h3><a href="posts/${slug}.html">${slug}</a></h3>

<p>${date}</p>

<div>${tagsHtml}</div>

</div>
`;

  rssItems += `
<item>
<title>${slug}</title>
<link>https://my-blog-nine-ashen-82.vercel.app/posts/${slug}.html</link>
<pubDate>${date}</pubDate>
</item>
`;

  sitemapUrls += `
<url>
<loc>https://my-blog-nine-ashen-82.vercel.app/posts/${slug}.html</loc>
</url>
`;

});

/* 日付順 */

posts.sort((a,b)=> new Date(b.date) - new Date(a.date));

/* 記事ページ */

posts.forEach((post,index)=>{

  const slug = post.slug;

  const md = fs.readFileSync(`${postsDir}/${slug}.md`,"utf8");
  const lines = md.split("\n");

  let date="";
  let tags=[];
  let thumbnail="";
  let description="";
  let contentStart=0;

  if(lines[0].startsWith("date:")){
    date = lines[0].replace("date:","").trim();
    contentStart=1;
  }

  if(lines[1].startsWith("tags:")){
    tags = lines[1].replace("tags:","").trim().split(",");
    contentStart=2;
  }

  if(lines[2].startsWith("thumbnail:")){
    thumbnail = lines[2].replace("thumbnail:","").trim();
    contentStart=3;
  }

  if(lines[3].startsWith("description:")){
    description = lines[3].replace("description:","").trim();
    contentStart=4;
  }

  const content = lines.slice(contentStart).join("\n");
  const html = markdownToHtml(content);

  let tagsHtml="";

  tags.forEach(tag=>{
    tag=tag.trim();
    tagsHtml+=`<a class="tag" href="../tags/${tag}.html">${tag}</a> `;
  });

  let prevLink="";
  let nextLink="";

  if(index>0){
    prevLink=`<a href="${posts[index-1].slug}.html">← 前の記事</a>`;
  }

  if(index<posts.length-1){
    nextLink=`<a href="${posts[index+1].slug}.html">次の記事 →</a>`;
  }

const postPage = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${slug}</title>

<meta name="description" content="${description}">

<meta property="og:title" content="${slug}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://my-blog-nine-ashen-82.vercel.app/posts/${slug}.html">
<meta property="og:image" content="https://my-blog-nine-ashen-82.vercel.app/images/${thumbnail}">
<meta property="og:description" content="${description}">

<link rel="stylesheet" href="../css/style.css">

</head>

<body>

<header>

<h1><a href="../index.html">Furniture Craftsman Journey</a></h1>

</header>

<article>

<p>${date}</p>

<div>${tagsHtml}</div>

${html}

</article>

<div class="post-nav">

${prevLink}

${nextLink}

</div>

<footer>

<p>© 2026 Yuta Sugiyama</p>

</footer>

</body>

</html>
`;

fs.writeFileSync(`posts/${slug}.html`,postPage);

});

/* index */

const indexPage = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Furniture Craftsman Journey</title>

<link rel="stylesheet" href="css/style.css">

</head>

<body>

<header>

<h1>Furniture Craftsman Journey</h1>

<p>家具職人を目指す1年間の記録</p>

</header>

<div class="post-list">

${postsHtml}

</div>

<footer>

<p>© 2026 Taro Yamada</p>

</footer>

</body>

</html>
`;

fs.writeFileSync("index.html",indexPage);

/* RSS */

const rss = `
<rss version="2.0">

<channel>

<title>Furniture Craftsman Journey</title>

<link>https://my-blog-nine-ashen-82.vercel.app</link>

<description>家具職人を目指す記録</description>

${rssItems}

</channel>

</rss>
`;

fs.writeFileSync("rss.xml",rss);

/* sitemap */

sitemapUrls += `
<url>
<loc>https://my-blog-nine-ashen-82.vercel.app/</loc>
</url>
`;

const sitemap = `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${sitemapUrls}

</urlset>
`;

fs.writeFileSync("sitemap.xml",sitemap);

/* タグページ */

if(!fs.existsSync("tags")){
  fs.mkdirSync("tags");
}

Object.keys(tagMap).forEach(tag=>{

let list="";

tagMap[tag].forEach(slug=>{
  list+=`<li><a href="../posts/${slug}.html">${slug}</a></li>`;
});

const page=`
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>${tag}</title>

<link rel="stylesheet" href="../css/style.css">

</head>

<body>

<h1>Tag: ${tag}</h1>

<ul>

${list}

</ul>

<a href="../index.html">← Home</a>

</body>

</html>
`;

fs.writeFileSync(`tags/${tag}.html`,page);

});

console.log("Blog build complete!");