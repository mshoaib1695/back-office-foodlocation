// You can customize the theme with the help of this file
let theme, direction;
if(localStorage.getItem("theme")){
  theme = localStorage.getItem("theme")
}else{
  localStorage.setItem("theme","light")
  theme = "light"
}
if(localStorage.getItem("direction")){
  direction = localStorage.getItem("direction")
}else{
  localStorage.setItem("direction", "ltr")
  direction = "ltr"
}
//Template config options
const themeConfig = {
  layout: "vertical", // options[String]: "vertical"(default), "horizontal"
  theme: theme, // options[String]: 'light'(default), 'dark', 'semi-dark'
  sidebarCollapsed: true, // options[Boolean]: true, false(default)
  navbarColor: "default", // options[String]: default / primary / success / danger / info / warning / dark
  navbarType: "floating", // options[String]: floating(default) / static / sticky / hidden
  footerType: "static", // options[String]: static(default) / sticky / hidden
  disableCustomizer: true, // options[Boolean]: true, false(default)
  hideScrollToTop: false, // options[Boolean]: true, false(default)
  menuTheme: "primary", // options[String]: primary / success / danger / info / warning / dark
  direction: direction // options[String] : ltr / rtl
}

export default themeConfig
