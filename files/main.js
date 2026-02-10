/**
 * Ember & Oak — Main JavaScript
 * Wood-Fired Kitchen & Bar Landing Page
 */

"use strict";

/* ─── 1. DARK MODE TOGGLE ─────────────────────────────────────────── */
(function initTheme() {
  const saved = localStorage.getItem("eo-theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  updateThemeIcon(saved);
})();

function updateThemeIcon(theme) {
  const icon = document.getElementById("themeIcon");
  if (!icon) return;
  icon.className = theme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-fill";
}

document.getElementById("themeToggle")?.addEventListener("click", () => {
  const html = document.documentElement;
  const current = html.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("eo-theme", next);
  updateThemeIcon(next);
});


/* ─── 2. STICKY NAVBAR ────────────────────────────────────────────── */
(function initNavbar() {
  const nav = document.getElementById("mainNav");
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run on load
})();


/* ─── 3. SMOOTH SCROLL & ACTIVE NAV LINKS ────────────────────────── */
(function initNavLinks() {
  // Smooth scroll for anchor links (backup for browsers without CSS support)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // Close mobile nav if open
      const navCollapse = document.getElementById("navMenu");
      if (navCollapse?.classList.contains("show")) {
        const toggler = document.querySelector(".navbar-toggler");
        toggler?.click();
      }
    });
  });

  // Active link highlighting on scroll
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { threshold: 0.4, rootMargin: "-80px 0px -40% 0px" }
  );

  sections.forEach(s => observer.observe(s));
})();


/* ─── 4. TODAY'S SPECIAL BADGE ───────────────────────────────────── */
(function initTodaySpecial() {
  const badge = document.getElementById("todaySpecialBadge");
  const specialText = document.getElementById("specialText");
  if (!badge || !specialText) return;

  const specials = {
    0: null, // Sunday – no special message, kitchen has a different special
    1: null, // Monday – closed
    2: { text: "Tuesday Special: Fire-Roasted Lamb Chops — limited seats!", show: true },
    3: { text: "Wednesday Special: Wild Mushroom Risotto with truffle oil", show: true },
    4: { text: "Thursday Special: 48-hr Braised Short Rib — only 12 portions!", show: true },
    5: { text: "Friday Special: Whole-Roasted Sea Bass — wood-fired to perfection", show: true },
    6: { text: "Saturday Special: Côte de Boeuf for Two — ask your server!", show: true },
  };

  const today = new Date().getDay();
  const special = specials[today];

  if (special && special.show) {
    specialText.textContent = "🍽️ " + special.text;
    badge.classList.remove("d-none");
    badge.style.display = "inline-flex";
  }
})();


/* ─── 5. GALLERY LIGHTBOX ────────────────────────────────────────── */
(function initGallery() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  const modalEmoji = document.getElementById("modalEmoji");
  const modalCaption = document.getElementById("modalCaption");
  const galleryCounter = document.getElementById("galleryCounter");
  const prevBtn = document.getElementById("prevImg");
  const nextBtn = document.getElementById("nextImg");

  const emojis = ["🔥", "👨‍🍳", "🕯️", "🍽️", "🪵", "🍹"];
  const bgColors = [
    "linear-gradient(135deg, #1a0800 0%, #8B3A00 60%, #FF8C00 100%)",
    "linear-gradient(135deg, #2C1810 0%, #8B4513 100%)",
    "linear-gradient(135deg, #1C1008 0%, #5C3317 60%, #C9A96E 100%)",
    "linear-gradient(135deg, #704214 0%, #E8A020 100%)",
    "linear-gradient(135deg, #3D2B1F 0%, #7B4F2E 60%, #A0785A 100%)",
    "linear-gradient(135deg, #0D2137 0%, #1A6B8A 60%, #5BB8D4 100%)",
  ];

  let currentIndex = 0;
  const total = galleryItems.length;

  function showImage(index) {
    currentIndex = ((index % total) + total) % total;
    const item = galleryItems[currentIndex];
    const caption = item.getAttribute("data-caption") || "";

    if (modalEmoji) {
      modalEmoji.textContent = emojis[currentIndex] || "🔥";
      modalEmoji.parentElement.style.background = bgColors[currentIndex] || "";
    }
    if (modalCaption) modalCaption.textContent = caption;
    if (galleryCounter) galleryCounter.textContent = `${currentIndex + 1} / ${total}`;

    // Update aria-label on the modal for screen readers
    const modalEl = document.getElementById("galleryModal");
    if (modalEl) modalEl.setAttribute("aria-label", `Gallery image ${currentIndex + 1} of ${total}: ${caption}`);
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener("click", () => showImage(idx));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showImage(idx);
      }
    });
  });

  prevBtn?.addEventListener("click", () => showImage(currentIndex - 1));
  nextBtn?.addEventListener("click", () => showImage(currentIndex + 1));

  // Keyboard navigation inside modal
  document.getElementById("galleryModal")?.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft")  showImage(currentIndex - 1);
    if (e.key === "ArrowRight") showImage(currentIndex + 1);
  });
})();


