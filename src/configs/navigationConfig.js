import React from "react"
import * as Icon from "react-feather"
const navigationConfig = [
  {
    id: "home",
    title: "Home",
    type: "item",
    icon: <Icon.Home size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/"
  },
  {
    id: "dashboard",
    title: "Dashboard",
    type: "collapse",
    icon: <Icon.Home size={20} />,
    badge: "warning",
    badgeText: "2",
    children: [
      {
        id: "analyticsDash",
        title: "Analytics",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/"
      },
      {
        id: "eCommerceDash",
        title: "eCommerce",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: ["admin"],
        navLink: "/ecommerce-dashboard"
      }
    ]
  },
  {
    id: "page2",
    title: "Page 2",
    type: "item",
    icon: <Icon.File size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/page2"
  }
]

export default navigationConfig
