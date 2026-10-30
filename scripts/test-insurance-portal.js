const assert = require('assert');
const fs = require('fs');
const path = require('path');

const { ClaimsStore } = require('../js/data.js');

async function runTests() {
  console.log('🧪 Starting Core Resolution Group Insurance Transformation Tests...\n');

  // --- UNIT TESTS: ClaimsStore ---
  console.log('--- TEST SUITE 1: ClaimsStore Unit Tests ---');

  // Test 1: Seed demo claim exists
  console.log('Test 1: Seed demo claim CA300681 exists on initialization');
  const seed = ClaimsStore.getByCode('CA300681');
  assert(seed !== null, 'Seed claim CA300681 should exist');
  assert.strictEqual(seed.claimReferenceCode, 'CA300681');
  assert.strictEqual(seed.status, 'Received');
  assert.strictEqual(seed.statusHistory[0].message, 'Claim request received and awaiting review.');
  console.log('  ✅ Seed demo claim verified');

  // Test 2: Whitespace and case-insensitivity
  console.log('\nTest 2: Lookup is case-insensitive and trims whitespace');
  const lowerSeed = ClaimsStore.getByCode('   ca300681   ');
  assert(lowerSeed !== null, 'Lookup should find ca300681');
  assert.strictEqual(lowerSeed.claimReferenceCode, 'CA300681');
  console.log('  ✅ Code normalization verified');

  // Test 3: Save new claim generates sequential code
  console.log('\nTest 3: Saving a claim generates unique sequential reference code (e.g., CA300682)');
  const newClaim = ClaimsStore.save({
    policyNumber: 'POL-99281-X',
    companyName: 'Apex Transport LLC',
    contactNumber: '(555) 234-5678',
    email: 'claims@apextransport.com',
    documents: [{ name: 'loss-report.pdf', size: '1.2 MB', type: 'application/pdf' }]
  });
  assert(newClaim !== null, 'Saved claim must not be null');
  assert(/^CA\d{6}$/.test(newClaim.claimReferenceCode), 'Reference code must match CA + 6 digits');
  assert.strictEqual(newClaim.status, 'Received');
  assert.strictEqual(newClaim.policyNumber, 'POL-99281-X');
  assert.strictEqual(newClaim.companyName, 'Apex Transport LLC');
  assert.strictEqual(newClaim.uploadedDocuments.length, 1);
  console.log('  ✅ Generated reference code: ' + newClaim.claimReferenceCode);

  // Test 4: Stored claim retrieval
  console.log('\nTest 4: Retrieve newly saved claim by code');
  const retrieved = ClaimsStore.getByCode(newClaim.claimReferenceCode);
  assert(retrieved !== null, 'Must retrieve newly saved claim');
  assert.strictEqual(retrieved.companyName, 'Apex Transport LLC');
  console.log('  ✅ Retrieval verified');

  // Test 5: Unknown code returns null
  console.log('\nTest 5: Unknown code returns null safely');
  const notFound = ClaimsStore.getByCode('CA999999');
  assert.strictEqual(notFound, null, 'Unknown code must return null');
  console.log('  ✅ Unknown code safely handled');

  // --- INTEGRATION TESTS: index.html DOM & Structure ---
  console.log('\n--- TEST SUITE 2: index.html Insurance Portal Structure ---');
  const htmlPath = path.join(__dirname, '..', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Test 6: Verify Hero section copy
  console.log('Test 6: Verifying Hero heading, copy, and CTAs');
  assert(html.includes('Your Insurance Support') && html.includes('Made Simple.'), 'Hero heading missing');
  assert(html.includes('Access policy assistance, submit claims, and track your claim'), 'Hero description missing');
  assert(html.includes('data-portal-tab="submit"'), 'Hero CTA data-portal-tab="submit" missing');
  assert(html.includes('data-portal-tab="track"'), 'Hero CTA data-portal-tab="track" missing');
  console.log('  ✅ Hero messaging matches specification');

  // Test 7: Verify #insurance-portal directly after #hero
  console.log('\nTest 7: Verifying #insurance-portal section placement');
  const heroIndex = html.indexOf('id="hero"');
  const portalIndex = html.indexOf('id="insurance-portal"');
  const aboutIndex = html.indexOf('id="about"');
  assert(heroIndex !== -1, '#hero must exist');
  assert(portalIndex !== -1, '#insurance-portal must exist');
  assert(portalIndex > heroIndex, '#insurance-portal must be placed after #hero');
  assert(aboutIndex > portalIndex, '#about must be placed after #insurance-portal');
  console.log('  ✅ #insurance-portal correctly positioned between Hero and About sections');

  // Test 8: Verify Portal Heading & Subtitle
  console.log('\nTest 8: Verifying Portal Heading & Subtitle');
  assert(html.includes('How Can We Help You Today?'), 'Portal heading missing');
  assert(html.includes('Submit your insurance claim or access your claim status quickly and securely.'), 'Portal description missing');
  console.log('  ✅ Portal header text matches specification verbatim');

  // Test 9: Verify Tab buttons and panels
  console.log('\nTest 9: Verifying tab buttons and panels');
  assert(html.includes('id="portal-tab-submit"'), 'Tab submit button missing');
  assert(html.includes('id="portal-tab-track"'), 'Tab track button missing');
  assert(html.includes('id="portal-panel-submit"'), 'Submit panel missing');
  assert(html.includes('id="portal-panel-track"'), 'Track panel missing');
  console.log('  ✅ All tab buttons and panel IDs verified');

  // Test 10: Verify Claim Form Required Elements
  console.log('\nTest 10: Verifying Claim Form Inputs & File Dropzone');
  const requiredFormIds = [
    'claim-form',
    'claim-policy-number',
    'claim-company-name',
    'claim-contact-number',
    'claim-email',
    'claim-file-zone',
    'claim-documents',
    'claim-file-list',
    'claim-consent',
    'claim-submit-btn'
  ];
  requiredFormIds.forEach(id => {
    assert(html.includes(`id="${id}"`), `Missing required claim form element: id="${id}"`);
  });
  console.log('  ✅ All 10 required claim form input/element IDs verified');

  // Test 11: Verify Track Form Required Elements
  console.log('\nTest 11: Verifying Track Form Elements');
  const requiredTrackIds = [
    'track-form',
    'track-code-input',
    'track-submit-btn',
    'track-result',
    'track-not-found',
    'track-retry-btn'
  ];
  requiredTrackIds.forEach(id => {
    assert(html.includes(`id="${id}"`), `Missing required track form element: id="${id}"`);
  });
  console.log('  ✅ All 6 required track form element IDs verified');

  // Test 12: Verify Success Modal Elements
  console.log('\nTest 12: Verifying Center-Screen Success Modal');
  const requiredModalIds = [
    'claim-success-modal',
    'success-modal-close'
  ];
  requiredModalIds.forEach(id => {
    assert(html.includes(`id="${id}"`), `Missing required success modal element: id="${id}"`);
  });
  assert(html.includes('Your Form Has Been Successfully Submitted!'), 'Modal heading should indicate successful form submission');
  console.log('  ✅ Success modal elements and clean message verified');

  // Test 13: Verify Script inclusions
  console.log('\nTest 13: Verifying Script Inclusions');
  assert(html.includes('src="js/data.js"'), 'Missing js/data.js script');
  assert(html.includes('src="js/insurance-portal.js"'), 'Missing js/insurance-portal.js script');
  assert(!html.includes('src="js/company-lookup.js"'), 'Old company-lookup.js should not be included');
  console.log('  ✅ Scripts cleanly wired');

  // Test 14: Verifying Insurance Compliance Wording
  console.log('\nTest 14: Verifying strict compliance wording (no false claims/guarantees)');
  assert(!html.toLowerCase().includes('claim approved'), 'Must not promise claim approval');
  assert(!html.toLowerCase().includes('coverage guaranteed'), 'Must not promise coverage guarantee');
  assert(html.includes('awaiting review'), 'Required compliance message missing');
  console.log('  ✅ Compliance wording validated');

  // Test 15: Verifying Track Status Streamlined Success Design (No Progress Timeline)
  console.log('\nTest 15: Verifying streamlined track claim status success result');
  const portalJsPath = path.join(__dirname, '..', 'js', 'insurance-portal.js');
  const portalJs = fs.readFileSync(portalJsPath, 'utf8');
  assert(portalJs.includes('Your Claim Has Been Submitted Successfully!'), 'Success banner title missing');
  assert(portalJs.includes('status-card__success-banner'), 'Success banner CSS class missing');
  assert(portalJs.includes('CA300681'), 'Claim code CA300681 reference missing');
  assert(!portalJs.includes('renderStatusTimeline(status)'), 'Progress timeline should be removed from claim result');
  assert(portalJs.includes('track-check-another-btn'), 'Check another code action missing');
  console.log('  ✅ Track claim status streamlined success state verified');

  // Test 16: Verifying Contact Information
  console.log('\nTest 16: Verifying Client Contact Information');
  assert(html.includes('516-217-0673'), 'Mobile number 516-217-0673 missing');
  assert(html.includes('info@coreresolution.net'), 'Email address info@coreresolution.net missing');
  console.log('  ✅ Official phone and email verified across site');

  console.log('\n🎉 ALL 16 TEST SUITES PASSED! Insurance website updates verified.\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
