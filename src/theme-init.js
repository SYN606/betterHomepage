(function () {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && savedTheme !== "default") {
        document.documentElement.setAttribute("data-theme", savedTheme);
    }
})();