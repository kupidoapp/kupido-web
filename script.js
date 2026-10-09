"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

function setMenuOpen(isOpen) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  siteNav.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

document.addEventListener("pointerdown", (event) => {
  if (menuToggle.getAttribute("aria-expanded") === "true" && !event.target.closest(".site-header")) {
    setMenuOpen(false);
  }
});

const faqQuestions = document.querySelectorAll(".faq-question");
faqQuestions.forEach((question) => {
  question.addEventListener("click", () => {
    const isExpanded = question.getAttribute("aria-expanded") === "true";
    const answer = question.closest(".faq-item").querySelector(".faq-answer");
    question.setAttribute("aria-expanded", String(!isExpanded));
    answer.hidden = isExpanded;
  });
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());

const navigationLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const observedSections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navigationLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${entry.target.id}`;
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
        link.classList.toggle("is-active", isActive);
      });
    });
  }, { rootMargin: "-25% 0px -65% 0px" });

  observedSections.forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".section-heading, .feature-card, .about-visual, .team-card, .gallery-item, .faq-item").forEach((element) => {
    element.classList.add("js-reveal");
    revealObserver.observe(element);
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 800 && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
  }
});

const galleryFilters = document.querySelectorAll(".gallery-filter");
const galleryCards = [...document.querySelectorAll(".full-gallery-card")];
const galleryEmpty = document.querySelector(".gallery-empty");

galleryFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const selectedCategory = filter.dataset.filter;

    galleryFilters.forEach((button) => {
      const isSelected = button === filter;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });

    let visibleCount = 0;
    galleryCards.forEach((card) => {
      const isVisible = selectedCategory === "all" || card.dataset.category === selectedCategory;
      card.classList.toggle("is-hidden", !isVisible);
      if (isVisible) visibleCount += 1;
    });

    galleryEmpty.hidden = visibleCount > 0;
  });
});

const lightbox = document.querySelector(".lightbox-dialog");

if (lightbox) {
  const lightboxImage = lightbox.querySelector(".lightbox-image");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const lightboxTriggers = [...document.querySelectorAll(".lightbox-trigger")];
  let activeImageIndex = 0;

  function getVisibleTriggers() {
    return lightboxTriggers.filter((trigger) => !trigger.closest(".full-gallery-card").classList.contains("is-hidden"));
  }

  function showLightboxImage(index) {
    const visibleTriggers = getVisibleTriggers();
    if (visibleTriggers.length === 0) return;

    activeImageIndex = (index + visibleTriggers.length) % visibleTriggers.length;
    const trigger = visibleTriggers[activeImageIndex];
    const image = trigger.querySelector("img");
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = trigger.dataset.caption;
  }

  lightboxTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const visibleTriggers = getVisibleTriggers();
      showLightboxImage(visibleTriggers.indexOf(trigger));
      lightbox.showModal();
    });
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showLightboxImage(activeImageIndex - 1));
  lightbox.querySelector(".lightbox-next").addEventListener("click", () => showLightboxImage(activeImageIndex + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showLightboxImage(activeImageIndex - 1);
    if (event.key === "ArrowRight") showLightboxImage(activeImageIndex + 1);
  });
  lightbox.addEventListener("close", () => {
    lightboxImage.removeAttribute("src");
  });
}
