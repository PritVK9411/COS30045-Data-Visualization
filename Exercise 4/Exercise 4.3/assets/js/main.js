// =========================================
// Exercise 4.3: D3 set up
// (Exercise 4.2 code deleted, as per Step 1)
// =========================================

// Step 2: create an svg inside the responsive container.
// viewBox fixes the internal coordinate system (1200 x 1600)
// while the container div scales with the window.
const svg = d3.select(".responsive-svg-container")
  .append("svg")
    .attr("viewBox", "0 0 1200 1600")
    .style("border", "1px solid black");

// Step 3: hard-coded test rectangle to confirm the canvas works.
// Later exercises replace these numbers with values from the CSV.
svg
  .append("rect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 414)
    .attr("height", 16)
    .attr("fill", "blue");