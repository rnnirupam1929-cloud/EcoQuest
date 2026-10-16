const assert = require('assert');
const rewardService = require('./rewardService');

console.log('--- Starting EcoQuest Backend & Reward System Verification ---');

// 1. Retrieve rewards catalogue
const rewards = rewardService.getRewards();
console.log(`✓ Retrieved ${rewards.length} rewards from catalogue`);
assert.strictEqual(rewards.length, 8, 'Expected 8 configured rewards');

const expectedMilestones = [
  { id: 1, name: 'Flower Pot', points: 80 },
  { id: 2, name: 'Watering Can', points: 120 },
  { id: 3, name: 'Eco Bag', points: 190 },
  { id: 4, name: 'Seed Kit', points: 210 },
  { id: 5, name: 'Indoor Plant', points: 250 },
  { id: 6, name: 'Compost Bin', points: 320 },
  { id: 7, name: 'Bird House', points: 870 },
  { id: 8, name: 'Eco Cookware', points: 1350 },
];

expectedMilestones.forEach(exp => {
  const found = rewards.find(r => r.id === exp.id);
  assert(found, `Reward ${exp.name} not found`);
  assert.strictEqual(found.name, exp.name, `Name mismatch for ${exp.name}`);
  assert.strictEqual(found.points, exp.points, `Points mismatch for ${exp.name}`);
  console.log(`  ✓ Milestone Verified: ${found.name} -> ${found.points} pts (asset: ${found.image})`);
});

// 2. Test below threshold (e.g. 15 points trying to claim an 80 pt Flower Pot)
const testUser1 = 'test_warrior_alice_' + Date.now();
const belowThresholdResult = rewardService.claimReward(testUser1, 1, 15);
assert.strictEqual(belowThresholdResult.ok, false, 'Claim should fail when points < 80');
assert(belowThresholdResult.error.includes('Points threshold not met'), 'Error message should indicate threshold not met');
console.log('✓ Ineligible claim correctly rejected when points below threshold (15 < 80)');

// 3. Test exact threshold (80 points claiming 80 pt Flower Pot)
const exactResult = rewardService.claimReward(testUser1, 1, 80);
assert.strictEqual(exactResult.ok, true, 'Claim should succeed when points meet threshold');
assert.strictEqual(exactResult.status, 201, 'Status should be 201 Created');
assert(exactResult.claim, 'Claim object should be returned');
assert(/^ECO-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(exactResult.claim.redemptionCode), `Code format invalid: ${exactResult.claim.redemptionCode}`);
console.log(`✓ Eligible claim succeeded! Generated secure code: ${exactResult.claim.redemptionCode}`);

// 4. Test duplicate claim prevention (Alice trying to claim Flower Pot again)
const duplicateResult = rewardService.claimReward(testUser1, 1, 80);
assert.strictEqual(duplicateResult.ok, true, 'Duplicate claim should return 200 with existing claim');
assert.strictEqual(duplicateResult.alreadyClaimed, true, 'alreadyClaimed flag should be true');
assert.strictEqual(duplicateResult.claim.redemptionCode, exactResult.claim.redemptionCode, 'Existing code should be preserved');
console.log(`✓ Duplicate claim prevented! Returned existing code: ${duplicateResult.claim.redemptionCode}`);

// 4a. Redeem a claim once and deduct its points exactly once
const redemptionResult = rewardService.redeemReward(testUser1, exactResult.claim.claimId);
assert.strictEqual(redemptionResult.ok, true, 'Reward redemption should succeed');
assert.strictEqual(redemptionResult.remainingPoints, 0, 'Redeeming should deduct the reward cost');
assert.strictEqual(redemptionResult.claim.status, 'redeemed', 'Redeemed claim should persist its status');
const duplicateRedemption = rewardService.redeemReward(testUser1, exactResult.claim.claimId);
assert.strictEqual(duplicateRedemption.ok, true, 'Repeated redemption should be idempotent');
assert.strictEqual(duplicateRedemption.remainingPoints, 0, 'Repeated redemption must not deduct points twice');
assert.strictEqual(rewardService.getUser(testUser1).points, 0, 'User point balance should remain zero');
console.log('✓ Reward redemption deducts points once and persists the sold status');

// 5. Test user isolation (Bob should not see Alice's claims)
const testUser2 = 'test_warrior_bob_' + Date.now();
const bobClaims = rewardService.getUserClaims(testUser2);
assert.strictEqual(bobClaims.length, 0, 'Bob should have 0 claims initially');

const aliceClaims = rewardService.getUserClaims(testUser1);
assert.strictEqual(aliceClaims.length, 1, 'Alice should have 1 claim');
assert.strictEqual(aliceClaims[0].redemptionCode, exactResult.claim.redemptionCode);
console.log('✓ User claim isolation verified: Bob cannot access Alice’s claims');
const unauthorizedRedemption = rewardService.redeemReward(testUser2, exactResult.claim.claimId);
assert.strictEqual(unauthorizedRedemption.ok, false, 'A user must not redeem another user’s reward');
assert.strictEqual(unauthorizedRedemption.status, 404, 'Cross-user redemption should not disclose the claim');

// 6. Test exceeding threshold (Bob has 150 points, claims Watering Can at 120 pts)
const bobCanClaim = rewardService.claimReward(testUser2, 2, 150);
assert.strictEqual(bobCanClaim.ok, true, 'Claim should succeed when points exceed the threshold');
assert.notStrictEqual(bobCanClaim.claim.redemptionCode, exactResult.claim.redemptionCode, 'Codes must be unique');
console.log(`✓ Exceeding threshold verified! Bob claimed Watering Can with code: ${bobCanClaim.claim.redemptionCode}`);

// 7. Verify Amazon India URL
assert.strictEqual(
  bobCanClaim.claim.retailerUrl,
  `https://www.amazon.in/s?k=${encodeURIComponent('Watering Can')}`,
  'Retailer URL should search Amazon India for the claimed reward',
);
assert(bobCanClaim.claim.disclaimer.includes('not an Amazon-issued voucher'), 'Disclaimer should clarify not an Amazon voucher');
console.log('✓ Amazon India integration and non-voucher disclaimer verified');

// 8. Redeeming an 80-point reward from 250 points subtracts only the reward cost
const testUser3 = 'test_warrior_charlie_' + Date.now();
rewardService.syncUserProgress(testUser3, { points: 250 });
const flowerPotClaim = rewardService.claimReward(testUser3, 1, 250);
assert.strictEqual(flowerPotClaim.ok, true, 'User with 250 points should claim an 80-point reward');
const accurateRedemption = rewardService.redeemReward(testUser3, flowerPotClaim.claim.claimId);
assert.strictEqual(accurateRedemption.ok, true, 'Redemption should succeed for a user with enough points');
assert.strictEqual(accurateRedemption.remainingPoints, 170, 'An 80-point reward should deduct only 80 from 250 points');
const repeatedAccurateRedemption = rewardService.redeemReward(testUser3, flowerPotClaim.claim.claimId);
assert.strictEqual(repeatedAccurateRedemption.remainingPoints, 170, 'Repeated redemption must preserve the 170-point balance');
assert.strictEqual(rewardService.getUser(testUser3).points, 170, 'The stored balance should remain 170 after redemption');
console.log('✓ Redemption subtracts exactly 80 points from 250 and cannot deduct again');

console.log('\n--- ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ---');
