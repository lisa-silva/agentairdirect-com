(function () {
  "use strict";
  var root = document.getElementById("roi-calculator");
  var api = window.AgentAirROICalculator;
  if (!root || !api) return;
  var fields = { customers: root.querySelector("#roi-customers"), ticket: root.querySelector("#roi-ticket"), visibilityLift: root.querySelector("#roi-visibility"), conversionLift: root.querySelector("#roi-conversion"), investment: root.querySelector("#roi-investment") };
  var currency = new Intl.NumberFormat(navigator.language || "en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 });
  var number = new Intl.NumberFormat(navigator.language || "en-US", { maximumFractionDigits: 1 });
  var customerNumber = new Intl.NumberFormat(navigator.language || "en-US", { maximumFractionDigits: 0 });
  function render() {
    var result = api.calculateROI({ customers: fields.customers.value, ticket: fields.ticket.value, visibilityLift: fields.visibilityLift.value, conversionLift: fields.conversionLift.value, investment: fields.investment.value });
    root.querySelector("#roi-visibility-value").value = result.visibilityLift;
    root.querySelector("#roi-conversion-value").value = result.conversionLift;
    root.querySelector("#roi-monthly").textContent = currency.format(result.monthlyRevenueLift);
    root.querySelector("#roi-annual").textContent = currency.format(result.annualRevenueLift);
    root.querySelector("#roi-return-label").textContent = "ROI on " + currency.format(result.investment) + " Investment";
    root.querySelector("#roi-return").textContent = result.roiPercentage === null ? "Not available." : number.format(result.roiPercentage) + "%";
    root.querySelector("#roi-break-even").textContent = result.breakEvenMonths === null ? "Not projected." : number.format(result.breakEvenMonths) + " " + (result.breakEvenMonths === 1 ? "month" : "months");
    root.querySelector("#roi-assumptions").textContent = customerNumber.format(result.customers) + " monthly customers × " + currency.format(result.ticket) + " average ticket. Estimated AI visibility revenue lift: +" + number.format(result.visibilityLift) + "%. Estimated AI-referred conversion revenue lift: +" + number.format(result.conversionLift) + "%. Estimated investment: " + currency.format(result.investment) + ".";
  }
  function normalize(field, options) { field.value = api.sanitizeNumber(field.value, options); render(); }
  Object.keys(fields).forEach(function (key) {
    fields[key].addEventListener("input", render);
    fields[key].addEventListener("change", function () { normalize(fields[key], key === "customers" ? { whole: true } : (key.indexOf("Lift") > -1 ? { max: 100 } : {})); });
  });
  root.querySelector("#roi-visibility-value").addEventListener("input", function (event) { fields.visibilityLift.value = api.sanitizeNumber(event.target.value, { max: 100 }); render(); });
  root.querySelector("#roi-conversion-value").addEventListener("input", function (event) { fields.conversionLift.value = api.sanitizeNumber(event.target.value, { max: 100 }); render(); });
  render();
})();
