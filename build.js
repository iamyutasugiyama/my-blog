const fs = require("fs");
const { marked } = require("marked");

const files = fs.readdirSync("markdown");

files.forEach(file => {

  const markdown = fs.readFileSync(`markdown/${file}`, "utf8");

  const html = marked(markdown);

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

  const htmlName = file.replace(".md", ".html");

  fs.writeFileSync(`posts/${htmlName}`, template);

});