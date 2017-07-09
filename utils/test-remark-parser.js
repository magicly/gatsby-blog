const fs = require('fs');

const remark = require('remark')
const visit = require(`unist-util-visit`)

const markdown = fs.readFileSync('link-footer.md');

const ast = remark.parse(markdown);
console.log(ast);

visit(ast, `link`, node => {
  console.log(node)

  // todo 暂时没有检查是否是当前hostname下的页面， 是的话最好是不要在新页面打开
  node.type = `html`
  node.value = `<a href="${node.url}" target="_blank">${node.children[0].value}</a>`;
})