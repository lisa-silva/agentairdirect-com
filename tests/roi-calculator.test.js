const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateROI, sanitizeNumber } = require('../assets/roi-calculator.js');
test('default scenario uses the required fixed multiplicative model', () => { const r=calculateROI({customers:90,ticket:350}); assert.equal(r.baselineMonthlyRevenue,31500); assert.equal(r.monthlyRevenueLift,756); assert.equal(r.annualRevenueLift,9072); assert.equal(r.visibilityLift,20); assert.equal(r.conversionLift,12); });
test('high-volume scenario uses both fixed assumptions', () => { const r=calculateROI({customers:2400,ticket:20}); assert.equal(r.baselineMonthlyRevenue,48000); assert.equal(r.monthlyRevenueLift,1152); assert.equal(r.annualRevenueLift,13824); });
test('blank and invalid inputs are safe', () => { const r=calculateROI({customers:'',ticket:'no'}); assert.equal(r.customers,0); assert.equal(r.ticket,0); assert.ok(Object.values(r).every(Number.isFinite)); });
test('customer counts are whole while currency retains cents', () => { const r=calculateROI({customers:10.9,ticket:19.95}); assert.equal(r.customers,10); assert.equal(r.ticket,19.95); assert.equal(sanitizeNumber('$1,234.56'),1234.56); });
