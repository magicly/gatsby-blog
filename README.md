# gatsby-starter-blog
Gatsby starter for creating a blog

Install this starter (assuming Gatsby is installed) by running from your CLI:
`gatsby new gatsby-blog https://github.com/gatsbyjs/gatsby-starter-blog`

## Running in development
`gatsby develop`

要部署到coding.net上，首先取消gatsby-config.js里面
```
    //codingnet: true,
```
这行代码注释，然后gatsby build，部署好之后，再次注释掉，避免git提交，导致netlify的部署出错。
