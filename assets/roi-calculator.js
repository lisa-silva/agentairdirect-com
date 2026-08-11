(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.AgentAirROICalculator = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var AI_REFERRED_CUSTOMER_UPLIFT = 0.20;
  var CONVERSION_UPLIFT = 0.12;
  function sanitizeNumber(value, options) {
    var settings = options || {};
    var parsed = typeof value === "number" ? value : Number.parseFloat(String(value).replace(/[^0-9.-]/g, ""));
    if (!Number.isFinite(parsed) || parsed < 0) parsed = 0;
    if (Number.isFinite(settings.max)) parsed = Math.min(parsed, settings.max);
    return settings.whole ? Math.floor(parsed) : parsed;
  }
  function calculateROI(values) {
    var customers = sanitizeNumber(values && values.customers, { whole: true });
    var ticket = sanitizeNumber(values && values.ticket);
    var baselineMonthlyRevenue = customers * ticket;
    var monthlyRevenueLift = baselineMonthlyRevenue * AI_REFERRED_CUSTOMER_UPLIFT * CONVERSION_UPLIFT;
    var annualRevenueLift = monthlyRevenueLift * 12;
    return { customers: customers, ticket: ticket, visibilityLift: 20, conversionLift: 12,
      baselineMonthlyRevenue: baselineMonthlyRevenue, monthlyRevenueLift: monthlyRevenueLift,
      annualRevenueLift: annualRevenueLift };
  }
  return { sanitizeNumber: sanitizeNumber, calculateROI: calculateROI,
    AI_REFERRED_CUSTOMER_UPLIFT: AI_REFERRED_CUSTOMER_UPLIFT,
    CONVERSION_UPLIFT: CONVERSION_UPLIFT };
});
