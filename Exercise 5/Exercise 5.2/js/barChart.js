// ---------- 1. Load and tidy the data ----------
const drawBarChart = data => {

  // ---------- 2. Size and margins ----------
  const width = 700, height = 450;
  const margin = { top: 40, right: 20, bottom: 60, left: 70 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // ---------- 3. SVG container (viewBox makes it responsive) ----------
  const svg = d3.select("#bar-chart")
    .append("div")
    .attr("class", "responsive-svg-container")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);
    // .style("border", "1px solid #ccc");   // un-comment to see the svg edges

  // inner chart: a group moved in by the left/top margins
  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // ---------- 4. Scales ----------
  const xScale = d3.scaleBand()                         // categories -> x
    .domain(data.map(d => d.screen_type))
    .range([0, innerWidth])
    .padding(0.3);

  const yScale = d3.scaleLinear()                       // numbers -> y
    .domain([0, d3.max(data, d => d.avg_energy_kwh)])
    .nice()
    .range([innerHeight, 0]);                           // flipped: 0 is at the top in SVG

  // ---------- 5. Axes ----------
  const bottomAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(10);
  innerChart.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0, ${innerHeight})`)  // without this it jumps to the top
    .call(bottomAxis);

  const leftAxis = d3.axisLeft(yScale).ticks(6);
  innerChart.append("g")
    .attr("class", "axis")
    .call(leftAxis);

  // y-axis label (rotated)
  svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -(margin.top + innerHeight / 2))
    .attr("y", 18)
    .text("Average energy consumption (kWh/year)");

  // x-axis label
  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", margin.left + innerWidth / 2)
    .attr("y", height - 8)
    .text("Screen type");

  // ---------- 6. Bars ----------
  innerChart.selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.screen_type))
    .attr("y", d => yScale(d.avg_energy_kwh))
    .attr("width", xScale.bandwidth())
    .attr("height", d => innerHeight - yScale(d.avg_energy_kwh)); // up-side-down fix

  // value labels above bars
  innerChart.selectAll(".bar-label")
    .data(data)
    .join("text")
    .attr("class", "bar-label")
    .attr("x", d => xScale(d.screen_type) + xScale.bandwidth() / 2)
    .attr("y", d => yScale(d.avg_energy_kwh) - 8)
    .text(d => d.avg_energy_kwh.toFixed(0));
};

// d3.csv reads everything as strings, so convert numbers with "+"
d3.csv("data/tv_55_inch_energy.csv", d => ({
  screen_type: d.screen_type,
  avg_energy_kwh: +d.avg_energy_kwh
})).then(data => {
  console.log(data);                                    // check types in the console
  data.sort((a, b) => d3.descending(a.avg_energy_kwh, b.avg_energy_kwh));
  drawBarChart(data);
});
