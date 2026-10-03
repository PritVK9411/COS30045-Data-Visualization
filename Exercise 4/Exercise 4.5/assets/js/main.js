// =========================================
// Exercise 4.3: D3 set up
// =========================================

const svg = d3.select(".responsive-svg-container")
  .append("svg")
    .attr("viewBox", "0 0 1200 1600")
    .style("border", "1px solid black");

// (The hard-coded test rectangle from 4.3 has been removed:
//  the data-driven bars below replace it.)


// =========================================
// Exercise 4.5: Bind the data and draw the bars
// =========================================

const drawBarChart = data => {

  // Sizes for the layout (see Figure 3.18)
  const barHeight = 15;     // thickness of each bar
  const spacing = 5;        // gap between bars
  const leftMargin = 100;   // room on the left for labels (added in 4.7)

  svg
    .selectAll("rect")                  // select the rects (none exist yet)
    .data(data)                         // bind one data row to each rect
    .join("rect")                       // create a rect for every row
      .attr("class", d => `bar-${d.count}`)             // class linked to the count
      .attr("width", d => d.count)                      // width = number of TVs
      .attr("height", barHeight)                        // same thickness for all
      .attr("fill", "blue")
      .attr("x", leftMargin)                            // every bar starts at the same x
      .attr("y", (d, i) => i * (barHeight + spacing));  // move each bar down by its index

};


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

  // Information about the data set (see the browser console, F12)
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

  // Draw the chart
  drawBarChart(data);

}).catch(error => {
  console.error("Could not load the CSV:", error);
  d3.select("#dataStatus")
    .text("Could not load data/tvBrandCount.csv. Check the file path and that Live Server is running.");
});