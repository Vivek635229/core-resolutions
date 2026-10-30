/**
 * CORE RESOLUTION GROUP INC. — Company & Insurance Certificate Lookup
 * ===================================================================
 * Functional lookup module retrieving company and insurance certificate data.
 * Supports reference code CA300681 for ACORD Certificate of Liability Insurance.
 *
 * Designed according to Core Resolution Group Inc. design standards:
 * - Keyboard accessible with visible focus states and proper ARIA live regions
 * - Non-destructive UI: preserves input value and allows repeated lookups
 * - Print-friendly certificate output
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

  // Reset all state visibilities
  function resetStates() {
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.remove("lookup__error--visible");
    }
    if (loadingEl) loadingEl.classList.remove("lookup__loading--visible");
    if (resultEl) {
      resultEl.classList.remove("lookup__result--visible");
      resultEl.innerHTML = "";
    }
    if (notFoundEl) notFoundEl.classList.remove("lookup__not-found--visible");
    input.classList.remove("lookup__input--error");
  }

  // Show inline validation or network error
  function showError(message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.add("lookup__error--visible");
    input.classList.add("lookup__input--error");
    input.focus();
  }

  // Format currency numbers consistently as US Dollars ($1,000,000)
  function formatCurrency(val) {
    if (typeof val === "number") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
      }).format(val);
    }
    return val || "Not available";
  }

  // Safe HTML escape helper
  function escapeHTML(str) {
    if (str === null || str === undefined) return "";
    const div = document.createElement("div");
    div.textContent = String(str);
    return div.innerHTML;
  }

  // Render comprehensive Insurance Certificate Result Panel
  function renderInsuranceCertificate(cert) {
    const insurersRows = (cert.insurers || [])
      .map(
        (ins) => `
        <tr>
          <td><span class="lookup__cert-insurer-badge">Insurer ${escapeHTML(ins.letter)}</span></td>
          <td class="lookup__cert-table-name"><strong>${escapeHTML(ins.name)}</strong></td>
          <td><span class="lookup__cert-naic-code">${escapeHTML(ins.naic)}</span></td>
          <td class="lookup__cert-coverage-note">${escapeHTML(ins.coverageAfforded || "Refer to policy")}</td>
        </tr>
      `
      )
      .join("");

    const limitsRows = (cert.generalLiability?.limits || [])
      .map(
        (item) => `
        <tr>
          <td class="lookup__cert-coverage-name">${escapeHTML(item.coverage)}</td>
          <td class="lookup__cert-coverage-amount">${escapeHTML(item.limit)}</td>
        </tr>
      `
      )
      .join("");

    const additionalCards = (cert.additionalCoverages || [])
      .map((item) => {
        const isUnavailable = item.coverageLimit === "Not available" || item.classification === "Not available";
        const badgeClass = isUnavailable ? "lookup__cert-pill--warning" : "lookup__cert-pill--info";
        const badgeText = isUnavailable ? "Partial Excerpt" : "Policy Schedule";

        return `
        <div class="lookup__cert-subcard ${isUnavailable ? "lookup__cert-subcard--warning" : ""}">
          <div class="lookup__cert-subcard-header">
            <h5 class="lookup__cert-subcard-title">${escapeHTML(item.title)}</h5>
            <span class="lookup__cert-pill ${badgeClass}">${badgeText}</span>
          </div>
          <div class="lookup__cert-subcard-body">
            <div class="lookup__cert-subcard-row">
              <span class="lookup__cert-subcard-label">Coverage Limit:</span>
              <span class="lookup__cert-subcard-val ${item.coverageLimit !== "Not available" ? "lookup__cert-subcard-val--highlight" : "lookup__cert-subcard-val--muted"}">
                ${escapeHTML(item.coverageLimit)}
              </span>
            </div>
            <div class="lookup__cert-subcard-row">
              <span class="lookup__cert-subcard-label">Deductible:</span>
              <span class="lookup__cert-subcard-val lookup__cert-subcard-val--highlight">${escapeHTML(item.deductible)}</span>
            </div>
            <div class="lookup__cert-subcard-row">
              <span class="lookup__cert-subcard-label">Policy Period:</span>
              <span class="lookup__cert-subcard-val">${escapeHTML(item.policyPeriod)}</span>
            </div>
            <div class="lookup__cert-subcard-row">
              <span class="lookup__cert-subcard-label">Policy Number:</span>
              <span class="lookup__cert-subcard-val lookup__cert-meta-value--mono">${escapeHTML(item.policyNumber)}</span>
            </div>
            <div class="lookup__cert-subcard-row">
              <span class="lookup__cert-subcard-label">Classification / Details:</span>
              <span class="lookup__cert-subcard-val ${item.classification === "Not available" ? "lookup__cert-subcard-val--muted" : ""}">${escapeHTML(item.classification)}</span>
            </div>
            ${
              item.notice
                ? `<p class="lookup__cert-subcard-notice">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    ${escapeHTML(item.notice)}
                   </p>`
                : ""
            }
          </div>
        </div>
      `;
      })
      .join("");

    resultEl.innerHTML = `
      <div class="lookup__cert-card" id="insurance-cert-panel">
        
        <!-- Print-only Corporate Watermark Header -->
        <div class="lookup__print-header">
          <div class="lookup__print-header-brand">
            <h2>CORE RESOLUTION GROUP INC.</h2>
            <p>Official Insurance Certificate Information Record</p>
          </div>
          <div class="lookup__print-header-meta">
            <span>Reference Code: <strong>${escapeHTML(cert.referenceCode)}</strong></span>
            <span>Date Printed: <strong>${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</strong></span>
          </div>
        </div>

        <!-- Top Overview Banner -->
        <div class="lookup__cert-topbar">
          <div class="lookup__cert-type-tag">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>${escapeHTML(cert.certificateType)} • ${escapeHTML(cert.acordForm || "ACORD 25")}</span>
          </div>
          <div class="lookup__cert-status-tag" role="status">
            <span class="lookup__cert-status-dot" aria-hidden="true"></span>
            <span class="lookup__cert-status-text">${escapeHTML(cert.certificateStatus)}</span>
          </div>
        </div>

        <!-- Header: Company Name & Reference Code -->
        <div class="lookup__cert-header">
          <div class="lookup__cert-header-main">
            <div class="lookup__cert-ref-pill">
              <span class="lookup__cert-ref-label">Reference / Lookup Code:</span>
              <span class="lookup__cert-ref-value">${escapeHTML(cert.referenceCode)}</span>
            </div>
            <h3 class="lookup__cert-company-name">Company Name: ${escapeHTML(cert.companyName)}</h3>
            <p class="lookup__cert-company-note">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span>${escapeHTML(cert.companyNameNote)}</span>
            </p>
          </div>
        </div>

        <!-- Section A: Company & Certificate Overview Grid -->
        <div class="lookup__cert-section">
          <div class="lookup__cert-section-header">
            <h4 class="lookup__cert-section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
              </svg>
              Certificate & Policy Overview
            </h4>
          </div>
          <div class="lookup__cert-meta-grid">
            <div class="lookup__cert-meta-item">
              <span class="lookup__cert-meta-label">Reference / Lookup Code</span>
              <span class="lookup__cert-meta-value lookup__cert-meta-value--mono">${escapeHTML(cert.referenceCode)}</span>
            </div>
            <div class="lookup__cert-meta-item">
              <span class="lookup__cert-meta-label">Certificate Type</span>
              <span class="lookup__cert-meta-value">${escapeHTML(cert.certificateType)}</span>
              <span class="lookup__cert-meta-sub">Standard: ${escapeHTML(cert.acordForm || "ACORD 25")}</span>
            </div>
            <div class="lookup__cert-meta-item">
              <span class="lookup__cert-meta-label">General Liability Period</span>
              <span class="lookup__cert-meta-value">${escapeHTML(cert.generalLiability?.policyPeriod || "March 21, 2026 – March 21, 2027")}</span>
              <span class="lookup__cert-meta-sub">Expiration: ${escapeHTML(cert.generalLiability?.expirationDate || "March 21, 2027")}</span>
            </div>
            <div class="lookup__cert-meta-item">
              <span class="lookup__cert-meta-label">Additional Policy Period</span>
              <span class="lookup__cert-meta-value">May 1, 2026 – May 1, 2027</span>
              <span class="lookup__cert-meta-sub">Expiration: May 1, 2027</span>
            </div>
            <div class="lookup__cert-meta-item">
              <span class="lookup__cert-meta-label">Issuing Contact / Producer</span>
              <span class="lookup__cert-meta-value">${escapeHTML(cert.producer?.contactName || "Certificate Department")}</span>
              <span class="lookup__cert-meta-sub">${escapeHTML(cert.producer?.email || "")} • Tel: ${escapeHTML(cert.producer?.phone || "")}</span>
            </div>
            <div class="lookup__cert-meta-item">
              <span class="lookup__cert-meta-label">Document Retrieval Status</span>
              <span class="lookup__cert-meta-value lookup__cert-meta-value--status">${escapeHTML(cert.certificateStatus)}</span>
              <span class="lookup__cert-meta-sub">On-file record retrieval</span>
            </div>
          </div>
        </div>

        <!-- Section B: Insurance Providers -->
        <div class="lookup__cert-section">
          <div class="lookup__cert-section-header">
            <h4 class="lookup__cert-section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Insurance Companies Affording Coverage
            </h4>
            <span class="lookup__cert-section-hint">Transcribed from Certificate Schedule</span>
          </div>
          <div class="lookup__cert-table-wrap" tabindex="0" role="region" aria-label="Insurance companies table">
            <table class="lookup__cert-table">
              <thead>
                <tr>
                  <th scope="col" style="width: 15%;">Insurer</th>
                  <th scope="col" style="width: 45%;">Company Name</th>
                  <th scope="col" style="width: 18%;">NAIC Number</th>
                  <th scope="col" style="width: 22%;">Coverage Afforded</th>
                </tr>
              </thead>
              <tbody>
                ${insurersRows}
              </tbody>
            </table>
          </div>
          <p class="lookup__cert-footnote">
            Notice: Insurers and coverage types are associated strictly as documented on the policy schedule. Do not infer that each insurer provides every displayed coverage.
          </p>
        </div>

        <!-- Section C: Commercial General Liability Coverage Limits -->
        <div class="lookup__cert-section">
          <div class="lookup__cert-section-header">
            <h4 class="lookup__cert-section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              Commercial General Liability Coverage Limits
            </h4>
            <span class="lookup__cert-section-meta">
              Policy Period: ${escapeHTML(cert.generalLiability?.policyPeriod || "March 21, 2026 – March 21, 2027")} • Policy #: ${escapeHTML(cert.generalLiability?.policyNumber || "...01TGL-112725-UPIS")}
            </span>
          </div>
          <div class="lookup__cert-table-wrap" tabindex="0" role="region" aria-label="General liability limits table">
            <table class="lookup__cert-table lookup__cert-table--limits">
              <thead>
                <tr>
                  <th scope="col" style="width: 65%;">Coverage Item / Type</th>
                  <th scope="col" style="width: 35%; text-align: right;">Coverage Limit (USD)</th>
                </tr>
              </thead>
              <tbody>
                ${limitsRows}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section D: Additional Policy Details -->
        <div class="lookup__cert-section">
          <div class="lookup__cert-section-header">
            <h4 class="lookup__cert-section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
              </svg>
              Additional Coverage Information & Policy Details
            </h4>
            <span class="lookup__cert-section-hint">Separated from Commercial General Liability</span>
          </div>
          <div class="lookup__cert-grid">
            ${additionalCards}
          </div>
        </div>

        <!-- Section E: Mandatory Certificate Reference Notice -->
        <div class="lookup__cert-notice" role="note" aria-label="Official certificate notice">
          <div class="lookup__cert-notice-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div class="lookup__cert-notice-content">
            <h5 class="lookup__cert-notice-title">Important Certificate Notice</h5>
            <p class="lookup__cert-notice-text">
              ${escapeHTML(cert.certificateNotice)}
            </p>
          </div>
        </div>

        <!-- Section F: Actions -->
        <div class="lookup__cert-actions">
          <button type="button" id="lookup-search-another" class="btn btn--secondary btn--sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Search Another Code
          </button>
          <button type="button" id="lookup-print-cert" class="btn btn--primary btn--sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print Certificate Details
          </button>
        </div>

        <p class="lookup__cert-download-note">
          Official certificate PDF downloads are restricted to authorized insurance representatives and account holders. Recreated certificates cannot be presented as official insurance documents.
        </p>

      </div>
    `;

    resultEl.classList.add("lookup__result--visible");

    // Smooth scroll down to result card
    setTimeout(() => {
      const panel = document.getElementById("insurance-cert-panel");
      if (panel) {
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);

    // Bind Action: Search Another Code
    const searchAnotherBtn = document.getElementById("lookup-search-another");
    if (searchAnotherBtn) {
      searchAnotherBtn.addEventListener("click", () => {
        input.focus();
        input.select();
        const lookupSection = document.getElementById("lookup");
        if (lookupSection) {
          lookupSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    // Bind Action: Print Certificate Details
    const printBtn = document.getElementById("lookup-print-cert");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        window.print();
      });
    }
  }

  // Render company demo record (for backwards compatibility with demo codes)
  function renderCompanyRecord(company) {
    const statusClass =
      company.status === "Active"
        ? "lookup__result-badge--status"
        : "lookup__result-badge--review";

    resultEl.innerHTML = `
      <div class="lookup__result-header">
        <h4 class="lookup__result-title">${escapeHTML(company.name)}</h4>
        <span class="lookup__result-badge lookup__result-badge--demo">Sample Company Record</span>
      </div>
      <div class="lookup__result-grid">
        <div class="lookup__result-field">
          <span class="lookup__result-label">Reference Code</span>
          <span class="lookup__result-value">${escapeHTML(company.referenceCode || company.code)}</span>
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
        <span class="lookup__result-demo-label">Demo data — not a live insurance record</span>
        <div style="display: flex; gap: var(--space-2);">
          <button type="button" id="lookup-search-another-company" class="btn btn--secondary btn--sm">Search Another</button>
          <a href="#contact" class="btn btn--primary btn--sm">Contact Us</a>
        </div>
      </div>
    `;
    resultEl.classList.add("lookup__result--visible");

    const searchAnotherBtn = document.getElementById("lookup-search-another-company");
    if (searchAnotherBtn) {
      searchAnotherBtn.addEventListener("click", () => {
        input.focus();
        input.select();
        const lookupSection = document.getElementById("lookup");
        if (lookupSection) {
          lookupSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  }

  // Render record not-found state
  function renderNotFound(code) {
    if (!notFoundEl) return;
    const notFoundTitle = notFoundEl.querySelector(".lookup__not-found-title");
    const notFoundText = notFoundEl.querySelector(".lookup__not-found-text");

    if (notFoundTitle) {
      notFoundTitle.textContent = "Record Not Found";
    }
    if (notFoundText) {
      notFoundText.textContent =
        "No matching company or insurance record was found. Please check the code and try again.";
    }
    notFoundEl.classList.add("lookup__not-found--visible");
  }

  // Main submission handler
  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    resetStates();

    const rawInput = input.value || "";
    const trimmed = rawInput.trim();

    // 1. Validate: not empty
    if (!trimmed) {
      showError("Please enter a company or reference code.");
      return;
    }

    // 2. Normalize: uppercase
    const normalized = trimmed.toUpperCase();
    input.value = normalized; // Keep entered code visible in uppercase

    // 3. Format validation (alphanumeric, hyphens, underscores 2-32 chars)
    if (!/^[A-Za-z0-9\-_]{2,32}$/.test(normalized)) {
      showError("Please enter a valid company or reference code.");
      return;
    }

    // 4. Loading state
    if (loadingEl) loadingEl.classList.add("lookup__loading--visible");
    if (submitBtn) {
      submitBtn.classList.add("btn--loading");
      submitBtn.setAttribute("aria-busy", "true");
    }

    try {
      // Retrieve from data source
      const result = await lookupCompany(normalized);

      resetStates();

      if (result) {
        if (result.recordType === "insurance_certificate") {
          renderInsuranceCertificate(result);
        } else {
          renderCompanyRecord(result);
        }
      } else {
        renderNotFound(normalized);
      }
    } catch (err) {
      resetStates();
      console.error("Lookup error:", err);
      showError("We couldn't retrieve the information right now. Please try again.");
    } finally {
      if (submitBtn) {
        submitBtn.classList.remove("btn--loading");
        submitBtn.removeAttribute("aria-busy");
      }
    }
  }

  // Retry button in not-found card
  const retryBtn = document.getElementById("lookup-retry");
  if (retryBtn) {
    retryBtn.addEventListener("click", function () {
      resetStates();
      input.focus();
      input.select();
    });
  }

  // Help Modal setup
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

  // Event Listeners for form submission
  form.addEventListener("submit", handleSubmit);

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  });

  // Clear error styling when user types
  input.addEventListener("input", function () {
    if (input.classList.contains("lookup__input--error")) {
      input.classList.remove("lookup__input--error");
      if (errorEl) errorEl.classList.remove("lookup__error--visible");
    }
  });
})();
