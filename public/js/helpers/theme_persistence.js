(function () {
    const THEME_STORAGE_KEY = "sac-theme";
    const html = document.documentElement;

    function esTemaValido(theme) {
        return theme === "dark" || theme === "light";
    }

    function obtenerTemaActual() {
        const theme = html.getAttribute("data-bs-theme");
        return esTemaValido(theme) ? theme : "light";
    }

    function persistirTema(theme) {
        if (!esTemaValido(theme)) {
            return;
        }

        localStorage.setItem(THEME_STORAGE_KEY, theme);
        sessionStorage.setItem("data-bs-theme", theme);
    }

    const temaGuardado = localStorage.getItem(THEME_STORAGE_KEY);
    if (esTemaValido(temaGuardado)) {
        html.setAttribute("data-bs-theme", temaGuardado);
        sessionStorage.setItem("data-bs-theme", temaGuardado);
    }

    persistirTema(obtenerTemaActual());

    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === "attributes" && mutation.attributeName === "data-bs-theme") {
                persistirTema(obtenerTemaActual());
            }
        });
    });

    observer.observe(html, {
        attributes: true,
        attributeFilter: ["data-bs-theme"],
    });
})();
