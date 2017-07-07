const fs = require('fs');
const select = require('unist-util-select');
const remark = require(`remark`)

var markdown = fs.readFileSync('aws-docker.md');
var ast = remark.parse(markdown);

console.log(select(ast, 'link'))
//=> [ { type: 'text', value: 'TODO Step 2.' },
//     { type: 'text', value: 'TODO Step 3.1.' },
//     { type: 'text', value: 'TODO Step 3.3.' } ]
