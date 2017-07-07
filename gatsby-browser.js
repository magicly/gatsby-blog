exports.onClientEntry = function() {
  // console.log('oncliententry....')
  // require(`es6-object-assign`).polyfill()
  // addTarget();
}

function addTarget() {
  var links = document.links;
  console.log('links: ', links, links.length)

  for (var i = 0, linksLength = links.length; i < linksLength; i++) {
    console.log(links[i].hostname)
    if (links[i].hostname != window.location.hostname) {
        links[i].target = '_blank';
    } 
  }
}

exports.onRouteUpdate = ({ location }) => {
  // console.log('new pathname', location.pathname)
  // addTarget();
}