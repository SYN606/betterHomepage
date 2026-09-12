(function () {
  try {
    const savedTheme =
      localStorage.getItem("activeMode") || localStorage.getItem("theme");
    if (savedTheme && savedTheme !== "default") {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  } catch {
    // Storage access safety
  }
})();