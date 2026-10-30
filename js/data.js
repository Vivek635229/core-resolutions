/**
 * CORE RESOLUTION GROUP INC. — Claims Data Store
 * ====================================================================
 * Manages claim submissions and tracking using localStorage.
 *
 * DEMONSTRATION MODE:
 * This module uses browser localStorage as a temporary data store.
 * All claim data is stored locally in the user's browser and is NOT
 * sent to any server. In production, replace with a secured backend
 * API connected to a proper database.
 *
 * Reference code format: CA + 6 digits (e.g., CA300681)
 */

var ClaimsStore = (function () {
  "use strict";

  var STORAGE_KEY = "crg_claims";
  var COUNTER_KEY = "crg_claim_counter";
  var STARTING_COUNTER = 300681;
  var DEMO_LABEL = "Demonstration Mode — Data stored locally in your browser.";

  // Resilient storage fallback for Node.js test environments or privacy modes
  var memStore = {};
  var storage = (function () {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage;
      }
      if (typeof localStorage !== "undefined") {
        return localStorage;
      }
    } catch (e) {}
    return {
      getItem: function (key) { return Object.prototype.hasOwnProperty.call(memStore, key) ? memStore[key] : null; },
      setItem: function (key, val) { memStore[key] = String(val); },
      removeItem: function (key) { delete memStore[key]; },
      clear: function () { memStore = {}; }
    };
  })();

  /**
   * Get all stored claims.
   * @returns {Array<object>}
   */
  function getAll() {
    try {
      var data = storage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn("ClaimsStore: Could not read claims from storage.", e);
      return [];
    }
  }

  /**
   * Save the full claims array to storage.
   * @param {Array<object>} claims
   */
  function _saveAll(claims) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(claims));
    } catch (e) {
      console.error("ClaimsStore: Could not save claims to storage.", e);
    }
  }

  /**
   * Get the next auto-incrementing reference code.
   * @returns {string} e.g., "CA300682"
   */
  function getNextCode() {
    var counter;
    try {
      var stored = storage.getItem(COUNTER_KEY);
      counter = stored ? parseInt(stored, 10) : STARTING_COUNTER;
      if (isNaN(counter) || counter < STARTING_COUNTER) {
        counter = STARTING_COUNTER;
      }
    } catch (e) {
      counter = STARTING_COUNTER;
    }

    counter++;

    try {
      storage.setItem(COUNTER_KEY, String(counter));
    } catch (e) {
      console.error("ClaimsStore: Could not save counter.", e);
    }

    return "CA" + String(counter).padStart(6, "0");
  }

  /**
   * Find a claim by its reference code.
   * @param {string} code - The claim reference code (e.g., "CA300682").
   * @returns {object|null}
   */
  function getByCode(code) {
    if (!code) return null;
    var normalized = String(code).trim().toUpperCase();
    var claims = getAll();
    for (var i = 0; i < claims.length; i++) {
      if (claims[i].claimReferenceCode === normalized) {
        return JSON.parse(JSON.stringify(claims[i]));
      }
    }
    return null;
  }

  /**
   * Save a new claim. Generates a unique reference code.
   * @param {object} claimData - { policyNumber, companyName, contactNumber, email, documents: [{name, size, type}] }
   * @returns {object} The saved claim record with generated reference code.
   */
  function save(claimData) {
    var refCode = getNextCode();
    var now = new Date().toISOString();
    var record = {
      id: "claim_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
      claimReferenceCode: refCode,
      policyNumber: claimData.policyNumber || "",
      companyName: claimData.companyName || "",
      contactNumber: claimData.contactNumber || "",
      email: claimData.email || "",
      uploadedDocuments: claimData.documents || [],
      status: "Received",
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          status: "Received",
          date: now,
          message: "Claim request received and awaiting review."
        }
      ]
    };

    var claims = getAll();
    claims.push(record);
    _saveAll(claims);

    return JSON.parse(JSON.stringify(record));
  }

  /**
   * Seed a demo claim if localStorage is empty (so users can test tracking immediately).
   */
  function seedDemo() {
    var claims = getAll();
    var hasSeed = false;
    for (var i = 0; i < claims.length; i++) {
      if (claims[i].claimReferenceCode === "CA300681") {
        hasSeed = true;
        break;
      }
    }
    if (!hasSeed) {
      var now = new Date().toISOString();
      var seedClaim = {
        id: "claim_seed_demo",
        claimReferenceCode: "CA300681",
        policyNumber: "DEMO-POL-001",
        companyName: "Demo Insurance Co.",
        contactNumber: "(555) 000-0000",
        email: "demo@example.com",
        uploadedDocuments: [
          { name: "sample-document.pdf", size: "245 KB", type: "application/pdf" }
        ],
        status: "Received",
        createdAt: now,
        updatedAt: now,
        statusHistory: [
          {
            status: "Received",
            date: now,
            message: "Claim request received and awaiting review."
          }
        ]
      };
      claims.push(seedClaim);
      _saveAll(claims);
    }
  }

  // Seed on load
  seedDemo();

  return {
    getAll: getAll,
    getByCode: getByCode,
    save: save,
    getNextCode: getNextCode,
    DEMO_LABEL: DEMO_LABEL
  };
})();

// Attach to window for browser global access
if (typeof window !== "undefined") {
  window.ClaimsStore = ClaimsStore;
}

// Support Node.js environment for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ClaimsStore: ClaimsStore };
}
