const drawDonutChart = data => {

  // ---------- Size: relative to the radius, not inner width/height ----------
  const width = 700, height = 450;
  const padding = 40;                                   // room around the circle for labels
  const radius = Math.min(width, height) / 2 - padding; // shortest side / 2 so it fits

  // ---------- Colour scale (ordinal = discrete categories -> colours) ----------
  const colourScale = d3.scaleOrdinal()
    .domain(data.map(d => d.size))
    .range(d3.schemeTableau10);

  // ---------- Angles: d3.pie works out start/end angle for each slice ----------
  const pie = d3.pie()
    .value(d => d.count)
    .sort(null);                                        // keep the order from the csv

  // ---------- Arc generator: inner radius 60% of outer = donut ----------
  const arcGenerator = d3.arc()
    .innerRadius(radius * 0.6)                          // set to 0 for a pie chart
    .outerRadius(radius)
    .padAngle(0.02)                                     // small gap between slices
    .cornerRadius(4);

  // ---------- SVG containers ----------
  const svg = d3.select("#donut-chart")
    .append("div")
    .attr("class", "responsive-svg-container")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  // move (0,0) to the centre, because arcs are drawn around the origin
  const innerChart = svg.append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // ---------- Draw the arcs ----------
  const arcs = innerChart.selectAll(".arc")
    .data(pie(data))                                    // pie(data) adds startAngle/endAngle
    .join("path")
    .attr("class", "arc")
    .attr("d", arcGenerator)
    .attr("fill", d => colourScale(d.data.size));

  // ---------- Labels at the middle of each slice ----------
  innerChart.selectAll(".donut-label")
    .data(pie(data))
    .join("text")
    .attr("class", "donut-label")
    .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
    .attr("dy", "0.35em")
    .text(d => `${d.data.size}: ${d.data.count}`);
};

// Reads the first column as the category and the second as the count,
// so it works whatever the csv headers are called.
d3.csv("data/Data_exercise 5.3.csv").then(raw => {
  const cols = raw.columns;
  const data = raw.map(d => ({ size: d[cols[0]], count: +d[cols[1]] }));
  console.log(data);
  drawDonutChart(data);
});