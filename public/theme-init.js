(function () {
  try {
    var theme =
      localStorage.getItem("activeMode") || localStorage.getItem("theme");
    if (theme && theme !== "default") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  } catch {
    // Storage access safety
  }
})();
