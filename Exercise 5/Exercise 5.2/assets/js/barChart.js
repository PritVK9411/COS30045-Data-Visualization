// =========================================
// Exercise 5.1: Vertical bar chart with axes
// One js file per chart: this file loads the data and draws the chart.
// =========================================

// ----- Load the data (same procedure as Exercise 4.4) -----
// The names inside d[...] must match the CSV header EXACTLY. This file's
// header is:  Screen_Tech,Mean(Labelled energy consumption (kWh/year))
// The row function tidies the long column name into screenType / energyConsumption.
d3.csv("data/Data_exercise_5_1-1.csv", d => {
  return {
    screenType: d.Screen_Tech.toUpperCase(),     // lcd, led, oled -> LCD, LED, OLED
    energyConsumption: +d["Mean(Labelled energy consumption (kWh/year))"]   // + turns text into a number
  };
}).then(data => {

  console.log(data);                             // check strings and numbers in the console

  // Sort from highest to lowest energy consumption
  data.sort((a, b) => b.energyConsumption - a.energyConsumption);

  drawBarChart(data);

}).catch(error => {
  console.error("Could not load the CSV:", error);
});


// ----- Draw the chart -----
const drawBarChart = data => {

  // Margins leave room for the axes and labels, so the chart is drawn in
  // an "inner chart" instead of out to the edges of the svg.
  const width = 800;
  const height = 500;
  const margin = { top: 50, right: 30, bottom: 80, left: 90 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // The svg container (no border: it was only there to see the edges)
  const svg = d3.select("#bar-chart")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  // The inner chart: one group holding everything, moved in by the
  // left and top margins so its (0, 0) is the top-left of the bars area.
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // ----- Scales (ranges are relative to the inner chart) -----
  // Categories (screen type) on the x-axis: scaleBand
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.screenType))
    .range([0, innerWidth])
    .padding(0.3);

  // Quantity (energy) on the y-axis: scaleLinear.
  // The range is "upside down" because y = 0 is the TOP of the chart.
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.energyConsumption)])
    .range([innerHeight, 0])
    .nice();

  // ----- Axes -----
  // tickSize(0) removes the tick marks on the x-axis
  const bottomAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(12);
  const leftAxis = d3.axisLeft(yScale);

  // Without the translate, the x-axis would sit at the top (default 0, 0)
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
      .attr("transform", "rotate(-90)")          // turn the text to read upwards
      .attr("x", -innerHeight / 2)               // after rotating, x runs up the chart
      .attr("y", -margin.left + 25)              // and y moves it left, into the margin
      .attr("text-anchor", "middle")
      .text("Average energy consumption (kWh/year)");

  innerChart
    .append("text")
      .attr("class", "axis-label")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 15)
      .attr("text-anchor", "middle")
      .text("Screen type");

  // ----- Bars -----
  innerChart
    .selectAll(".bar")
    .data(data)
    .join("rect")
      .attr("class", "bar")                      // styled in style.css
      .attr("x", d => xScale(d.screenType))
      .attr("y", d => yScale(d.energyConsumption))
      .attr("width", xScale.bandwidth())
      // y is upside down, so the bar height is the distance from the bar's
      // top down to the bottom of the inner chart
      .attr("height", d => innerHeight - yScale(d.energyConsumption));

  // ----- Value labels above the bars -----
  innerChart
    .selectAll(".bar-label")
    .data(data)
    .join("text")
      .attr("class", "bar-label")
      .attr("x", d => xScale(d.screenType) + xScale.bandwidth() / 2)   // centre of the bar
      .attr("y", d => yScale(d.energyConsumption) - 10)                // just above it
      .attr("text-anchor", "middle")
      .text(d => Math.round(d.energyConsumption));

};