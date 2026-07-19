/* ============================================================================
 * WebByte Studio — Tag Embed
 * https://tag.timonsh.dev/tag.js
 * ----------------------------------------------------------------------------
 * Zentrale Einbindung der "gebaut von WebByte Studio"-Badge. Markup, Styles,
 * Bild, Text, Flammen, Typewriter und Lift werden hier verwaltet — ein Update
 * greift überall.
 *
 * Einbau im Zielprojekt (nur diese zwei Zeilen):
 *   1. <script src="https://tag.timonsh.dev/tag.js" defer></script>
 *   2. <div data-webbyte-studio-tag></div>   an der gewünschten Stelle
 *
 * Progressive Enhancement:
 *   · Balatro-Flammen (Canvas) vom Avatar rechts nach links — Blau→Grün→
 *     Orange→Weiß. Ohne JS greift ein CSS-Ember-Fallback.
 *   · Terminal-Prompt tippt die Wortmarke (Typewriter, Loop).
 *   · Sehr leichter Lift + Pointer-Tilt der ganzen Badge.
 *   Alles respektiert prefers-reduced-motion, Tab-Sichtbarkeit & Viewport.
 * ==========================================================================*/
(function () {
    "use strict";

    var ORIGIN = "https://tag.timonsh.dev";
    var CSS_URL = ORIGIN + "/studio-badge.css";
    var AVATAR_URL = ORIGIN + "/timon-profile.webp";
    var LOGO_URL = ORIGIN + "/webbyte-mark.webp";

    var BADGE_HTML =
        '<aside class="studio-badge" aria-label="Erstellt von WebByte Studio">' +
            '<span class="studio-badge__grid" aria-hidden="true"></span>' +
            '<span class="studio-badge__aura" aria-hidden="true"></span>' +
            '<span class="studio-badge__scan" aria-hidden="true"></span>' +
            '<span class="studio-badge__flames" aria-hidden="true"></span>' +
            '<canvas class="studio-badge__flame-canvas" aria-hidden="true"></canvas>' +
            '<div class="studio-badge__main">' +
                '<span class="studio-badge__dots" aria-hidden="true">' +
                    '<span class="studio-badge__dot studio-badge__dot--red"></span>' +
                    '<span class="studio-badge__dot studio-badge__dot--amber"></span>' +
                    '<span class="studio-badge__dot studio-badge__dot--green"></span>' +
                '</span>' +
                '<div class="studio-badge__text">' +
                    '<p class="studio-badge__line">' +
                        '<span class="studio-badge__prompt" aria-hidden="true">&#10095;</span>' +
                        '<span class="studio-badge__cmd">gebaut von</span>' +
                        '<a class="studio-badge__brand" href="https://timonsh.dev" rel="noopener">' +
                            '<span class="studio-badge__brand-word" aria-hidden="true">WebByte&nbsp;Studio</span>' +
                            '<span class="studio-badge__logo" aria-hidden="true">' +
                                '<img src="' + LOGO_URL + '" alt="" width="560" height="324" loading="lazy" decoding="async">' +
                            '</span>' +
                            '<span class="studio-badge__sr">WebByte Studio</span>' +
                        '</a>' +
                        '<span class="studio-badge__caret" aria-hidden="true"></span>' +
                    '</p>' +
                    '<p class="studio-badge__meta">' +
                        '<a class="is-name" href="https://timonsh.dev" rel="noopener">timon schroth</a>' +
                        '<span class="studio-badge__sep" aria-hidden="true">&middot;</span> frontend&nbsp;dev ' +
                        '<span class="studio-badge__sep" aria-hidden="true">&middot;</span> ' +
                        '<a class="is-site" href="https://timonsh.dev" rel="noopener">timonsh.dev</a>' +
                    '</p>' +
                '</div>' +
            '</div>' +
            '<a class="studio-badge__avatar" href="https://timonsh.dev" rel="noopener" aria-label="timonsh.dev — Profil">' +
                '<span class="studio-badge__avatar-ring" aria-hidden="true"></span>' +
                '<img src="' + AVATAR_URL + '" alt="Timon Schroth" width="144" height="144" loading="lazy" decoding="async">' +
            '</a>' +
        '</aside>';

    /* ---------------------------------------------------------------- Styles */
    function injectStyles() {
        // schon vorhanden? (auch statisch verlinktes studio-badge.css zählt)
        if (document.querySelector('link[data-webbyte-studio-tag-css], link[href*="studio-badge.css"]')) return;
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = CSS_URL;
        link.setAttribute("data-webbyte-studio-tag-css", "");
        document.head.appendChild(link);
    }

    /* ============================================================ Enhancement */

    var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var FINE_POINTER = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    /* Feuer-Palette: transparent → Blau → Grün → Orange → Amber → Weiß.
       (heiß an der Avatar-Kante rechts, kühlt nach links aus) */
    function buildPalette(n) {
        // weich & ambient: gedämpfte Farben, niedrige Deckkraft (max ~150)
        var stops = [
            [0.00,   0,   0,   0,   0],
            [0.14,  30,  52, 120,  38],
            [0.34,  52,  92, 225,  82],
            [0.52,  70, 180, 110, 100],
            [0.70, 240, 140, 110, 118],
            [0.86, 250, 186, 140, 134],
            [1.00, 255, 224, 194, 150]
        ];
        var pal = new Array(n);
        for (var i = 0; i < n; i++) {
            var t = i / (n - 1), a = stops[0], b = stops[stops.length - 1], k;
            for (k = 0; k < stops.length - 1; k++) {
                if (t >= stops[k][0] && t <= stops[k + 1][0]) { a = stops[k]; b = stops[k + 1]; break; }
            }
            var f = (b[0] - a[0]) ? (t - a[0]) / (b[0] - a[0]) : 0;
            pal[i] = [
                (a[1] + (b[1] - a[1]) * f) | 0,
                (a[2] + (b[2] - a[2]) * f) | 0,
                (a[3] + (b[3] - a[3]) * f) | 0,
                (a[4] + (b[4] - a[4]) * f) | 0
            ];
        }
        return pal;
    }

    /* Horizontales „Doom-Fire": Quelle rechts (Avatar), breitet sich nach
       links aus und kühlt ab. */
    function createFire(canvas) {
        var COLS = 128, ROWS = 42, N = 40;
        canvas.width = COLS; canvas.height = ROWS;
        var ctx = canvas.getContext("2d");
        var heat = new Uint8Array(COLS * ROWS);
        var pal = buildPalette(N);
        var img = ctx.createImageData(COLS, ROWS);
        var boost = 0;

        function seed() {
            var src = COLS - 1;
            for (var y = 0; y < ROWS; y++) {
                var edge = Math.abs((y / (ROWS - 1)) - 0.5) * 2;    // 0 Mitte … 1 Rand
                // gedämpfte Quelle + stärkerer Rand-Abfall → konzentriert, ruhig
                var h = (N - 1) * 0.8 - (edge * edge) * (N * 0.62);
                h -= (Math.random() * 2) | 0;
                if (Math.random() < 0.025) h -= 4;                  // seltenes, sanftes Flackern
                h += boost;
                heat[y * COLS + src] = h < 0 ? 0 : (h > N - 1 ? N - 1 : h);
            }
        }
        function propagate() {
            for (var x = COLS - 2; x >= 0; x--) {
                for (var y = 0; y < ROWS; y++) {
                    var decay = (Math.random() * 3) | 0;
                    var yoff = ((Math.random() * 3) | 0) - 1;
                    var sy = y + yoff; if (sy < 0) sy = 0; else if (sy >= ROWS) sy = ROWS - 1;
                    var h = heat[sy * COLS + (x + 1)] - decay;
                    heat[y * COLS + x] = h < 0 ? 0 : h;
                }
            }
        }
        function render() {
            var d = img.data;
            for (var p = 0; p < COLS * ROWS; p++) {
                var c = pal[heat[p]], o = p << 2;
                d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = c[3];
            }
            ctx.putImageData(img, 0, 0);
        }
        return {
            tick: function () { seed(); propagate(); render(); },
            setBoost: function (b) { boost = b; }
        };
    }

    /* Typewriter: tippt die Wortmarke, hält, löscht, wiederholt. */
    function startTypewriter(badge, wordEl) {
        var text = wordEl.textContent;                 // "WebByte Studio"
        var i = 0, erasing = false, timer = null;
        var TYPE = 78, ERASE = 42, HOLD = 5200, EMPTY = 620;

        function schedule(fn, ms) { timer = window.setTimeout(fn, ms); }

        function step() {
            // Pause, wenn Tab versteckt → nicht weitertippen
            if (document.hidden) { schedule(step, 400); return; }
            if (!erasing) {
                i++;
                wordEl.textContent = text.slice(0, i);
                if (i >= text.length) {
                    badge.classList.remove("is-typing");   // Logo einblenden
                    erasing = true;
                    schedule(step, HOLD);
                    return;
                }
                schedule(step, TYPE + (Math.random() * 60 | 0));
            } else {
                badge.classList.add("is-typing");          // Logo ausblenden
                i--;
                wordEl.textContent = text.slice(0, i < 0 ? 0 : i);
                if (i <= 0) {
                    erasing = false;
                    schedule(step, EMPTY);
                    return;
                }
                schedule(step, ERASE);
            }
        }

        badge.classList.add("is-typing");
        wordEl.textContent = "";
        schedule(step, 500);
    }

    /* Lift + Pointer-Tilt: die Badge schwebt leicht und neigt sich zur Maus. */
    function attachMotion(badge, fire) {
        var raf = 0, running = false, lastFire = 0;
        var tRx = 0, tRy = 0, rx = 0, ry = 0, sc = 1, tSc = 1;
        var lift = 0, tLift = 0;                          // sanfter Hover-Lift (px)
        var t0 = null;

        badge.style.transition = "border-color .4s ease, box-shadow .4s ease"; // Transform gehört uns

        function onMove(e) {
            var r = badge.getBoundingClientRect();
            var px = (e.clientX - r.left) / r.width - 0.5;   // -0.5 … 0.5
            var py = (e.clientY - r.top) / r.height - 0.5;
            tRy = px * 4;      // sehr leichter Tilt
            tRx = -py * 3.5;
        }
        function onEnter() { tSc = 1.014; tLift = -4; if (fire) fire.setBoost(3); }
        function onLeave() { tRx = 0; tRy = 0; tSc = 1; tLift = 0; if (fire) fire.setBoost(0); }

        if (FINE_POINTER) {
            badge.addEventListener("pointermove", onMove);
            badge.addEventListener("pointerenter", onEnter);
            badge.addEventListener("pointerleave", onLeave);
        }

        function loop(now) {
            if (!running) return;
            if (t0 === null) t0 = now;
            var t = now - t0;

            if (fire && now - lastFire > 55) { fire.tick(); lastFire = now; }   // ruhiger

            rx += (tRx - rx) * 0.07;
            ry += (tRy - ry) * 0.07;
            sc += (tSc - sc) * 0.08;
            lift += (tLift - lift) * 0.08;                   // weicher Lift
            var ty = Math.sin(t / 1500) * 1.3;               // sanfter Float
            var rz = Math.sin(t / 2800) * 0.2;               // minimale Wippe
            badge.style.transform =
                "perspective(820px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) +
                "deg) translateY(" + (ty + lift).toFixed(2) + "px) rotate(" + rz.toFixed(2) + "deg) scale(" + sc.toFixed(3) + ")";

            raf = window.requestAnimationFrame(loop);
        }
        function start() { if (running) return; running = true; t0 = null; raf = window.requestAnimationFrame(loop); }
        function stop() { running = false; if (raf) window.cancelAnimationFrame(raf); raf = 0; }

        return { start: start, stop: stop };
    }

    function enhance(badge) {
        if (badge.hasAttribute("data-wbs-enhanced")) return;
        badge.setAttribute("data-wbs-enhanced", "");

        var wordEl = badge.querySelector(".studio-badge__brand-word");
        var canvas = badge.querySelector(".studio-badge__flame-canvas");

        if (REDUCED) {
            // Statisch: voller Text, kein Feuer/Float — CSS-Ember bleibt.
            badge.classList.remove("is-typing");
            return;
        }

        var fire = null;
        if (canvas && canvas.getContext) {
            try { fire = createFire(canvas); badge.classList.add("wbs-has-fire"); } catch (e) { fire = null; }
        }
        if (wordEl) startTypewriter(badge, wordEl);

        var motion = attachMotion(badge, fire);

        // Nur laufen lassen, wenn sichtbar (Viewport) und Tab aktiv.
        var inView = true;
        function sync() {
            if (inView && !document.hidden) motion.start();
            else motion.stop();
        }
        if ("IntersectionObserver" in window) {
            var io = new IntersectionObserver(function (entries) {
                inView = entries[0].isIntersecting;
                sync();
            }, { threshold: 0.01 });
            io.observe(badge);
        }
        document.addEventListener("visibilitychange", sync);
        sync();
    }

    /* ---------------------------------------------------------------- Render */
    function render() {
        injectStyles();
        // In Mountpunkte rendern …
        var mounts = document.querySelectorAll("[data-webbyte-studio-tag]");
        for (var i = 0; i < mounts.length; i++) {
            var el = mounts[i];
            if (el.hasAttribute("data-webbyte-studio-tag-rendered")) continue;
            el.innerHTML = BADGE_HTML;
            el.setAttribute("data-webbyte-studio-tag-rendered", "");
        }
        // … und jede Badge auf der Seite aufwerten (auch statisch eingebaute).
        var badges = document.querySelectorAll(".studio-badge");
        for (var j = 0; j < badges.length; j++) enhance(badges[j]);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", render);
    } else {
        render();
    }
})();
