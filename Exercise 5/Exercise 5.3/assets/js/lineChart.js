// =========================================
// Exercise 5.2: Scatter plot and line chart
// One js file per chart: this file loads the data and draws the chart.
// =========================================

// ----- Load the data (same procedure as Exercises 4.4 and 5.1) -----
// The row function gets the list of column names as its third value.
// The data description says the FIRST column is the year and the LAST column
// is the average price, so we take those two columns by position. This works
// whatever capitalisation or spelling the CSV header uses.
d3.csv("data/ARE_Spot_Prices.csv", (d, i, columns) => {
  const yearColumn = columns[0];                      // first column: year
  const averageColumn = columns[columns.length - 1];  // last column: average price
  return {
    year: +d[yearColumn],                // + makes year a NUMBER (a line chart needs continuous data)
    averagePrice: +d[averageColumn]      // average spot price, $ per megawatt hour
  };
}).then(data => {

  console.log(data);                     // years and prices should print as numbers

  // Keep only rows where both values are real numbers (skips any blank rows)
  const cleanData = data.filter(d => !isNaN(d.year) && !isNaN(d.averagePrice));

  if (cleanData.length === 0) {
    console.error("No usable rows: check the first and last columns of the CSV.", data.columns);
    return;
  }

  drawLineChart(cleanData);

}).catch(error => {
  console.error("Could not load the CSV:", error);
});


// ----- Draw the chart -----
const drawLineChart = data => {

  // Same margins as the bar chart (5.1), so the two charts are the same size
  const width = 800;
  const height = 500;
  const margin = { top: 50, right: 30, bottom: 80, left: 90 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // ----- Scales -----
  // Both axes are continuous, so both use scaleLinear.
  // d3.extent returns [min, max] in one go, so the x domain is [1998, 2024].
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.averagePrice)])
    .range([innerHeight, 0])          // upside down: y = 0 is the top of the chart
    .nice();

  // ----- Axes -----
  // d3.format("d") shows years as whole numbers (2000, not 2,000 or 2000.5)
  const bottomAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format("d"))
    .tickPadding(10);
  const leftAxis = d3.axisLeft(yScale);

  // ----- svg container and inner chart -----
  const svg = d3.select("#line-chart")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  innerChart
    .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);

  innerChart
    .append("g")
      .attr("class", "axis")
      .call(leftAxis);

  // ----- Axis labels -----
  innerChart
    .append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -margin.left + 25)
      .attr("text-anchor", "middle")
      .text("Average spot price ($ per MWh)");

  innerChart
    .append("text")
      .attr("class", "axis-label")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 15)
      .attr("text-anchor", "middle")
      .text("Year");

  // ----- The line -----
  // d3.line() turns each data point into an [x, y] position using the scales,
  // then joins them up. A line is an svg <path>.
  const lineGenerator = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.averagePrice));

  innerChart
    .append("path")
      .attr("class", "line")
      .attr("d", lineGenerator(data));   // the generator builds the path's "d" attribute

  // ----- The scatter plot: one circle per data point -----
  // Drawn after the line so the dots sit on top of it. To see the scatter plot
  // on its own, comment out the "The line" block above.
  innerChart
    .selectAll(".dot")
    .data(data)
    .join("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", d => xScale(d.year))
      .attr("cy", d => yScale(d.averagePrice));

};