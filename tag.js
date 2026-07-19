/* ============================================================================
 * WebByte Studio — Tag Embed
 * https://tag.timonsh.dev/tag.js
 * ----------------------------------------------------------------------------
 * Zentrale Einbindung der "gebaut von WebByte Studio"-Badge. Alles (Markup,
 * Styles, Bild, Text) wird hier im Repo verwaltet — ein Update greift überall.
 *
 * Einbau im Zielprojekt (nur diese zwei Zeilen):
 *   1. <script src="https://tag.timonsh.dev/tag.js" defer></script>
 *   2. <div data-webbyte-studio-tag></div>   an der gewünschten Stelle
 *
 * Das Skript lädt studio-badge.css (einmalig) und rendert die Badge in jeden
 * gefundenen Mountpunkt. Mehrfachaufrufe / mehrere Mountpunkte sind ok.
 * ==========================================================================*/
(function () {
    "use strict";

    var ORIGIN = "https://tag.timonsh.dev";
    var CSS_URL = ORIGIN + "/studio-badge.css";
    var AVATAR_URL = ORIGIN + "/timon-profile.webp";

    var BADGE_HTML =
        '<aside class="studio-badge" aria-label="Erstellt von WebByte Studio">' +
            '<div class="studio-badge__text">' +
                '<p class="studio-badge__line"><span class="studio-badge__prompt">&#10095;</span> gebaut von <a href="https://timonsh.dev" rel="noopener">WebByte&nbsp;Studio</a></p>' +
                '<p class="studio-badge__meta">timon schroth &middot; frontend&nbsp;dev &middot; <a href="https://timonsh.dev" rel="noopener">timonsh.dev</a></p>' +
            '</div>' +
            '<a class="studio-badge__avatar" href="https://timonsh.dev" rel="noopener" aria-label="timonsh.dev — Profil">' +
                '<img src="' + AVATAR_URL + '" alt="Timon Schroth" width="144" height="144" loading="lazy">' +
            '</a>' +
        '</aside>';

    function injectStyles() {
        if (document.querySelector("link[data-webbyte-studio-tag-css]")) return;
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = CSS_URL;
        link.setAttribute("data-webbyte-studio-tag-css", "");
        document.head.appendChild(link);
    }

    function render() {
        injectStyles();
        var mounts = document.querySelectorAll("[data-webbyte-studio-tag]");
        for (var i = 0; i < mounts.length; i++) {
            var el = mounts[i];
            if (el.hasAttribute("data-webbyte-studio-tag-rendered")) continue;
            el.innerHTML = BADGE_HTML;
            el.setAttribute("data-webbyte-studio-tag-rendered", "");
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", render);
    } else {
        render();
    }
})();
