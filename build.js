const fs = require("fs");
const path = require("path");

const postsDir = "./posts";

/* Markdown → HTML */
function markdownToHtml(md) {
  return md
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/\n/g, "<br>");
}

/* postsフォルダのファイル取得 */
const files = fs.readdirSync(postsDir);

let postsHtml = "";

/* 記事処理 */
files.forEach(file => {
  if (!file.endsWith(".md")) return;

  const slug = file.replace(".md", "");

  const md = fs.readFileSync(`${postsDir}/${file}`, "utf8");

const lines = md.split("\n");

let date = "";
let tags = [];
let contentStart = 0;

if (lines[0].startsWith("date:")) {
  date = lines[0].replace("date:", "").trim();
  contentStart = 1;
}

if (lines[1] && lines[1].startsWith("tags:")) {
  tags = lines[1].replace("tags:", "").trim().split(",");
  contentStart = 2;
}

const content = lines.slice(contentStart).join("\n");

const html = markdownToHtml(content);

let tagsHtml = "";

tags.forEach(tag => {
  tagsHtml += `<span class="tag">${tag}</span> `;
});

  /* index用カード */
  postsHtml += `
<div class="post-card" data-title="${slug}">
  <h3><a href="posts/${slug}.html">${slug}</a></h3>
  <p>${date}</p>
  <div>${tagsHtml}</div>
</div>
`;

  /* 記事ページ */
  const postPage = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
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

<script src="../js/main.js"></script>

</body>
</html>
`;

  fs.writeFileSync(`posts/${slug}.html`, postPage);
});

/* indexページ */
const indexPage = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
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

console.log("Blog build complete!");