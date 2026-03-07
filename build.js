const fs = require("fs");
const { marked } = require("marked");

// markdownフォルダの中を読む
const files = fs.readdirSync("markdown");

let postList = "";

// 1つずつ記事を処理
files.forEach(file => {

  const markdown = fs.readFileSync(`markdown/${file}`, "utf8");

  const lines = markdown.split("\n");

  const title = lines[0].replace("title: ", "");
  const date = lines[1].replace("date: ", "");
  const description = lines[2].replace("description: ", "");

  const htmlContent = marked(markdown);

  const htmlName = file.replace(".md", ".html");

  // 記事ページ
  const postTemplate = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="../css/style.css">
<title>${title}</title>
</head>

<body>

<h1>${title}</h1>
<p>${date}</p>

${htmlContent}

<a href="../index.html">トップへ戻る</a>

</body>
</html>
`;

  fs.writeFileSync(`posts/${htmlName}`, postTemplate);

  // 記事一覧
  postList += `
<div class="post-card">
<h3><a href="posts/${htmlName}">${title}</a></h3>
<p>${date}</p>
<p>${description}</p>
</div>
`;

});

// トップページ
const indexTemplate = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="css/style.css">
<title>My Blog</title>
</head>

<body>

<header>
<h1>My Blog</h1>
<button id="dark-toggle">🌙 Dark</button>
</header>

<h2>記事一覧</h2>

<div class="post-list">

${postList}

</div>

</body>
<script src="js/main.js"></script>
</html>
`;

fs.writeFileSync("index.html", indexTemplate);