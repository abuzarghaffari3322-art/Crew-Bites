"use strict";

const WHATSAPP_NUMBER = "923356361132";
const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Karnal+Sher+Khan+Killi";

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

document.addEventListener("DOMContentLoaded", initialiseSite);

function initialiseSite() {
  const header = document.querySelector("body > header:first-of-type");
  const navigationLinks = [
    ...document.querySelectorAll("nav a[href^='#']"),
  ];

  setUpSmoothScrolling(header, navigationLinks);
  setUpActiveNavigation(header, navigationLinks);
  setUpVisitLink();
  setUpWhatsAppOrdering();
  setUpScrollReveal();
  updateFooterYear();
}

function setUpSmoothScrolling(header, navigationLinks) {
  const anchorLinks = [
    ...document.querySelectorAll("a[href^='#']:not([href='#'])"),
  ];

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.hash);

      if (!target) {
        return;
      }

      event.preventDefault();
      const headerHeight = header?.offsetHeight ?? 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: Math.max(0, top),
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      });

      window.history.pushState(null, "", link.hash);

      if (navigationLinks.includes(link)) {
        setActiveLink(navigationLinks, target.id);
      }
    });
  });
}

function setUpActiveNavigation(header, navigationLinks) {
  if (!("IntersectionObserver" in window) || navigationLinks.length === 0) {
    return;
  }

  const sections = navigationLinks
    .map((link) => document.querySelector(link.hash))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleSection = entries.find((entry) => entry.isIntersecting);

      if (visibleSection) {
        setActiveLink(navigationLinks, visibleSection.target.id);
      }
    },
    {
      rootMargin: `-${header?.offsetHeight ?? 0}px 0px -55%`,
      threshold: 0,
    },
  );

  sections.forEach((section) => observer.observe(section));
}

function setActiveLink(links, sectionId) {
  links.forEach((link) => {
    const isCurrentSection = link.hash === `#${sectionId}`;

    link.classList.toggle("is-active", isCurrentSection);
    if (isCurrentSection) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function setUpVisitLink() {
  const visitLink = document.querySelector(".about a");

  if (!visitLink) {
    return;
  }

  visitLink.href = MAP_URL;
  visitLink.target = "_blank";
  visitLink.rel = "noopener";
}

function setUpWhatsAppOrdering() {
  const generalOrderLink = document.querySelector(".contact > a[href*='wa.me']");

  if (generalOrderLink) {
    generalOrderLink.href = createWhatsAppUrl(
      "Hello Crew Bites! I would like to place an order.",
    );
    generalOrderLink.target = "_blank";
    generalOrderLink.rel = "noopener";
  }

  document.querySelectorAll(".menu-grid .card").forEach((card) => {
    const itemName = card.querySelector("h4")?.textContent.trim();
    const price = card.querySelector(".price")?.textContent.trim();
    const cardBody = card.querySelector(".card-body");

    if (!itemName || !cardBody) {
      return;
    }

    const orderButton = document.createElement("button");
    orderButton.type = "button";
    orderButton.className = "menu-order-button";
    orderButton.textContent = "Order on WhatsApp";
    orderButton.setAttribute("aria-label", `Order ${itemName} on WhatsApp`);

    orderButton.addEventListener("click", () => {
      const orderDetails = price ? ` (${price})` : "";
      const message = `Hello Crew Bites! I would like to order ${itemName}${orderDetails}.`;

      window.open(createWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    });

    cardBody.append(orderButton);
  });
}

function createWhatsAppUrl(message) {
  const url = new URL(`https://wa.me/${WHATSAPP_NUMBER}`);
  url.searchParams.set("text", message);

  return url.toString();
}

function setUpScrollReveal() {
  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    return;
  }

  const revealTargets = document.querySelectorAll(
    ".card, .about, .contact h3, .contact-item",
  );

  document.documentElement.classList.add("js");

  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );

  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    observer.observe(target);
  });
}

function updateFooterYear() {
  const footer = document.querySelector("body > header:last-of-type");

  if (footer) {
    footer.textContent = `© ${new Date().getFullYear()} Crew Bites | Made with ♥ and Caffeine`;
  }
}
