(() => {
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
    });

    heroShell.addEventListener("mouseleave", () => {
      heroShell.style.transform = "";
    });
  }
})();
