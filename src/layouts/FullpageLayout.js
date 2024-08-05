import React from "react"
import themeConfig from "../configs/themeConfig"
import classnames from "classnames"

const FullPageLayout = ({ children, ...rest }) => {
  let isPos = children.props.children.props.location.pathname.includes("dashboard/pos")
  return (
    <div
      className={classnames(
        "full-layout wrapper bg-full-screen-image blank-page dark-layout",
        {
          "layout-dark": themeConfig.layoutDark
        }
      )}
    >
      <div className="app-content">
        <div className="content-wrapper">
          <div className="content-body">
            <div 
              style={{alignItems: isPos ? 'flex-start' : 'center'}}
              className="flexbox-container">
              <main className="main w-100">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FullPageLayout