/* ─── 6. FORM VALIDATION ─────────────────────────────────────────── */
(function initForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  const successMsg = document.getElementById("formSuccess");

  // Character counter for textarea
  const notesField = document.getElementById("notes");
  const charCount = document.getElementById("charCount");
  notesField?.addEventListener("input", () => {
    if (charCount) charCount.textContent = notesField.value.length;
  });

  // Set minimum date to today
  const dateField = document.getElementById("date");
  if (dateField) {
    const today = new Date().toISOString().split("T")[0];
    dateField.setAttribute("min", today);
  }

  // Validation rules
  const validators = {
    firstName: {
      validate: (val) => {
        if (!val.trim()) return "First name is required.";
        if (val.trim().length < 2) return "First name must be at least 2 characters.";
        if (val.trim().length > 50) return "First name must be under 50 characters.";
        return null;
      }
    },
    lastName: {
      validate: (val) => {
        if (!val.trim()) return "Last name is required.";
        if (val.trim().length < 2) return "Last name must be at least 2 characters.";
        if (val.trim().length > 50) return "Last name must be under 50 characters.";
        return null;
      }
    },
    email: {
      validate: (val) => {
        if (!val.trim()) return "Email address is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val.trim())) return "Please enter a valid email address.";
        return null;
      }
    },
    phone: {
      validate: (val) => {
        if (!val.trim()) return "Phone number is required.";
        const stripped = val.replace(/[\s\-().+]/g, "");
        if (stripped.length < 7) return "Phone number must be at least 7 digits.";
        if (stripped.length > 15) return "Phone number must be under 15 digits.";
        if (!/^\d+$/.test(stripped)) return "Phone number may only contain digits, spaces, and + - ( ).";
        return null;
      }
    },
    date: {
      validate: (val) => {
        if (!val) return "Please select a date.";
        const selected = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) return "Please select a future date.";
        // Restaurant closed on Mondays
        if (selected.getDay() === 1) return "We're closed on Mondays. Please choose another day.";
        return null;
      }
    },
    time: {
      validate: (val) => {
        if (!val) return "Please select a preferred time.";
        return null;
      }
    },
    guests: {
      validate: (val) => {
        if (!val) return "Please select the number of guests.";
        return null;
      }
    },
    agreeTerms: {
      validate: (val, field) => {
        if (!field.checked) return "Please agree to the cancellation policy.";
        return null;
      }
    }
  };

  function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return true;

    const rule = validators[fieldId];
    if (!rule) return true;

    const error = rule.validate(field.type === "checkbox" ? field.value : field.value, field);
    const feedback = field.parentElement.querySelector(".invalid-feedback");

    if (error) {
      field.classList.add("is-invalid");
      field.classList.remove("is-valid");
      if (feedback) feedback.textContent = error;
      return false;
    } else {
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
      if (feedback) feedback.textContent = "";
      return true;
    }
  }

  // Real-time validation on blur
  Object.keys(validators).forEach(fieldId => {
    const field = document.getElementById(fieldId);
    field?.addEventListener("blur", () => validateField(fieldId));
    field?.addEventListener("change", () => {
      if (field.classList.contains("is-invalid")) validateField(fieldId);
    });
  });

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;
    Object.keys(validators).forEach(fieldId => {
      if (!validateField(fieldId)) isValid = false;
    });

    if (!isValid) {
      // Scroll to first error
      const firstError = form.querySelector(".is-invalid");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      firstError?.focus();
      return;
    }

    // Simulate submission
    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Confirming...';
    }

    setTimeout(() => {
      form.reset();
      form.querySelectorAll(".is-valid").forEach(el => el.classList.remove("is-valid"));
      if (successMsg) successMsg.classList.remove("d-none");
      if (charCount) charCount.textContent = "0";
      if (submitBtn) submitBtn.style.display = "none";
      successMsg?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 1500);
  });
})();


/* ─── 7. SCROLL FADE-IN ANIMATIONS ──────────────────────────────── */
(function initScrollAnimations() {
  const targets = document.querySelectorAll(
    ".menu-card, .gallery-item, .testimonial-card, .stat-card, .contact-detail, .about-image-wrap"
  );

  targets.forEach(el => el.classList.add("fade-in-up"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach(el => observer.observe(el));
})();


/* ─── 8. FOOTER YEAR ─────────────────────────────────────────────── */
const footerYear = document.getElementById("footerYear");
if (footerYear) footerYear.textContent = new Date().getFullYear();
