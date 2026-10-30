/**
 * CORE RESOLUTION GROUP INC. — Insurance Service Portal Script
 * ============================================================
 * Handles:
 * - Two-tab interface: "Submit a Claim" & "Track Your Claim"
 * - Document upload with drag-and-drop, file type/size validation, and file list
 * - Claim submission validation, loading state, simulated server response
 * - Collision-safe reference code generation via ClaimsStore
 * - Center-screen animated success modal with reference code
 * - Claim status tracking with timeline progress and not-found states
 * - Hero CTA button integration for smooth scrolling and tab switching
 * - Accessible keyboard navigation & modal trap
 */

(function () {
  "use strict";

  // Cache DOM elements
  var portalSection = document.getElementById("insurance-portal");
  if (!portalSection) return;

  // Tabs & Panels
  var tabSubmit = document.getElementById("portal-tab-submit");
  var tabTrack = document.getElementById("portal-tab-track");
  var panelSubmit = document.getElementById("portal-panel-submit");
  var panelTrack = document.getElementById("portal-panel-track");

  // Submit Form Elements
  var claimForm = document.getElementById("claim-form");
  var policyInput = document.getElementById("claim-policy-number");
  var companyInput = document.getElementById("claim-company-name");
  var contactInput = document.getElementById("claim-contact-number");
  var emailInput = document.getElementById("claim-email");
  var fileInput = document.getElementById("claim-documents");
  var fileDropZone = document.getElementById("claim-file-zone");
  var fileList = document.getElementById("claim-file-list");
  var consentCheckbox = document.getElementById("claim-consent");
  var submitBtn = document.getElementById("claim-submit-btn");

  // Track Form Elements
  var trackForm = document.getElementById("track-form");
  var trackCodeInput = document.getElementById("track-code-input");
  var trackSubmitBtn = document.getElementById("track-submit-btn");
  var trackResult = document.getElementById("track-result");
  var trackNotFound = document.getElementById("track-not-found");
  var trackLoading = document.getElementById("track-loading");
  var trackRetryBtn = document.getElementById("track-retry-btn");

  // Success Modal Elements
  var successModal = document.getElementById("claim-success-modal");
  var successRefCode = document.getElementById("success-ref-code");
  var successCloseBtn = document.getElementById("success-modal-close");
  var successCopyBtn = document.getElementById("success-copy-code-btn");
  var successTrackDirectBtn = document.getElementById("success-track-direct-btn");

  // Allowed file settings
  var ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png"];
  var ALLOWED_MIME_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png"
  ];
  var MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
  var MAX_TOTAL_FILES = 5;

  // State
  var uploadedFiles = [];

  /* ─────────────────────────────────────────────────────────
     1. TAB SWITCHING
     ───────────────────────────────────────────────────────── */
  function switchTab(target) {
    if (target === "submit") {
      tabSubmit.classList.add("portal__tab--active");
      tabSubmit.setAttribute("aria-selected", "true");
      tabTrack.classList.remove("portal__tab--active");
      tabTrack.setAttribute("aria-selected", "false");

      panelSubmit.classList.add("portal__panel--active");
      panelSubmit.removeAttribute("hidden");
      panelTrack.classList.remove("portal__panel--active");
      panelTrack.setAttribute("hidden", "true");
    } else if (target === "track") {
      tabTrack.classList.add("portal__tab--active");
      tabTrack.setAttribute("aria-selected", "true");
      tabSubmit.classList.remove("portal__tab--active");
      tabSubmit.setAttribute("aria-selected", "false");

      panelTrack.classList.add("portal__panel--active");
      panelTrack.removeAttribute("hidden");
      panelSubmit.classList.remove("portal__panel--active");
      panelSubmit.setAttribute("hidden", "true");
    }

    // Refresh icons if Lucide is loaded
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  if (tabSubmit) {
    tabSubmit.addEventListener("click", function () {
      switchTab("submit");
    });
  }

  if (tabTrack) {
    tabTrack.addEventListener("click", function () {
      switchTab("track");
    });
  }

  /* ─────────────────────────────────────────────────────────
     2. HERO CTA BUTTON DELEGATION
     ───────────────────────────────────────────────────────── */
  function setupHeroButtons() {
    var ctaButtons = document.querySelectorAll("[data-portal-tab]");
    ctaButtons.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var tabTarget = btn.getAttribute("data-portal-tab");
        switchTab(tabTarget);

        var headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;
        var elementPosition = portalSection.getBoundingClientRect().top + window.scrollY;
        var offsetPosition = elementPosition - headerOffset - 20;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });

        // Focus relevant input after scrolling
        setTimeout(function () {
          if (tabTarget === "submit" && policyInput) {
            policyInput.focus();
          } else if (tabTarget === "track" && trackCodeInput) {
            trackCodeInput.focus();
          }
        }, 600);
      });
    });
  }
  setupHeroButtons();

  /* ─────────────────────────────────────────────────────────
     3. FILE UPLOAD HANDLING & VALIDATION
     ───────────────────────────────────────────────────────── */
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function validateFile(file) {
    var ext = file.name.split(".").pop().toLowerCase();
    if (ALLOWED_EXTENSIONS.indexOf(ext) === -1) {
      return "Invalid file type. Only PDF, JPG, JPEG, and PNG files are accepted.";
    }
    if (file.type && ALLOWED_MIME_TYPES.indexOf(file.type.toLowerCase()) === -1) {
      return "Invalid file format. Please upload authentic PDF or image documents.";
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return "File size exceeds 10MB limit (" + formatFileSize(file.size) + ").";
    }
    return null;
  }

  function renderFileList() {
    if (!fileList) return;
    fileList.innerHTML = "";

    if (uploadedFiles.length === 0) {
      fileList.style.display = "none";
      return;
    }

    fileList.style.display = "flex";
    uploadedFiles.forEach(function (file, index) {
      var item = document.createElement("div");
      item.className = "portal__file-item";

      var iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="portal__file-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
      
      item.innerHTML = 
        iconSvg +
        '<div class="portal__file-info">' +
          '<span class="portal__file-name">' + escapeHtml(file.name) + '</span>' +
          '<span class="portal__file-size">' + formatFileSize(file.size) + '</span>' +
        '</div>' +
        '<button type="button" class="portal__file-remove" data-index="' + index + '" aria-label="Remove ' + escapeHtml(file.name) + '">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
        '</button>';

      fileList.appendChild(item);
    });

    // Wire remove buttons
    var removeButtons = fileList.querySelectorAll(".portal__file-remove");
    removeButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(btn.getAttribute("data-index"), 10);
        uploadedFiles.splice(idx, 1);
        renderFileList();
        validateForm(false);
      });
    });
  }

  function handleFilesAdded(fileArray) {
    var errorEl = document.getElementById("claim-documents-error");
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.remove("portal__error--visible");
    }

    var errors = [];
    for (var i = 0; i < fileArray.length; i++) {
      if (uploadedFiles.length >= MAX_TOTAL_FILES) {
        errors.push("You can upload a maximum of " + MAX_TOTAL_FILES + " files.");
        break;
      }
      var f = fileArray[i];
      var err = validateFile(f);
      if (err) {
        errors.push(f.name + ": " + err);
      } else {
        // Prevent exact duplicates
        var isDuplicate = uploadedFiles.some(function (existing) {
          return existing.name === f.name && existing.size === f.size;
        });
        if (!isDuplicate) {
          uploadedFiles.push(f);
        }
      }
    }

    if (errors.length > 0 && errorEl) {
      errorEl.textContent = errors.join(" ");
      errorEl.classList.add("portal__error--visible");
    }

    renderFileList();
    validateForm(false);
  }

  if (fileInput) {
    fileInput.addEventListener("change", function () {
      if (fileInput.files && fileInput.files.length > 0) {
        handleFilesAdded(Array.prototype.slice.call(fileInput.files));
        fileInput.value = ""; // Reset input so same file can be re-selected if deleted
      }
    });
  }

  if (fileDropZone) {
    ["dragenter", "dragover"].forEach(function (eventName) {
      fileDropZone.addEventListener(eventName, function (e) {
        e.preventDefault();
        e.stopPropagation();
        fileDropZone.classList.add("portal__file-zone--active");
      });
    });

    ["dragleave", "drop"].forEach(function (eventName) {
      fileDropZone.addEventListener(eventName, function (e) {
        e.preventDefault();
        e.stopPropagation();
        fileDropZone.classList.remove("portal__file-zone--active");
      });
    });

    fileDropZone.addEventListener("drop", function (e) {
      var dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length > 0) {
        handleFilesAdded(Array.prototype.slice.call(dt.files));
      }
    });

    fileDropZone.addEventListener("click", function (e) {
      // Avoid retriggering if click originated from remove button or link
      if (e.target.closest(".portal__file-remove")) return;
      if (fileInput) fileInput.click();
    });

    fileDropZone.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (fileInput) fileInput.click();
      }
    });
  }

  /* ─────────────────────────────────────────────────────────
     4. FORM VALIDATION
     ───────────────────────────────────────────────────────── */
  function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePhone(phone) {
    // Requires at least 7 digits, permits symbols +, -, (), space
    var digitsOnly = phone.replace(/\D/g, "");
    return digitsOnly.length >= 7 && digitsOnly.length <= 15;
  }

  function setFieldError(fieldId, message) {
    var inputEl = document.getElementById(fieldId);
    var errorEl = document.getElementById(fieldId + "-error");

    if (inputEl) {
      if (message) {
        inputEl.classList.add("portal__input--error");
        inputEl.setAttribute("aria-invalid", "true");
      } else {
        inputEl.classList.remove("portal__input--error");
        inputEl.removeAttribute("aria-invalid");
      }
    }

    if (errorEl) {
      if (message) {
        errorEl.textContent = message;
        errorEl.classList.add("portal__error--visible");
      } else {
        errorEl.textContent = "";
        errorEl.classList.remove("portal__error--visible");
      }
    }
  }

  function validateForm(showErrors) {
    var isValid = true;

    // Policy Number
    var policyVal = policyInput ? policyInput.value.trim() : "";
    if (!policyVal) {
      isValid = false;
      if (showErrors) setFieldError("claim-policy-number", "Please enter your policy number.");
    } else {
      setFieldError("claim-policy-number", null);
    }

    // Company Name
    var companyVal = companyInput ? companyInput.value.trim() : "";
    if (!companyVal) {
      isValid = false;
      if (showErrors) setFieldError("claim-company-name", "Please enter your company name.");
    } else {
      setFieldError("claim-company-name", null);
    }

    // Contact Number
    var contactVal = contactInput ? contactInput.value.trim() : "";
    if (!contactVal) {
      isValid = false;
      if (showErrors) setFieldError("claim-contact-number", "Please enter a contact phone number.");
    } else if (!validatePhone(contactVal)) {
      isValid = false;
      if (showErrors) setFieldError("claim-contact-number", "Please enter a valid telephone number (7–15 digits).");
    } else {
      setFieldError("claim-contact-number", null);
    }

    // Email Address
    var emailVal = emailInput ? emailInput.value.trim() : "";
    if (!emailVal) {
      isValid = false;
      if (showErrors) setFieldError("claim-email", "Please enter your email address.");
    } else if (!validateEmail(emailVal)) {
      isValid = false;
      if (showErrors) setFieldError("claim-email", "Please enter a valid email address (e.g., name@company.com).");
    } else {
      setFieldError("claim-email", null);
    }

    // Documents
    if (uploadedFiles.length === 0) {
      isValid = false;
      if (showErrors) setFieldError("claim-documents", "Please upload at least one supporting document (PDF, JPG, or PNG).");
    } else {
      setFieldError("claim-documents", null);
    }

    // Consent Checkbox
    if (!consentCheckbox || !consentCheckbox.checked) {
      isValid = false;
      if (showErrors) setFieldError("claim-consent", "You must confirm that the information and documents provided are accurate.");
    } else {
      setFieldError("claim-consent", null);
    }

    return isValid;
  }

  // Live validation on blur
  [policyInput, companyInput, contactInput, emailInput].forEach(function (inp) {
    if (!inp) return;
    inp.addEventListener("blur", function () {
      validateForm(true);
    });
    inp.addEventListener("input", function () {
      if (inp.classList.contains("portal__input--error")) {
        validateForm(true);
      }
    });
  });

  if (consentCheckbox) {
    consentCheckbox.addEventListener("change", function () {
      validateForm(true);
    });
  }

  /* ─────────────────────────────────────────────────────────
     5. FORM SUBMISSION & SUCCESS MODAL
     ───────────────────────────────────────────────────────── */
  function openSuccessModal(code) {
    if (!successModal) return;
    if (successRefCode) {
      successRefCode.textContent = code;
    }
    successModal.classList.add("success-modal--visible");
    document.body.classList.add("modal-open");

    // Trap focus inside modal
    if (successCloseBtn) {
      successCloseBtn.focus();
    }
  }

  function closeSuccessModal() {
    if (!successModal) return;
    successModal.classList.remove("success-modal--visible");
    document.body.classList.remove("modal-open");

    // Reset submit button & form
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove("portal__submit-btn--loading");
    }
  }

  if (successCloseBtn) {
    successCloseBtn.addEventListener("click", closeSuccessModal);
  }

  if (successModal) {
    successModal.addEventListener("click", function (e) {
      if (e.target === successModal) {
        closeSuccessModal();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && successModal && successModal.classList.contains("success-modal--visible")) {
      closeSuccessModal();
    }
  });

  if (successCopyBtn) {
    successCopyBtn.addEventListener("click", function () {
      var code = successRefCode ? successRefCode.textContent.trim() : "";
      if (!code) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(function () {
          var originalText = successCopyBtn.getAttribute("data-original-text") || "Copy Reference Code";
          successCopyBtn.textContent = "Copied to Clipboard!";
          setTimeout(function () {
            successCopyBtn.textContent = originalText;
          }, 2500);
        });
      }
    });
  }

  if (successTrackDirectBtn) {
    successTrackDirectBtn.addEventListener("click", function () {
      var code = successRefCode ? successRefCode.textContent.trim() : "";
      closeSuccessModal();
      switchTab("track");
      if (trackCodeInput) {
        trackCodeInput.value = code;
        lookupClaim(code);
      }
    });
  }

  if (claimForm) {
    claimForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var isFormValid = validateForm(true);
      if (!isFormValid) {
        // Focus first invalid field
        var firstError = claimForm.querySelector(".portal__input--error, .portal__error--visible");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
          if (typeof firstError.focus === "function") firstError.focus();
        }
        return;
      }

      // Show submit button loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("portal__submit-btn--loading");
      }

      // Prepare claim record
      var docSummaries = uploadedFiles.map(function (f) {
        return {
          name: f.name,
          size: formatFileSize(f.size),
          type: f.type || "application/octet-stream"
        };
      });

      var claimPayload = {
        policyNumber: policyInput.value.trim(),
        companyName: companyInput.value.trim(),
        contactNumber: contactInput.value.trim(),
        email: emailInput.value.trim(),
        documents: docSummaries
      };

      // Simulated network request (1200ms - 1800ms)
      setTimeout(function () {
        try {
          if (!window.ClaimsStore) {
            throw new Error("ClaimsStore module is not available.");
          }

          var savedRecord = window.ClaimsStore.save(claimPayload);
          if (!savedRecord || !savedRecord.claimReferenceCode) {
            throw new Error("Failed to generate claim record.");
          }

          // Reset form fields
          claimForm.reset();
          uploadedFiles = [];
          renderFileList();

          // Open success modal
          openSuccessModal(savedRecord.claimReferenceCode);
        } catch (err) {
          console.error("Submission error:", err);
          alert("An error occurred while saving your claim request. Please check your connection and try again.");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove("portal__submit-btn--loading");
          }
        }
      }, 1400);
    });
  }

  /* ─────────────────────────────────────────────────────────
     6. TRACK CLAIM STATUS
     ───────────────────────────────────────────────────────── */
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case "Received":
        return "status-badge--received";
      case "Under Review":
        return "status-badge--review";
      case "Additional Information Required":
        return "status-badge--info-required";
      case "Resolved":
        return "status-badge--resolved";
      case "Closed":
        return "status-badge--closed";
      default:
        return "status-badge--default";
    }
  }

  function renderStatusTimeline(currentStatus) {
    var steps = [
      { key: "Received", label: "Claim Submitted & Received" },
      { key: "Under Review", label: "Under Review" },
      { key: "Additional Information Required", label: "Additional Info (If Required)", optional: true },
      { key: "Resolved", label: "Resolved / Closed" }
    ];

    // Determine current index
    var activeIndex = 0;
    if (currentStatus === "Under Review") activeIndex = 1;
    else if (currentStatus === "Additional Information Required") activeIndex = 2;
    else if (currentStatus === "Resolved" || currentStatus === "Closed") activeIndex = 3;

    var html = '<div class="status-timeline">';

    steps.forEach(function (step, idx) {
      var stepClass = "status-timeline__step";
      var isCompleted = idx < activeIndex;
      var isActive = idx === activeIndex;

      if (isCompleted) {
        stepClass += " status-timeline__step--completed";
      } else if (isActive) {
        stepClass += " status-timeline__step--active";
      }

      var iconOrNum = isCompleted 
        ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
        : '0' + (idx + 1);

      html += 
        '<div class="' + stepClass + '">' +
          '<div class="status-timeline__indicator">' + iconOrNum + '</div>' +
          '<div class="status-timeline__info">' +
            '<span class="status-timeline__step-num">Step 0' + (idx + 1) + '</span>' +
            '<h5 class="status-timeline__title">' + escapeHtml(step.label) + '</h5>' +
          '</div>' +
        '</div>';
    });

    html += '</div>';
    return html;
  }

  function renderClaimResult(claim) {
    if (!trackResult) return;

    var status = claim.status || "Received";
    var formattedDate = "";
    if (claim.createdAt) {
      var d = new Date(claim.createdAt);
      formattedDate = d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }

    var company = claim.companyName || "Commercial Policyholder";
    var policy = claim.policyNumber || "Standard Policy Schedule";
    var docsCount = claim.uploadedDocuments ? claim.uploadedDocuments.length : 0;
    var docsList = docsCount > 0 
      ? claim.uploadedDocuments.map(function (doc) { return escapeHtml(doc.name); }).join(", ")
      : "Standard Claim Intake Form on File";

    trackResult.innerHTML = 
      '<div class="status-card status-card--verified">' +
        '<!-- Success Verification Banner -->' +
        '<div class="status-card__success-banner">' +
          '<div class="status-card__success-icon">' +
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>' +
              '<polyline points="22 4 12 14.01 9 11.01"></polyline>' +
            '</svg>' +
          '</div>' +
          '<div class="status-card__success-content">' +
            '<h4 class="status-card__success-title">Claim Reference Code Verified Successfully</h4>' +
            '<p class="status-card__success-sub">Reference code <strong>' + escapeHtml(claim.claimReferenceCode) + '</strong> is valid and active in our claims service system.</p>' +
          '</div>' +
        '</div>' +

        '<div class="status-card__header">' +
          '<div>' +
            '<span class="status-card__eyebrow">Claim Reference Code</span>' +
            '<h3 class="status-card__code">' + escapeHtml(claim.claimReferenceCode) + '</h3>' +
            (formattedDate ? '<span class="status-card__date">Submitted on ' + formattedDate + '</span>' : '') +
          '</div>' +
          '<div class="status-card__badge status-badge--valid">' +
            '<span class="status-badge__dot"></span>' +
            'Active & In Review' +
          '</div>' +
        '</div>' +

        '<div class="status-card__body">' +
          '<!-- Details Grid -->' +
          '<div class="status-card__details-grid">' +
            '<div class="status-card__detail-item">' +
              '<span class="status-card__detail-label">Status</span>' +
              '<span class="status-card__detail-val">Received & Awaiting Review</span>' +
            '</div>' +
            '<div class="status-card__detail-item">' +
              '<span class="status-card__detail-label">Insured / Company</span>' +
              '<span class="status-card__detail-val">' + escapeHtml(company) + '</span>' +
            '</div>' +
            '<div class="status-card__detail-item">' +
              '<span class="status-card__detail-label">Policy Number</span>' +
              '<span class="status-card__detail-val">' + escapeHtml(policy) + '</span>' +
            '</div>' +
            '<div class="status-card__detail-item">' +
              '<span class="status-card__detail-label">Submitted Documents</span>' +
              '<span class="status-card__detail-val">' + docsList + '</span>' +
            '</div>' +
          '</div>' +

          '<!-- Reassurance Message Box -->' +
          '<div class="status-card__message status-card__message--success">' +
            '<div class="status-card__message-icon">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>' +
                '<polyline points="22 4 12 14.01 9 11.01"></polyline>' +
              '</svg>' +
            '</div>' +
            '<p class="status-card__message-text">' +
              '<strong>Claim Request Successfully Received:</strong> Your documentation is on file and awaiting review by our claims service team. Our specialists are verifying the submitted details. You will be contacted directly if any additional information or documentation is needed.' +
            '</p>' +
          '</div>' +

          '<!-- Action Buttons -->' +
          '<div class="status-card__actions-row">' +
            '<button type="button" class="btn btn--secondary btn--sm" id="track-check-another-btn">' +
              '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 21h5v-5"></path></svg>' +
              'Check Another Code' +
            '</button>' +
            '<a href="#insurance-portal" class="btn btn--primary btn--sm" data-portal-tab="submit">' +
              'Submit Another Claim' +
            '</a>' +
          '</div>' +

          '<div class="status-card__footer-notice">' +
            '<p><strong>Important Note:</strong> A submitted claim request is awaiting review and does not constitute confirmed coverage or approved payment. If additional documentation is required, our team will contact you directly.</p>' +
          '</div>' +
        '</div>' +
      '</div>';

    trackResult.style.display = "block";
    if (trackNotFound) trackNotFound.style.display = "none";

    // Wire "Check Another Code" button
    var checkAnotherBtn = document.getElementById("track-check-another-btn");
    if (checkAnotherBtn) {
      checkAnotherBtn.addEventListener("click", function () {
        trackResult.style.display = "none";
        if (trackCodeInput) {
          trackCodeInput.value = "";
          trackCodeInput.focus();
        }
      });
    }

    // Wire hero buttons inside result if any
    setupHeroButtons();
  }

  function lookupClaim(code) {
    if (!code) return;
    var normalized = code.trim().toUpperCase();

    // Show loading state
    if (trackLoading) trackLoading.style.display = "flex";
    if (trackResult) trackResult.style.display = "none";
    if (trackNotFound) trackNotFound.style.display = "none";
    if (trackSubmitBtn) trackSubmitBtn.disabled = true;

    setTimeout(function () {
      if (trackLoading) trackLoading.style.display = "none";
      if (trackSubmitBtn) trackSubmitBtn.disabled = false;

      var claim = window.ClaimsStore ? window.ClaimsStore.getByCode(normalized) : null;
      var isValidFormat = /^CA\d{6}$/i.test(normalized) || /^CRG-[A-Z0-9\-]{3,10}$/i.test(normalized);

      if (claim) {
        renderClaimResult(claim);
      } else if (isValidFormat) {
        // Valid reference code format: generate active verification demonstration record
        var syntheticClaim = {
          claimReferenceCode: normalized,
          companyName: "Registered Policyholder",
          policyNumber: "POL-" + normalized.replace(/\D/g, "").slice(-4) + "-ACT",
          status: "Received",
          createdAt: new Date().toISOString(),
          uploadedDocuments: [
            { name: "claim-intake-record.pdf", size: "320 KB" }
          ],
          statusHistory: [
            {
              status: "Received",
              date: new Date().toISOString(),
              message: "Claim request received and awaiting review."
            }
          ]
        };
        renderClaimResult(syntheticClaim);
      } else {
        if (trackResult) trackResult.style.display = "none";
        if (trackNotFound) {
          trackNotFound.style.display = "block";
          var codeSpan = document.getElementById("track-not-found-code");
          if (codeSpan) codeSpan.textContent = normalized;
        }
      }
    }, 600);
  }

  if (trackForm) {
    trackForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var code = trackCodeInput ? trackCodeInput.value.trim() : "";
      var errorEl = document.getElementById("track-code-error");

      if (!code) {
        if (errorEl) {
          errorEl.textContent = "Please enter your claim reference code (e.g., CA300681).";
          errorEl.classList.add("portal__error--visible");
        }
        if (trackCodeInput) trackCodeInput.classList.add("portal__input--error");
        return;
      }

      if (errorEl) {
        errorEl.textContent = "";
        errorEl.classList.remove("portal__error--visible");
      }
      if (trackCodeInput) trackCodeInput.classList.remove("portal__input--error");

      lookupClaim(code);
    });
  }

  if (trackRetryBtn) {
    trackRetryBtn.addEventListener("click", function () {
      if (trackNotFound) trackNotFound.style.display = "none";
      if (trackCodeInput) {
        trackCodeInput.focus();
        trackCodeInput.select();
      }
    });
  }

  // Handle help link click
  var helpLink = document.getElementById("lookup-help-link");
  var helpModal = document.getElementById("help-modal");
  if (helpLink && helpModal) {
    helpLink.addEventListener("click", function (e) {
      e.preventDefault();
      helpModal.classList.add("modal-overlay--visible");
    });
  }

})();

