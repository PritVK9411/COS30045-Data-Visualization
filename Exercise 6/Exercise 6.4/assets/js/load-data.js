// =========================================
// Load the data. Only this file reads the CSV;
// the charts just receive the data they are given.
// =========================================

// Column names must match the CSV header EXACTLY
// (brand, model, screenSize, screenTech, star, energyConsumption).
d3.csv("data/Ex6_TVdata_withStar.csv", d => {
  return {
    brand: d.brand,
    model: d.model,
    screenTech: d.screenTech,
    screenSize: +d.screenSize,                 // + turns text into a number
    star: +d.star,
    energyConsumption: +d.energyConsumption
  };
}).then(data => {

  // Check the data in the browser console (F12)
  console.log(data);
  console.log(data.length, "TVs loaded");

  // One TV uses far more energy than the rest (about 2650 kWh/year) and is
  // almost invisible on the chart. To leave it out, uncomment this line:
  // data = data.filter(d => d.energyConsumption <= 1800);

  drawHistogram(data);
  populateFilters(data);
  drawScatterplot(data);
  createTooltip();
  handleMouseEvents();

}).catch(error => {
  console.error("Could not load the CSV:", error);
});