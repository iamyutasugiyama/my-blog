const fs = require("fs");

const postsDir = "./posts";

const files = fs.readdirSync(postsDir);

let postsHtml = "";
let rssItems = "";
let sitemapUrls = "";
let posts = [];

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

  const content = lines.slice(contentStart).join("\n");

  const html = markdownToHtml(content);

  let tagsHtml = "";

  tags.forEach(tag => {

    tagsHtml += `<span class="tag">${tag}</span> `;

  });

  posts.push({
    slug: slug,
    date: date
  });

  /* indexカード */

  postsHtml += `
  <div class="post-card" data-title="${slug}">

  <img class="thumb" src="images/${thumbnail}">

  <h3><a href="posts/${slug}.html">${slug}</a></h3>

  <p>${date}</p>

  <div>${tagsHtml}</div>

  </div>
  `;

  /* RSS */

  rssItems += `
<item>

<title>${slug}</title>

<link>https://my-blog-nine-ashen-82.vercel.app/posts/${slug}.html</link>

<pubDate>${date}</pubDate>

</item>
`;

  /* sitemap */

  sitemapUrls += `
<url>

<loc>https://my-blog-nine-ashen-82.vercel.app/posts/${slug}.html</loc>

</url>
`;

});

/* 記事並び替え */

posts.sort((a, b) => {

  return new Date(b.date) - new Date(a.date);

});

/* 記事ページ生成 */

posts.forEach((post, index) => {

  const slug = post.slug;

  const md = fs.readFileSync(`${postsDir}/${slug}.md`, "utf8");

  const lines = md.split("\n");

  let date = "";
  let tags = [];
  let thumbnail = "";
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

  const content = lines.slice(contentStart).join("\n");

  const html = markdownToHtml(content);

  let tagsHtml = "";

  tags.forEach(tag => {

    tagsHtml += `<span class="tag">${tag}</span> `;

  });

  let prevLink = "";
  let nextLink = "";

  if (index > 0) {

    prevLink = `<a href="${posts[index-1].slug}.html">← 前の記事</a>`;

  }

  if (index < posts.length - 1) {

    nextLink = `<a href="${posts[index+1].slug}.html">次の記事 →</a>`;

  }

  const postPage = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${slug}</title>

<link rel="stylesheet" href="../css/style.css">

</head>

<body>

<header>

<h1><a href="../index.html">My Blog</a></h1>

<button id="dark-toggle">🌙 Dark</button>

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

<script src="../js/main.js"></script>

</body>

</html>
`;

  fs.writeFileSync(`posts/${slug}.html`, postPage);

});

/* index生成 */

const indexPage = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>My Blog</title>

<link rel="stylesheet" href="css/style.css">

</head>

<body>

<header>

<h1>My Blog</h1>

<button id="dark-toggle">🌙 Dark</button>

</header>

<input id="search" placeholder="Search posts..." />

<div class="post-list">

${postsHtml}

</div>

<script src="js/main.js"></script>

</body>

</html>
`;

fs.writeFileSync("index.html", indexPage);

/* RSS */

const rss = `
<rss version="2.0">

<channel>

<title>My Blog</title>

<link>https://my-blog-nine-ashen-82.vercel.app</link>

<description>My personal blog</description>

${rssItems}

</channel>

</rss>
`;

fs.writeFileSync("rss.xml", rss);

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

fs.writeFileSync("sitemap.xml", sitemap);

console.log("Blog build complete!");