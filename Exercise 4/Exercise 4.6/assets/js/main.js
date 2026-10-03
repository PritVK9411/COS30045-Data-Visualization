// =========================================
// Exercise 4.3: D3 set up
// =========================================

const svg = d3.select(".responsive-svg-container")
  .append("svg")
    .attr("viewBox", "0 0 1200 1600")
    .style("border", "1px solid black");


// =========================================
// Exercise 4.6: Scaling charts
// =========================================

const drawBarChart = data => {

  const leftMargin = 100;   // room on the left for labels (added in 4.7)

  // barHeight and barSpacing from 4.5 are no longer needed -
  // yScale.bandwidth() and yScale(d.brand) replace them.

  // ----- Step 1: linear scale for the x-axis (bar width / count) -----
  // domain = the range of values in OUR data (0 up to a bit above the
  // highest count, ~1096, so 1200 leaves a little room)
  // range = the pixel space available in the svg for the bars
  // (viewBox width 1200, minus leftMargin, leaves 1100px for the bars)
  const xScale = d3.scaleLinear()
    .domain([0, 1200])
    .range([0, 1100]);

  // ----- Step 2: band scale for the y-axis (bar thickness / spacing) -----
  // domain = one "slot" per brand
  // range = the pixel space available in the svg, top to bottom
  // padding = the gap between bars, as a fraction of each band
  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand))
    .range([0, 1550])
    .padding(0.2);

  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("class", d => `bar-${d.count}`)
      .attr("width", d => xScale(d.count))      // scaled width, not the raw count
      .attr("height", yScale.bandwidth())        // thickness worked out by the scale
      .attr("fill", "blue")
      .attr("x", leftMargin)
      .attr("y", d => yScale(d.brand));          // position worked out by the scale

};


// =========================================
// Exercise 4.4: Load data from CSV
// =========================================

d3.csv("data/tvBrandCount.csv", d => {
  return {
    brand: d.Brand_Reg,
    count: +d["Count(SoldIn)"]
  };
}).then(data => {

  console.log(data);
  console.log(data.length);
  console.log(d3.max(data, d => d.count));
  console.log(d3.min(data, d => d.count));
  console.log(d3.extent(data, d => d.count));

  data.sort((a, b) => b.count - a.count);

  d3.select("#dataStatus")
    .text(`Data loaded: ${data.length} brands. Largest: ${data[0].brand} (${data[0].count} models).`);

  drawBarChart(data);

}).catch(error => {
  console.error("Could not load the CSV:", error);
  d3.select("#dataStatus")
    .text("Could not load data/tvBrandCount.csv. Check the file path and that Live Server is running.");
});