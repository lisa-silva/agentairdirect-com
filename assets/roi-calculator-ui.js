(function () {
  "use strict";
  var root = document.getElementById("roi-calculator");
  var api = window.AgentAirROICalculator;
  if (!root || !api) return;
  var fields = { customers: root.querySelector("#roi-customers"), ticket: root.querySelector("#roi-ticket") };
  var currency = new Intl.NumberFormat(navigator.language || "en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 });
  var customerNumber = new Intl.NumberFormat(navigator.language || "en-US", { maximumFractionDigits: 0 });
  function render() {
    var result = api.calculateROI({ customers: fields.customers.value, ticket: fields.ticket.value });
    root.querySelector("#roi-monthly").textContent = currency.format(result.monthlyRevenueLift);
    root.querySelector("#roi-annual").textContent = currency.format(result.annualRevenueLift);
    root.querySelector("#roi-assumptions").textContent = customerNumber.format(result.customers) + " monthly customers × " + currency.format(result.ticket) + " average customer value × 20% modeled AI-referred customer uplift × 12% modeled conversion uplift.";
  }
  function normalize(field, options) { field.value = api.sanitizeNumber(field.value, options); render(); }
  Object.keys(fields).forEach(function (key) {
    fields[key].addEventListener("input", render);
    fields[key].addEventListener("change", function () { normalize(fields[key], key === "customers" ? { whole: true } : {}); });
  });
  render();
})();
