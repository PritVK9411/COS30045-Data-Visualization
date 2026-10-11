/* =========================================================
   calculator.js
   Interactive Appliance Energy Calculator (optional
   JavaScript extension).

   Demonstrates:
   - event handling (submit + live "change" updates)
   - reading values from the DOM
   - calculations using variables/functions
   - dynamically updating existing DOM elements
   - client-side input validation with inline feedback
   ========================================================= */

// A small made-up appliance dataset (television models),
// used to pre-fill the wattage field when a model is chosen.
var TV_MODELS = [
  { id: "custom", name: "Custom / enter watts manually", watts: null },
  { id: "led32", name: "32\" LED TV", watts: 50 },
  { id: "led43", name: "43\" LED TV", watts: 75 },
  { id: "qled55", name: "55\" QLED TV", watts: 110 },
  { id: "oled65", name: "65\" OLED TV", watts: 150 },
  { id: "plasma50", name: "50\" Plasma TV (older model)", watts: 220 }
];

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("calc-form");

  if (!form) {
    return; // Calculator markup isn't on this page
  }

  populateModelDropdown();
  bindEvents(form);
});

/**
 * Fills the appliance model <select> from TV_MODELS.
 */
function populateModelDropdown() {
  var select = document.getElementById("calc-model");
  if (!select) return;

  TV_MODELS.forEach(function (model) {
    var option = document.createElement("option");
    option.value = model.id;
    option.textContent = model.watts
      ? model.name + " (~" + model.watts + " W)"
      : model.name;
    select.appendChild(option);
  });
}

function bindEvents(form) {
  var modelSelect = document.getElementById("calc-model");
  var wattsInput = document.getElementById("calc-watts");

  // Selecting a model auto-fills (and locks) the wattage field
  modelSelect.addEventListener("change", function () {
    var model = TV_MODELS.find(function (m) {
      return m.id === modelSelect.value;
    });

    if (model && model.watts) {
      wattsInput.value = model.watts;
      wattsInput.setAttribute("readonly", "readonly");
    } else {
      wattsInput.removeAttribute("readonly");
      wattsInput.value = "";
    }
  });

  // Main calculation trigger
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    runCalculation();
  });

  // Live recalculation as the user edits values (once they've
  // successfully submitted at least once feels natural, but per
  // the brief results should update whenever inputs change too)
  form.addEventListener("input", function () {
    if (form.dataset.submitted === "true") {
      runCalculation();
    }
  });
}

/**
 * Reads + validates form input, performs the energy/cost
 * calculations, and updates the results panel in place.
 */
function runCalculation() {
  var form = document.getElementById("calc-form");
  form.dataset.submitted = "true";

  var watts = readNumberField("calc-watts", "field-watts", {
    min: 1,
    max: 5000,
    label: "Appliance power (watts)"
  });

  var hours = readNumberField("calc-hours", "field-hours", {
    min: 0,
    max: 24,
    label: "Hours of use per day"
  });

  var price = readNumberField("calc-price", "field-price", {
    min: 0,
    max: 200,
    label: "Electricity price (c/kWh)"
  });

  var statusEl = document.getElementById("calc-status");

  if (watts === null || hours === null || price === null) {
    statusEl.textContent =
      "Fix the highlighted field(s) above to see updated results.";
    statusEl.classList.remove("is-empty");
    clearResults();
    return;
  }

  var results = calculateEnergy(watts, hours, price);
  updateResultsPanel(results);

  statusEl.classList.remove("is-empty");
  statusEl.textContent =
    "Results updated for " + watts + " W running " + hours + " h/day at " +
    price + "c/kWh.";
}

/**
 * Reads a numeric input, validates it, and shows/hides an
 * inline error message. Returns the number, or null if invalid.
 */
function readNumberField(inputId, fieldWrapperId, rules) {
  var input = document.getElementById(inputId);
  var wrapper = document.getElementById(fieldWrapperId);
  var errorEl = wrapper.querySelector(".field-error");
  var raw = input.value.trim();
  var value = parseFloat(raw);

  var errorMessage = "";

  if (raw === "") {
    errorMessage = rules.label + " is required.";
  } else if (isNaN(value)) {
    errorMessage = "Enter a valid number for " + rules.label.toLowerCase() + ".";
  } else if (value < rules.min || value > rules.max) {
    errorMessage =
      rules.label + " must be between " + rules.min + " and " + rules.max + ".";
  }

  if (errorMessage) {
    wrapper.classList.add("has-error");
    errorEl.textContent = errorMessage;
    return null;
  }

  wrapper.classList.remove("has-error");
  errorEl.textContent = "";
  return value;
}

/**
 * Core calculation logic (kept separate from the DOM so it's
 * easy to read/test): watts + hours/day + price(c/kWh) ->
 * daily/monthly/yearly kWh and estimated cost.
 */
function calculateEnergy(watts, hoursPerDay, priceCentsPerKwh) {
  var dailyKwh = (watts * hoursPerDay) / 1000;
  var monthlyKwh = dailyKwh * 30;
  var yearlyKwh = dailyKwh * 365;

  var dailyCost = (dailyKwh * priceCentsPerKwh) / 100;
  var monthlyCost = (monthlyKwh * priceCentsPerKwh) / 100;
  var yearlyCost = (yearlyKwh * priceCentsPerKwh) / 100;

  return {
    dailyKwh: dailyKwh,
    monthlyKwh: monthlyKwh,
    yearlyKwh: yearlyKwh,
    dailyCost: dailyCost,
    monthlyCost: monthlyCost,
    yearlyCost: yearlyCost
  };
}

/**
 * Updates the existing result <span> elements in place
 * (never duplicates them) with newly formatted values.
 */
function updateResultsPanel(results) {
  setText("result-daily-kwh", results.dailyKwh.toFixed(2) + " kWh");
  setText("result-monthly-kwh", results.monthlyKwh.toFixed(1) + " kWh");
  setText("result-yearly-kwh", results.yearlyKwh.toFixed(0) + " kWh");
  setText("result-yearly-cost", "$" + results.yearlyCost.toFixed(2));
}

function clearResults() {
  ["result-daily-kwh", "result-monthly-kwh", "result-yearly-kwh", "result-yearly-cost"]
    .forEach(function (id) {
      setText(id, "—");
    });
}

function setText(id, text) {
  var el = document.getElementById(id);
  if (el) {
    el.textContent = text;
  }
}
