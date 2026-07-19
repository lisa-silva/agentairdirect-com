(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.AgentAirROICalculator = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
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
    var visibilityLift = sanitizeNumber(values && values.visibilityLift, { max: 100 });
    var conversionLift = sanitizeNumber(values && values.conversionLift, { max: 100 });
    var investment = sanitizeNumber(values && values.investment);
    var baselineMonthlyRevenue = customers * ticket;
    var combinedLiftPercentage = visibilityLift + conversionLift;
    var monthlyRevenueLift = baselineMonthlyRevenue * (combinedLiftPercentage / 100);
    var annualRevenueLift = monthlyRevenueLift * 12;
    return { customers: customers, ticket: ticket, visibilityLift: visibilityLift, conversionLift: conversionLift, investment: investment,
      baselineMonthlyRevenue: baselineMonthlyRevenue, combinedLiftPercentage: combinedLiftPercentage, monthlyRevenueLift: monthlyRevenueLift,
      annualRevenueLift: annualRevenueLift, roiPercentage: investment === 0 ? null : ((annualRevenueLift - investment) / investment) * 100,
      breakEvenMonths: monthlyRevenueLift === 0 ? null : investment / monthlyRevenueLift };
  }
  return { sanitizeNumber: sanitizeNumber, calculateROI: calculateROI };
});
