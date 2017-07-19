const fs = require('fs');

const unified = require('unified')
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
const ast = remark().parse(markdown);

const processor = remark()
  .use(math)
  .use(katex)
  .use(html)

  // processor.run(ast)
  // .then(node => {
  //   console.log(ast)
  //   console.log(node)
  // })
  // console.log(math(ast))
const r = processor().runSync(ast)

// const ast2 = processor.parse(remark().stringify(ast));
// console.log(`r === ast: , ${r === ast}, r === ast2: ${r === ast2}`)

const str = processor.processSync(markdown).toString();
console.log(str)

const str1 = hastToHTML(toHAST(r, { allowDangerousHTML: true }), {
  allowDangerousHTML: true,
})
console.log(str1)
const str2 = hastToHTML(toHAST(ast, { allowDangerousHTML: true }), {
  allowDangerousHTML: true,
})
console.log(str2)
console.log(str1 === str2)