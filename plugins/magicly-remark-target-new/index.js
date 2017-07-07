const visit = require(`unist-util-visit`)

module.exports = ({ markdownAST }) => {
  visit(markdownAST, `link`, node => {

    // todo 暂时没有检查是否是当前hostname下的页面， 是的话最好是不要在新页面打开
    node.type = `html`
    node.value = `<a href="${node.url}" target="_blank">${node.children[0].value}</a>`;
  })
}
