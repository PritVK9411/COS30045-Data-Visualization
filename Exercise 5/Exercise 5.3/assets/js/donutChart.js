// =========================================
// Exercise 5.3: Donut chart
// One js file per chart: this file loads the data and draws the chart.
// =========================================

// ----- Load the data (same procedure as Exercises 5.1 and 5.2) -----
// Columns are taken by position (first = size category, last = count), so it
// works whatever the CSV header is called. Check the console log to confirm.
d3.csv("data/Data_exercise_5_3.csv", (d, i, columns) => {
  const categoryColumn = columns[0];
  const countColumn = columns[columns.length - 1];
  return {
    category: d[categoryColumn],
    count: +d[countColumn]
  };
}).then(data => {

  console.log(data);

  const cleanData = data.filter(d => d.category && !isNaN(d.count));

  if (cleanData.length === 0) {
    console.error("No usable rows: check the first and last columns of the CSV.", data.columns);
    return;
  }

  // No sort: Small, Medium, Large has a natural order that a sort by
  // count would scramble. Check the CSV rows are already in that order.
  drawDonutChart(cleanData);

}).catch(error => {
  console.error("Could not load the CSV:", error);
});


// ----- Draw the chart -----
const drawDonutChart = data => {

  const width = 800;
  const height = 500;
  const padding = 40;

  // Radius from the shortest side, so the donut always fits inside the svg
  const radius = Math.min(width, height) / 2 - padding;

  // ----- Colour scale: ordinal, because categories are discrete -----
  const colourScale = d3.scaleOrdinal()
    .domain(data.map(d => d.category))
    .range(["#17a398", "#f5a623", "#e4572e"]);   // teal, amber, coral (same as the cards)

  // ----- Angles: d3.pie works out the start/end angle of each slice -----
  const pie = d3.pie()
    .value(d => d.count)
    .sort(null);                                 // keep the order in the table

  // ----- Arc generator: innerRadius 0 would make this a pie chart -----
  const arcGenerator = d3.arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius)
    .padAngle(0.02)
    .cornerRadius(4);

  // ----- svg container -----
  const svg = d3.select("#donut-chart")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  // Arcs are drawn around (0, 0), so move the group to the centre
  const chart = svg
    .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // ----- Slices -----
  const arcs = chart
    .selectAll(".arc")
    .data(pie(data))
    .join("g")
      .attr("class", "arc");

  arcs
    .append("path")
      .attr("class", "slice")
      .attr("d", arcGenerator)
      .attr("fill", d => colourScale(d.data.category));

  // ----- Labels: centroid is the middle of each slice -----
  arcs
    .append("text")
      .attr("class", "slice-label")
      .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "-0.2em")
      .text(d => d.data.category);

  arcs
    .append("text")
      .attr("class", "slice-label slice-count")
      .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "1.2em")
      .text(d => d.data.count);

};