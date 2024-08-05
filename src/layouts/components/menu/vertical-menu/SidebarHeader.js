import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Disc, X, Circle, Menu } from "react-feather";
import classnames from "classnames";
import { connect } from "react-redux";

class SidebarHeader extends Component {
  render() {
    let {
      toggleSidebarMenu,
      activeTheme,
      collapsed,
      toggle,
      sidebarVisibility,
      menuShadow,
    } = this.props;
    return (
      <div className="navbar-header">
        <ul className="nav navbar-nav flex-row">
          <li className="nav-item mr-auto">
            {collapsed && (
              <Menu
                style={{ cursor: "pointer" }}
                onClick={() => {
                  toggleSidebarMenu(!collapsed);
                  toggle();
                }}
                size={20}
                className={classnames(
                  "toggle-icon icon-x d-none d-xl-block font-medium-4",
                  {
                    "text-primary": activeTheme === "primary",
                    "text-success": activeTheme === "success",
                    "text-danger": activeTheme === "danger",
                    "text-info": activeTheme === "info",
                    "text-warning": activeTheme === "warning",
                    "text-dark": activeTheme === "dark",
                  }
                )}
              />
            )}
            <NavLink to="/" className="navbar-brand">
              <div className="brand-logo">
                <img src="http://13.232.252.219:5000/api/getProductImage?clientName=sandwich%20test&imageName=98cfa2f2-00ad-4f2e-8381-d4e75631b67b.jpg&imageContent=image/jpeg" />
              </div>
              <div className="brand-text-container-div">
                <h2 className="brand-text mb-0">{this.props.clientName}</h2>
              </div>
            </NavLink>
          </li>
          <li className="nav-item nav-toggle">
            <div className="nav-link modern-nav-toggle">
              {collapsed === false ? (
                <Menu
                  onClick={() => {
                    toggleSidebarMenu(true);
                    toggle();
                  }}
                  className={classnames(
                    "toggle-icon icon-x d-none d-xl-block font-medium-4",
                    {
                      "text-primary": activeTheme === "primary",
                      "text-success": activeTheme === "success",
                      "text-danger": activeTheme === "danger",
                      "text-info": activeTheme === "info",
                      "text-warning": activeTheme === "warning",
                      "text-dark": activeTheme === "dark",
                    }
                  )}
                  size={20}
                  data-tour="toggle-icon"
                />
              ) : (
                <Menu
                  onClick={() => {
                    toggleSidebarMenu(false);
                    toggle();
                  }}
                  className={classnames(
                    "toggle-icon icon-x d-none d-xl-block font-medium-4",
                    {
                      "text-primary": activeTheme === "primary",
                      "text-success": activeTheme === "success",
                      "text-danger": activeTheme === "danger",
                      "text-info": activeTheme === "info",
                      "text-warning": activeTheme === "warning",
                      "text-dark": activeTheme === "dark",
                    }
                  )}
                  size={20}
                />
              )}
              <X
                onClick={sidebarVisibility}
                className={classnames(
                  "toggle-icon icon-x d-block d-xl-none font-medium-4",
                  {
                    "text-primary": activeTheme === "primary",
                    "text-success": activeTheme === "success",
                    "text-danger": activeTheme === "danger",
                    "text-info": activeTheme === "info",
                    "text-warning": activeTheme === "warning",
                    "text-dark": activeTheme === "dark",
                  }
                )}
                size={20}
              />
            </div>
          </li>
        </ul>
        <div
          className={classnames("shadow-bottom", {
            "d-none": menuShadow === false,
          })}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    img:
      state.auth.login &&
      state.auth.login.client &&
      state.auth.login.client.img,
    clientName: state.auth.login.client && state.auth.login.client.name,
  };
};
export default connect(mapStateToProps)(SidebarHeader);
