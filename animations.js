(() => {
  initMobileNav();
  initContactWhatsApp();

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    return;
  }

  document.body.classList.add("motion-ready");

  const selectors = [
    "section",
    ".trust-card",
    ".process-step",
    ".mv-card",
    ".hours",
    ".footer-col",
    ".story-content p",
    ".about-content p",
    ".founder-content p",
    ".founder-content h2",
    ".founder-note",
    ".founder-options"
  ];

  const targets = [...document.querySelectorAll(selectors.join(","))];
  targets.forEach((el, index) => {
    el.classList.add("reveal-target");
    el.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
  });

  const sectionGroups = [...document.querySelectorAll("section, .footer-shell, .founder-shell, .contact-shell, .about-shell, .trust-shell")];
  sectionGroups.forEach((group) => {
    const items = group.querySelectorAll("h1, h2, h3, p, li, .cta-btn, .ghost-btn, .whatsapp-btn");
    items.forEach((item, idx) => {
      item.style.setProperty("--reveal-delay", `${Math.min(idx * 50, 420)}ms`);
    });
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("is-visible");
        if (entry.target.classList.contains("trust-card")) {
          const stat = entry.target.querySelector("h3");
          if (stat) {
            animateStat(stat);
          }
        }
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  targets.forEach((target) => observer.observe(target));

  const updateProgress = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const progress = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
    document.body.style.setProperty("--scroll-progress", `${progress.toFixed(2)}%`);
    const heroParallax = Math.min(doc.scrollTop * 0.08, 22);
    document.body.style.setProperty("--hero-parallax", `${heroParallax.toFixed(2)}px`);
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  function animateStat(node) {
    if (node.dataset.counted === "true") {
      return;
    }

    const original = node.textContent ? node.textContent.trim() : "";
    const match = original.match(/^(\d+)(.*)$/);
    if (!match) {
      return;
    }

    const target = Number(match[1]);
    const suffix = match[2] || "";
    if (suffix.includes("/")) {
      return;
    }

    const duration = 900;
    const start = performance.now();
    node.dataset.counted = "true";

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      node.textContent = `${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }

  const heroShell = document.querySelector(".hero-shell");
  if (heroShell && window.matchMedia("(pointer: fine)").matches) {
    heroShell.addEventListener("mousemove", (event) => {
      const rect = heroShell.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroShell.style.transform = `rotateX(${(-y * 1.5).toFixed(2)}deg) rotateY(${(x * 2).toFixed(2)}deg)`;
      heroShell.style.setProperty("--spot-x", `${((x + 0.5) * 100).toFixed(2)}%`);
      heroShell.style.setProperty("--spot-y", `${((y + 0.5) * 100).toFixed(2)}%`);
    });

    heroShell.addEventListener("mouseleave", () => {
      heroShell.style.transform = "";
      heroShell.style.setProperty("--spot-x", "50%");
      heroShell.style.setProperty("--spot-y", "18%");
    });
  }

  function initMobileNav() {
    const nav = document.querySelector(".site-nav");
    const toggle = document.querySelector(".site-nav-toggle");
    const links = document.querySelector(".site-links");
    if (!nav || !toggle || !links) {
      return;
    }

    document.documentElement.classList.add("nav-js");
    const mobileQuery = window.matchMedia("(max-width: 760px)");

    const closeMenu = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    const openMenu = () => {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    };

    const syncMenu = () => {
      if (!mobileQuery.matches) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        return;
      }

      const isOpen = nav.classList.contains("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    toggle.addEventListener("click", () => {
      if (nav.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (mobileQuery.matches) {
          closeMenu();
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeMenu();
      }
    });

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", syncMenu);
    } else {
      mobileQuery.addListener(syncMenu);
    }

    syncMenu();
  }

  function initContactWhatsApp() {
    const form = document.querySelector(".contact-form");
    if (!form) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = (form.querySelector("#name")?.value || "").trim();
      const phone = (form.querySelector("#phone")?.value || "").trim();
      const subject = (form.querySelector("#subject")?.value || "").trim();
      const message = (form.querySelector("#message")?.value || "").trim();

      const lines = [
        "Hello TONIE_TECH,",
        "",
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Subject: ${subject}`,
        "Message:",
        message
      ];

      const whatsappMessage = encodeURIComponent(lines.join("\n"));
      const whatsappUrl = `https://wa.me/254762220299?text=${whatsappMessage}`;
      window.open(whatsappUrl, "_blank", "noopener");
    });
  }
})();
