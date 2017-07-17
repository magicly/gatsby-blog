const fs = require('fs');

const remark = require('remark')
const math = require('remark-math')
const katex = require('remark-html-katex') // Use remark-html-katex
const html = require('remark-html')

const toHAST = require(`mdast-util-to-hast`)
const hastToHTML = require(`hast-util-to-html`)

const markdown = `
$$
L = \\frac{1}{2} \\rho v^2 S C_L
$$
`
// const markdown = fs.readFileSync('markdown-math.md');
const ast = remark().parse(markdown);

// Raw String => MDAST => transformed MDAST => HTML
const processor = remark()
  .use(math)
  // .use(katex)
  .use(html)
  console.log(processor.transformers)
const ast2 = processor.parse(markdown);
const ast3 = processor.parse(remark().stringify(ast));
const r = processor().runSync(ast)
const r2 = remark().runSync(ast)
console.log('r === ast: ', r === ast, r === r2, ast2 === ast, ast2 === ast3)

const str = processor.processSync(markdown).toString();
console.log(str)

const str1 = hastToHTML(toHAST(r, { allowDangerousHTML: true }), {
  allowDangerousHTML: true,
})
console.log(str1)
const str2 = hastToHTML(toHAST(ast3, { allowDangerousHTML: true }), {
  allowDangerousHTML: true,
})
console.log(str2)
console.log(str1 === str2)