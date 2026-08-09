// =========================================================
// Chaitanya Thakur — Portfolio interactions
// Scroll progress, nav state, reveal-on-scroll, counters,
// hero text entrance, active nav highlighting, mobile menu
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- scroll progress bar ---------- */
  const progressBar = document.querySelector(".scroll-progress");
  const nav = document.querySelector(".nav");

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
    if (nav) nav.classList.toggle("scrolled", scrollTop > 20);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav toggle ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      navToggle.classList.toggle("active");
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => navLinks.classList.remove("open"))
    );
  }

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.getAttribute("data-count"));
        const suffix = el.getAttribute("data-suffix") || "";

        if (prefersReducedMotion) {
          el.textContent = target + suffix;
          counterObserver.unobserve(el);
          return;
        }

        const duration = 1400;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target * eased;
          el.textContent =
            (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((el) => counterObserver.observe(el));

  /* ---------- hero entrance ---------- */
  const heroLines = document.querySelectorAll(".hero h1 .line span");
  heroLines.forEach((span, i) => {
    span.style.transition = `transform 0.9s cubic-bezier(0.22,1,0.36,1) ${0.12 * i}s, opacity 0.9s ease ${
      0.12 * i
    }s`;
    requestAnimationFrame(() => {
      span.style.transform = "translateY(0)";
      span.style.opacity = "1";
    });
  });

  const heroFade = [
    { el: document.querySelector(".eyebrow"), delay: 0 },
    { el: document.querySelector(".hero p.sub"), delay: 500 },
    { el: document.querySelector(".hero .actions"), delay: 650 },
    { el: document.querySelector(".hero-meta"), delay: 800 },
  ];
  heroFade.forEach(({ el, delay }) => {
    if (!el) return;
    el.style.transition = "opacity 0.8s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1)";
    el.style.transform = "translateY(16px)";
    setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, delay);
  });

  /* ---------- active nav link on scroll ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navAnchors.forEach((a) => a.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- smooth-scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const targetId = a.getAttribute("href");
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ---------- subtle tilt on project cards (disabled for reduced motion) ---------- */
  if (!prefersReducedMotion) {
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / rect.height) * -2.5;
        const rotateY = ((x - rect.width / 2) / rect.width) * 2.5;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------- current year in footer ---------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
