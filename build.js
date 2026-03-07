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
let content = md;

if (lines[0].startsWith("date:")) {
  date = lines[0].replace("date:", "").trim();
  content = lines.slice(1).join("\n");
}

const html = markdownToHtml(content);

  /* index用カード */
  postsHtml += `
  <div class="post-card">
    <h3><a href="posts/${slug}.html">${slug}</a></h3>
    <p>${date}</p>
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

<div class="post-list">
${postsHtml}
</div>

<script src="js/main.js"></script>

</body>
</html>
`;

fs.writeFileSync("index.html", indexPage);

console.log("Blog build complete!");