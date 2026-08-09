/* Souv'nir — shared behaviour for the public pages.
   Language state lives in the hash (#fr / #en) and in localStorage so it
   follows the visitor from one document to the next. */
(function () {
  "use strict";

  var STORE = "souvnir.lang";
  var lang = "fr";

  function readLang() {
    var h = (location.hash || "").replace("#", "").toLowerCase();
    var found = null;
    h.split(/[-\/ ]+/).forEach(function (p) {
      if (p === "fr" || p === "en") { found = p; }
    });
    if (found) { return found; }
    try {
      var saved = localStorage.getItem(STORE);
      if (saved === "fr" || saved === "en") { return saved; }
    } catch (e) { /* storage unavailable */ }
    return (navigator.language || "fr").toLowerCase().indexOf("fr") === 0 ? "fr" : "en";
  }

  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll(".lang-fr").forEach(function (e) { e.hidden = (lang !== "fr"); });
    document.querySelectorAll(".lang-en").forEach(function (e) { e.hidden = (lang !== "en"); });

    var seg = document.getElementById("langSeg");
    if (seg) { seg.dataset.active = (lang === "fr") ? "0" : "1"; }

    var docs = document.querySelectorAll(".doc[data-lang]");
    docs.forEach(function (d) { d.classList.toggle("active", d.dataset.lang === lang); });

    // Carry the language across to the sibling documents.
    document.querySelectorAll("a[data-langlink]").forEach(function (a) {
      a.setAttribute("href", a.dataset.langlink + "#" + lang);
    });
  }

  window.setLang = function (l) {
    lang = (l === "en") ? "en" : "fr";
    try { localStorage.setItem(STORE, lang); } catch (e) { /* ignore */ }
    try { history.replaceState(null, "", "#" + lang); }
    catch (e) { location.hash = lang; }
    apply();
  };

  window.toggleSection = function (btn) {
    var s = btn.closest(".sec");
    var open = s.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  };

  // Reading progress bar.
  var pb = document.getElementById("progress");
  if (pb) {
    var ticking = false;
    var upd = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
      pb.style.transform = "scaleX(" + p + ")";
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(upd); ticking = true; }
    }, { passive: true });
  }

  // Scroll reveal.
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(function (e) { e.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(function (e, i) {
      e.style.transitionDelay = (i % 3) * 90 + "ms";
      io.observe(e);
    });
  }

  lang = readLang();
  apply();
  window.addEventListener("hashchange", function () { lang = readLang(); apply(); });
})();
