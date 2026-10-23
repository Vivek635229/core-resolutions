/**
 * CORE RESOLUTION GROUP INC. — Demo Company Lookup Dataset
 * =========================================================
 * IMPORTANT: This file contains FICTIONAL demonstration records only.
 * These records are used solely for the client presentation and do NOT
 * represent real companies, customers, or confidential data.
 *
 * When a production API becomes available, replace the `lookupCompany`
 * function with a fetch call to the real endpoint (e.g., /api/company-lookup).
 */

const DEMO_COMPANIES = [
  {
    code: "CRG-DEMO-001",
    name: "Meridian Logistics Partners",
    referenceCode: "CRG-DEMO-001",
    status: "Active",
    industry: "Logistics & Supply Chain",
    contactEmail: "contact@example-meridian.com",
    dateRegistered: "2024-03-15",
    assignedRepresentative: "Resolution Team A",
    notes: "This is a sample record for demonstration purposes."
  },
  {
    code: "CRG-DEMO-002",
    name: "Pinnacle Advisory Services",
    referenceCode: "CRG-DEMO-002",
    status: "Active",
    industry: "Financial Advisory",
    contactEmail: "info@example-pinnacle.com",
    dateRegistered: "2024-06-22",
    assignedRepresentative: "Resolution Team B",
    notes: "This is a sample record for demonstration purposes."
  },
  {
    code: "CRG-DEMO-003",
    name: "Catalyst Infrastructure Group",
    referenceCode: "CRG-DEMO-003",
    status: "Under Review",
    industry: "Infrastructure & Development",
    contactEmail: "hello@example-catalyst.com",
    dateRegistered: "2025-01-10",
    assignedRepresentative: "Resolution Team C",
    notes: "This is a sample record for demonstration purposes."
  }
];

/**
 * Simulate an asynchronous company lookup.
 * In production, replace this with a real API call:
 *
 *   async function lookupCompany(code) {
 *     const response = await fetch('/api/company-lookup', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ code })
 *     });
 *     if (!response.ok) throw new Error('Network error');
 *     return response.json();
 *   }
 *
 * @param {string} code - The company code entered by the user.
 * @returns {Promise<object|null>} The matching demo record, or null.
 */
function lookupCompany(code) {
  return new Promise((resolve, reject) => {
    // Simulate network latency (800–1500 ms)
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      if (!code || typeof code !== "string") {
        reject(new Error("Invalid company code format."));
        return;
      }
      const normalized = code.trim().toUpperCase();
      const match = DEMO_COMPANIES.find(
        (c) => c.code.toUpperCase() === normalized
      );
      resolve(match || null);
    }, delay);
  });
}
