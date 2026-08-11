(function () {
  "use strict";

  var UTM_STORAGE_KEY = "souvnir.web.attribution";
  var scrollMilestones = [25, 50, 75, 100];
  var firedScrollMilestones = {};

  function getLanguage() {
    return document.body.dataset.language || document.documentElement.lang || "fr";
  }

  function getDeviceType() {
    var width = window.innerWidth;

    if (width < 768) return "mobile";
    if (width < 1100) return "tablet";
    return "desktop";
  }

  function getStoredAttribution() {
    try {
      return JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function collectAttribution() {
    var params = new URLSearchParams(window.location.search);
    var current = getStoredAttribution();

    var keys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term"
    ];

    keys.forEach(function (key) {
      var value = params.get(key);
      if (value) current[key] = value;
    });

    if (!current.first_referrer && document.referrer) {
      current.first_referrer = document.referrer;
    }

    try {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
      // Storage unavailable — attribution still works for current page.
    }

    return current;
  }

  var attribution = collectAttribution();

  function baseProperties() {
    return Object.assign(
      {
        page: document.body.dataset.page || "unknown",
        language: getLanguage(),
        device_type: getDeviceType(),
        path: window.location.pathname
      },
      attribution
    );
  }

  function capture(eventName, properties) {
    var payload = Object.assign({}, baseProperties(), properties || {});

    if (
      window.posthog &&
      typeof window.posthog.capture === "function"
    ) {
      window.posthog.capture(eventName, payload);
    }

    /*
      Development helper.
      Uncomment temporarily if you want to inspect events locally:

      console.log("[Souvnir analytics]", eventName, payload);
    */
  }

  function configureAppStoreLinks() {
    var meta = document.querySelector('meta[name="souvnir:app-store-url"]');
    var url = meta ? meta.getAttribute("content").trim() : "";

    document.querySelectorAll("[data-appstore]").forEach(function (link) {
      if (url) {
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener";
        link.removeAttribute("aria-disabled");
        link.classList.remove("is-disabled");
      } else {
        link.href = "#";
        link.setAttribute("aria-disabled", "true");
        link.classList.add("is-disabled");

        var language = getLanguage();

        if (language === "fr") {
          if (link.dataset.ctaLocation !== "nav") {
            link.textContent = "Bientôt sur l’App Store";
          }
        } else {
          if (link.dataset.ctaLocation !== "nav") {
            link.textContent = "Coming soon to the App Store";
          }
        }
      }

      link.addEventListener("click", function (event) {
        capture("appstore_click", {
          cta_location: link.dataset.ctaLocation || "unknown",
          appstore_live: Boolean(url)
        });

        if (!url) {
          event.preventDefault();
        }
      });
    });
  }

  function configureGeneralTracking() {
    document.querySelectorAll("[data-track]").forEach(function (element) {
      element.addEventListener("click", function () {
        capture(element.dataset.track, {
          label: element.textContent.trim().slice(0, 120)
        });
      });
    });

    document.querySelectorAll("[data-language-switch]").forEach(function (link) {
      link.addEventListener("click", function () {
        capture("language_switch", {
          from_language: getLanguage(),
          to_language: link.dataset.languageSwitch
        });
      });
    });
  }

  function configureFAQTracking() {
    document.querySelectorAll("details[data-faq]").forEach(function (detail) {
      detail.addEventListener("toggle", function () {
        if (!detail.open) return;

        capture("faq_open", {
          faq: detail.dataset.faq
        });
      });
    });
  }

  function configureUseCaseTracking() {
    if (!("IntersectionObserver" in window)) return;

    var seen = {};

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var useCase = entry.target.dataset.usecase;

          if (!useCase || seen[useCase]) return;

          seen[useCase] = true;

          capture("usecase_view", {
            usecase: useCase
          });

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.55
      }
    );

    document.querySelectorAll("[data-usecase]").forEach(function (element) {
      observer.observe(element);
    });
  }

  function configureDemoTracking() {
    var section = document.querySelector("[data-demo-section]");

    if (!section || !("IntersectionObserver" in window)) return;

    var fired = false;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || fired) return;

          fired = true;
          capture("story_section_view");
          observer.disconnect();
        });
      },
      {
        threshold: 0.45
      }
    );

    observer.observe(section);

    var demoButton = document.querySelector(".play-demo");

    if (demoButton) {
      demoButton.addEventListener("click", function () {
        capture("hero_demo_interaction");

        demoButton.classList.add("is-playing");

        window.setTimeout(function () {
          demoButton.classList.remove("is-playing");
        }, 900);
      });
    }
  }

  function configureScrollTracking() {
    function calculateScrollPercentage() {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - window.innerHeight;

      if (scrollable <= 0) return 100;

      return Math.round((window.scrollY / scrollable) * 100);
    }

    function handleScroll() {
      var percentage = calculateScrollPercentage();

      scrollMilestones.forEach(function (milestone) {
        if (
          percentage >= milestone &&
          !firedScrollMilestones[milestone]
        ) {
          firedScrollMilestones[milestone] = true;

          capture("scroll_depth", {
            percentage: milestone
          });
        }
      });
    }

    var ticking = false;

    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;

        ticking = true;

        window.requestAnimationFrame(function () {
          handleScroll();
          ticking = false;
        });
      },
      { passive: true }
    );

    handleScroll();
  }

  function configureHeader() {
    var header = document.querySelector(".site-header");

    if (!header) return;

    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }

    update();

    window.addEventListener("scroll", update, { passive: true });
  }

  function start() {
    capture("landing_view");

    configureAppStoreLinks();
    configureGeneralTracking();
    configureFAQTracking();
    configureUseCaseTracking();
    configureDemoTracking();
    configureScrollTracking();
    configureHeader();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
