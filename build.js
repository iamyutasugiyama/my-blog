const fs = require("fs");
const { marked } = require("marked");

const files = fs.readdirSync("markdown");

let postList = "";

files.forEach(file => {

  const markdown = fs.readFileSync(`markdown/${file}`, "utf8");

  const html = marked(markdown);

  const title = markdown.split("\n")[0].replace("# ", "");

  const htmlName = file.replace(".md", ".html");

  const template = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="../css/style.css">
</head>
<body>

${html}

<a href="../index.html">トップへ戻る</a>

</body>
</html>
`;

  fs.writeFileSync(`posts/${htmlName}`, template);

  postList += `
<div class="post-card">
<h3><a href="posts/${htmlName}">${title}</a></h3>
</div>
`;

});

const indexTemplate = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="css/style.css">
</head>
<body>

<header>
<h1>My Blog</h1>
</header>

<h2>記事一覧</h2>

<div class="post-list">

${postList}

</div>

</body>
</html>
`;

fs.writeFileSync("index.html", indexTemplate);