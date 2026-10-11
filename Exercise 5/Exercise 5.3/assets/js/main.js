// =========================================
// Exercise 4.3: D3 set up
// =========================================

const svg = d3.select(".responsive-svg-container")
  .append("svg")
    .attr("viewBox", "0 0 1200 1600")
    .style("border", "1px solid black");


// =========================================
// Exercise 4.7: Adding labels
// =========================================

const drawBarChart = data => {

  // Step 1: left margin - room for the brand name labels
  const leftMargin = 100;

  const xScale = d3.scaleLinear()
    .domain([0, 1200])
    .range([0, 1100]);

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand))
    .range([0, 1550])
    .padding(0.2);

  // ----- Step 2: a <g> group per row, holding the bar + its labels -----
  const barAndLabel = svg
    .selectAll("g")
    .data(data)
    .join("g")
      .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

  // ----- Step 3: the bar rectangle -----
  // y is 0 here, because the group's translate already moved it into
  // position - setting y again on the rect would double the offset.
  barAndLabel
    .append("rect")
      .attr("class", d => `bar-${d.count}`)
      .attr("width", d => xScale(d.count))
      .attr("height", yScale.bandwidth())
      .attr("fill", "blue")
      .attr("x", leftMargin)
      .attr("y", 0);

  // ----- Step 4: the brand name label, to the left of the bar -----
  barAndLabel
    .append("text")
      .text(d => d.brand)
      .attr("x", 90)
      .attr("y", 15)
      .attr("text-anchor", "end")
      .style("font-size", "13px");

  // ----- Step 5: the count value, to the right of the bar -----
  barAndLabel
    .append("text")
      .text(d => d.count)
      .attr("x", d => leftMargin + xScale(d.count) + 5)
      .attr("y", 15)
      .style("font-size", "13px");

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