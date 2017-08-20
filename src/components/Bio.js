import React from "react"

// Import typefaces
import "typeface-montserrat"
import "typeface-merriweather"

import profilePic from "./profile-pic.jpg"

class Bio extends React.Component {
  render() {
    return (
      <p
        style={{
        }}
      >
        <img
          src={'https://static.oschina.net/uploads/user/53/106378_100.jpg'}
          alt={`Magicly`}
          style={{
            borderRadius: `100%`,
            float: "left",
            marginBottom: 0,
          }}
        />
        Written by
        {" "}
        <strong>Magicly</strong>
        {" "}
        who lives and works in ChengDu building useful things.
        {" "}
        <a href="http://weibo.com/magicly" target="_blank">
          You should follow him on Weibo.
        </a>
      </p>
    )
  }
}

export default Bio
