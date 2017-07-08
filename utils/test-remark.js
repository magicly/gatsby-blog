const fs = require('fs');

const remark = require('remark')
const math = require('remark-math')
const katex = require('remark-html-katex') // Use remark-html-katex
const html = require('remark-html')

// var guide = require('remark-preset-lint-markdown-style-guide');
// var report = require('vfile-reporter');

const markdown = fs.readFileSync('markdown-math.md');

// remark()
//   // .use(guide)
//   .use(html)
//   .process(markdown, function (err, file) {
//     console.log(String(file));
//     // console.error(report(err || file));
//   });

// Raw String => MDAST => transformed MDAST => HTML
const processor = remark()
  .use(math)
  .use(katex)
  .use(html)

const rawString = `Lift($L$) can be determined by Lift Coeeficient ($C_L$) like the following equation.

$$
L = \\frac{1}{2} \\rho v^2 S C_L
$$
`
console.log(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
`)
const str = processor.processSync(markdown).toString();
console.log(str)
console.log(`
<div id="math"></div>
  <link href="https://cdn.bootcss.com/KaTeX/0.7.1/katex.min.css" rel="stylesheet">

<script src="https://cdn.bootcss.com/KaTeX/0.7.1/katex.min.js"></script>
  <script>
    element =document.getElementById('math')
    katex.render("c = \\pm\\sqrt{a^2 + b^2}", element);
    </script>
</body>
</html> 
`);