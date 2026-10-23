/**
 * CORE RESOLUTION GROUP INC. — Contact Form
 * ===========================================
 * Client-side validation and demo submission flow.
 * When a production endpoint is ready, replace the
 * simulated submission with a real fetch() call.
 */

(function () {
  "use strict";

  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("contact-submit");
  const formBody = document.getElementById("contact-form-body");
  const successEl = document.getElementById("contact-success");
  const failureEl = document.getElementById("contact-failure");

  if (!form) return;

  let isSubmitting = false;

  // Simple email regex for client-side check
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Field configs for validation
  const FIELDS = [
    { id: "contact-name", required: true, label: "Full Name" },
    { id: "contact-email", required: true, label: "Work Email", type: "email" },
    { id: "contact-company", required: true, label: "Company Name" },
    { id: "contact-code", required: false, label: "Company Code" },
    { id: "contact-subject", required: true, label: "Subject" },
    { id: "contact-message", required: true, label: "Message" },
  ];

  function validateField(config) {
    const field = document.getElementById(config.id);
    if (!field) return true;

    const value = field.value.trim();
    const errorEl = document.getElementById(config.id + "-error");

    // Remove previous errors
    field.classList.remove("form-input--error", "form-textarea--error");
    if (errorEl) errorEl.classList.remove("form-error--visible");

    // Required check
    if (config.required && !value) {
      field.classList.add(
        field.tagName === "TEXTAREA" ? "form-textarea--error" : "form-input--error"
      );
      if (errorEl) {
        errorEl.textContent = `${config.label} is required.`;
        errorEl.classList.add("form-error--visible");
      }
      return false;
    }

    // Email format
    if (config.type === "email" && value && !EMAIL_REGEX.test(value)) {
      field.classList.add("form-input--error");
      if (errorEl) {
        errorEl.textContent = "Please enter a valid email address.";
        errorEl.classList.add("form-error--visible");
      }
      return false;
    }

    return true;
  }

  function validateAll() {
    let allValid = true;
    let firstInvalid = null;

    FIELDS.forEach((config) => {
      const valid = validateField(config);
      if (!valid && allValid) {
        firstInvalid = document.getElementById(config.id);
        allValid = false;
      } else if (!valid) {
        allValid = false;
      }
    });

    // Privacy checkbox
    const privacy = document.getElementById("contact-privacy");
    if (privacy && !privacy.checked) {
      allValid = false;
      const privacyError = document.getElementById("contact-privacy-error");
      if (privacyError) {
        privacyError.textContent = "Please acknowledge the privacy statement to continue.";
        privacyError.classList.add("form-error--visible");
      }
      if (!firstInvalid) firstInvalid = privacy;
    } else {
      const privacyError = document.getElementById("contact-privacy-error");
      if (privacyError) privacyError.classList.remove("form-error--visible");
    }

    if (firstInvalid) firstInvalid.focus();
    return allValid;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateAll()) return;

    isSubmitting = true;
    submitBtn.classList.add("btn--loading");
    submitBtn.textContent = "Submitting…";
    submitBtn.setAttribute("aria-busy", "true");

    // --- Demo submission simulation ---
    // IMPORTANT: This does NOT actually send the inquiry anywhere.
    // Replace this block with a real fetch() call when a backend is available.
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate success
      formBody.style.display = "none";
      successEl.classList.add("form-success--visible");
    } catch (err) {
      formBody.style.display = "none";
      failureEl.classList.add("form-failure--visible");
      console.error("Form submission error:", err);
    } finally {
      isSubmitting = false;
      submitBtn.classList.remove("btn--loading");
      submitBtn.textContent = "Submit Inquiry";
      submitBtn.removeAttribute("aria-busy");
    }
  }

  form.addEventListener("submit", handleSubmit);

  // Real-time validation clearing
  FIELDS.forEach((config) => {
    const field = document.getElementById(config.id);
    if (field) {
      field.addEventListener("input", () => validateField(config));
    }
  });

  // Reset button inside success/failure
  const resetBtns = document.querySelectorAll("[data-contact-reset]");
  resetBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      form.reset();
      formBody.style.display = "";
      successEl.classList.remove("form-success--visible");
      failureEl.classList.remove("form-failure--visible");
      isSubmitting = false;
    });
  });
})();
