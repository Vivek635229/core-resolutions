const assert = require('assert');
const { lookupCompany, INSURANCE_RECORDS, DEMO_COMPANIES } = require('../js/data.js');

async function runTests() {
  console.log('🧪 Starting Insurance Certificate Lookup Tests...\n');

  // Test 1: CA300681 exact lookup
  console.log('Test 1: Lookup CA300681 returns valid certificate record');
  const record = await lookupCompany('CA300681');
  assert(record !== null, 'Record should not be null');
  assert.strictEqual(record.referenceCode, 'CA300681');
  assert.strictEqual(record.recordType, 'insurance_certificate');
  assert.strictEqual(record.certificateStatus, 'Certificate information retrieved');
  assert.strictEqual(record.companyName, 'Pending Client Confirmation');
  console.log('  ✅ Record metadata verified');

  // Test 2: Insurers and NAIC numbers
  console.log('\nTest 2: Verifying Insurers and NAIC numbers');
  assert.strictEqual(record.insurers.length, 3);
  assert.strictEqual(record.insurers[0].name, 'MSIG Specialty Insurance USA Inc.');
  assert.strictEqual(record.insurers[0].naic, '34886');
  assert.strictEqual(record.insurers[1].name, "Lloyd's of London");
  assert.strictEqual(record.insurers[1].naic, '258394');
  assert.strictEqual(record.insurers[2].name, 'Highlander Specialty Insurance Company');
  assert.strictEqual(record.insurers[2].naic, '16777');
  console.log('  ✅ All 3 insurers and NAIC numbers verified');

  // Test 3: Commercial General Liability limits
  console.log('\nTest 3: Verifying General Liability limits');
  assert.strictEqual(record.generalLiability.policyPeriod, 'March 21, 2026 – March 21, 2027');
  const limits = record.generalLiability.limits;
  const expectedLimits = {
    'Each occurrence': '$1,000,000',
    'Damage to rented premises (each occurrence)': '$1,000,000',
    'Medical expenses (any one person)': '$5,000',
    'Personal and advertising injury': '$1,000,000',
    'General aggregate': '$2,000,000',
    'Products/completed operations aggregate': '$2,000,000'
  };
  limits.forEach(item => {
    assert.strictEqual(item.limit, expectedLimits[item.coverage], `Limit mismatch for ${item.coverage}`);
  });
  console.log('  ✅ All 6 General Liability coverage limits match ACORD certificate excerpt');

  // Test 4: Additional coverages (Reefer Breakdown & Comprehensive/Collision)
  console.log('\nTest 4: Verifying Additional Coverage details');
  assert.strictEqual(record.additionalCoverages.length, 2);
  const reefer = record.additionalCoverages.find(c => c.title === 'Reefer Breakdown');
  assert(reefer, 'Reefer Breakdown coverage must be present');
  assert.strictEqual(reefer.coverageLimit, '$100,000');
  assert.strictEqual(reefer.deductible, '$2,500');
  assert.strictEqual(reefer.policyPeriod, 'March 21, 2026 – March 21, 2027');

  const compColl = record.additionalCoverages.find(c => c.title === 'Comprehensive and Collision');
  assert(compColl, 'Comprehensive and Collision must be present');
  assert.strictEqual(compColl.coverageLimit, 'Not available');
  assert.strictEqual(compColl.deductible, '$2,500');
  assert.strictEqual(compColl.policyPeriod, 'May 1, 2026 – May 1, 2027');
  console.log('  ✅ Additional coverage details and unconfirmed fields marked properly');

  // Test 5: Exact certificate notice wording
  console.log('\nTest 5: Verifying Certificate Notice text');
  const expectedNotice = 'This information is provided for reference based on the certificate on file. A certificate of insurance does not amend, extend, or alter the coverage afforded by the policies described herein. Coverage, policy status, and applicable terms should be confirmed with the issuing insurer or authorized insurance representative.';
  assert.strictEqual(record.certificateNotice, expectedNotice);
  console.log('  ✅ Certificate notice text matches specification verbatim');

  // Test 6: Whitespace and case-normalization
  console.log('\nTest 6: Testing code normalization (lowercase and whitespace)');
  const lowerRecord = await lookupCompany('   ca300681   ');
  assert(lowerRecord !== null);
  assert.strictEqual(lowerRecord.referenceCode, 'CA300681');
  console.log('  ✅ Lowercase and whitespace correctly normalized');

  // Test 7: Unknown code
  console.log('\nTest 7: Testing unknown code handling');
  const unknown = await lookupCompany('NONEXISTENT_999');
  assert.strictEqual(unknown, null);
  console.log('  ✅ Unknown code safely returns null');

  // Test 8: Empty input validation
  console.log('\nTest 8: Testing empty input rejection');
  let rejected = false;
  try {
    await lookupCompany('   ');
  } catch (err) {
    rejected = true;
    assert.strictEqual(err.message, 'Please enter a company or reference code.');
  }
  assert(rejected, 'Empty input should be rejected');
  console.log('  ✅ Empty input rejected with correct error message');

  // Test 9: Existing demo company backward compatibility
  console.log('\nTest 9: Testing demo company backwards compatibility');
  const demoComp = await lookupCompany('CRG-DEMO-001');
  assert(demoComp !== null);
  assert.strictEqual(demoComp.name, 'Meridian Logistics Partners');
  console.log('  ✅ Existing demo company lookup works as expected');

  console.log('\n🎉 ALL 9 TEST SUITES PASSED SUCCESSFULLY!\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
