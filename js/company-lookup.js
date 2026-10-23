/**
 * CORE RESOLUTION GROUP INC. — Company Code Lookup
 * =================================================
 * Frontend demonstration using mock data from data.js.
 * When a production API is available, replace the lookupCompany()
 * call with a fetch to /api/company-lookup.
 */

(function () {
  "use strict";

  const form = document.getElementById("lookup-form");
  const input = document.getElementById("lookup-input");
  const submitBtn = document.getElementById("lookup-submit");
  const errorEl = document.getElementById("lookup-error");
  const loadingEl = document.getElementById("lookup-loading");
  const resultEl = document.getElementById("lookup-result");
  const notFoundEl = document.getElementById("lookup-not-found");
  const helpLink = document.getElementById("lookup-help-link");
  const helpModal = document.getElementById("help-modal");

  if (!form || !input) return;

  // Reset all states
  function resetStates() {
    errorEl.classList.remove("lookup__error--visible");
    loadingEl.classList.remove("lookup__loading--visible");
    resultEl.classList.remove("lookup__result--visible");
    notFoundEl.classList.remove("lookup__not-found--visible");
    input.classList.remove("lookup__input--error");
  }

  // Show inline error
  function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.add("lookup__error--visible");
    input.classList.add("lookup__input--error");
    input.focus();
  }

  // Render a successful result
  function renderResult(company) {
    const statusClass =
      company.status === "Active"
        ? "lookup__result-badge--status"
        : "lookup__result-badge--review";

    resultEl.innerHTML = `
      <div class="lookup__result-header">
        <h4 class="lookup__result-title">${escapeHTML(company.name)}</h4>
        <span class="lookup__result-badge lookup__result-badge--demo">Sample Record</span>
      </div>
      <div class="lookup__result-grid">
        <div class="lookup__result-field">
          <span class="lookup__result-label">Reference Code</span>
          <span class="lookup__result-value">${escapeHTML(company.referenceCode)}</span>
        </div>
        <div class="lookup__result-field">
          <span class="lookup__result-label">Status</span>
          <span class="lookup__result-badge ${statusClass}">${escapeHTML(company.status)}</span>
        </div>
        <div class="lookup__result-field">
          <span class="lookup__result-label">Industry</span>
          <span class="lookup__result-value">${escapeHTML(company.industry)}</span>
        </div>
        <div class="lookup__result-field">
          <span class="lookup__result-label">Contact</span>
          <span class="lookup__result-value">${escapeHTML(company.contactEmail)}</span>
        </div>
        <div class="lookup__result-field">
          <span class="lookup__result-label">Date Registered</span>
          <span class="lookup__result-value">${escapeHTML(company.dateRegistered)}</span>
        </div>
        <div class="lookup__result-field">
          <span class="lookup__result-label">Assigned To</span>
          <span class="lookup__result-value">${escapeHTML(company.assignedRepresentative)}</span>
        </div>
      </div>
      <div class="lookup__result-footer">
        <span class="lookup__result-demo-label">Demo data — not a real company record</span>
        <a href="#contact" class="btn btn--primary btn--sm">Contact Us</a>
      </div>
    `;
    resultEl.classList.add("lookup__result--visible");
  }

  // Render not-found state
  function renderNotFound(code) {
    const notFoundTitle = notFoundEl.querySelector(".lookup__not-found-title");
    if (notFoundTitle) {
      notFoundTitle.textContent = "Company Not Found";
    }
    notFoundEl.classList.add("lookup__not-found--visible");
  }

  // Escape HTML to prevent XSS
  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    resetStates();

    const code = input.value.trim();

    // Validate: not empty
    if (!code) {
      showError("Please enter a company code to continue.");
      return;
    }

    // Validate: reasonable format (alphanumeric + hyphens, 3–30 chars)
    if (!/^[A-Za-z0-9\-]{3,30}$/.test(code)) {
      showError("Please enter a valid company code (letters, numbers, and hyphens only).");
      return;
    }

    // Show loading
    loadingEl.classList.add("lookup__loading--visible");
    submitBtn.classList.add("btn--loading");
    submitBtn.setAttribute("aria-busy", "true");

    try {
      // lookupCompany is defined in data.js
      const result = await lookupCompany(code);

      resetStates();

      if (result) {
        renderResult(result);
      } else {
        renderNotFound(code);
      }
    } catch (err) {
      resetStates();
      showError("An error occurred during lookup. Please try again.");
      console.error("Lookup error:", err);
    } finally {
      submitBtn.classList.remove("btn--loading");
      submitBtn.removeAttribute("aria-busy");
    }
  }

  // Retry button
  const retryBtn = document.getElementById("lookup-retry");
  if (retryBtn) {
    retryBtn.addEventListener("click", function () {
      resetStates();
      input.value = "";
      input.focus();
    });
  }

  // Help modal
  if (helpLink && helpModal) {
    helpLink.addEventListener("click", function (e) {
      e.preventDefault();
      helpModal.classList.add("modal-overlay--visible");
      document.body.style.overflow = "hidden";
      const closeBtn = helpModal.querySelector(".modal__close");
      if (closeBtn) closeBtn.focus();
    });

    const closeHelpModal = function () {
      helpModal.classList.remove("modal-overlay--visible");
      document.body.style.overflow = "";
      helpLink.focus();
    };

    const helpCloseBtn = helpModal.querySelector(".modal__close");
    if (helpCloseBtn) {
      helpCloseBtn.addEventListener("click", closeHelpModal);
    }

    helpModal.addEventListener("click", function (e) {
      if (e.target === helpModal) closeHelpModal();
    });

    helpModal.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeHelpModal();
    });
  }

  // Listen for form submit and Enter key
  form.addEventListener("submit", handleSubmit);

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  });

  // Clear error on input
  input.addEventListener("input", function () {
    if (input.classList.contains("lookup__input--error")) {
      input.classList.remove("lookup__input--error");
      errorEl.classList.remove("lookup__error--visible");
    }
  });
})();
