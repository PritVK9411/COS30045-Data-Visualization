// =========================================
// Exercise 4.3: D3 set up
// =========================================

const svg = d3.select(".responsive-svg-container")
  .append("svg")
    .attr("viewBox", "0 0 1200 1600")
    .style("border", "1px solid black");

// Hard-coded test rectangle (replaced by data-driven bars later)
svg
  .append("rect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 414)
    .attr("height", 16)
    .attr("fill", "blue");


// =========================================
// Exercise 4.4: Load data from CSV
// =========================================

// The path is relative to the HTML page (televisions.html), not main.js.
// Column names must match the CSV header EXACTLY
// (KNIME exported them as Brand_Reg and Count(SoldIn)).
d3.csv("data/tvBrandCount.csv", d => {
  return {
    brand: d.Brand_Reg,
    count: +d["Count(SoldIn)"]     // + converts the text to a number
  };
}).then(data => {

  // Step 3: information about the data set (see the browser console, F12)
  console.log(data);
  console.log(data.length);
  console.log(d3.max(data, d => d.count));
  console.log(d3.min(data, d => d.count));
  console.log(d3.extent(data, d => d.count));   // [min, max]

  // Sort from largest count to smallest
  data.sort((a, b) => b.count - a.count);

  // Visible confirmation on the page that the data loaded
  d3.select("#dataStatus")
    .text(`Data loaded: ${data.length} brands. Largest: ${data[0].brand} (${data[0].count} models).`);

  // Pass the data to the chart function (built in Exercise 4.5)
  drawBarChart(data);

}).catch(error => {
  console.error("Could not load the CSV:", error);
  d3.select("#dataStatus")
    .text("Could not load data/tvBrandCount.csv. Check the file path and that Live Server is running.");
});

// Placeholder: this becomes the real bar chart in the next exercise
function drawBarChart(data) {
  console.log("drawBarChart received", data.length, "rows");
}