const drawLineChart = data => {

  // ---------- Margins: same as the bar chart so both charts match ----------
  const width = 700, height = 450;
  const margin = { top: 40, right: 20, bottom: 60, left: 70 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // ---------- SVG container and inner chart ----------
  const svg = d3.select("#line-chart")
    .append("div")
    .attr("class", "responsive-svg-container")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // ---------- Scales (both continuous, so scaleLinear) ----------
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))          // [min, max] in one go: 1998 to 2024
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.averagePrice)])
    .nice()
    .range([innerHeight, 0]);

  // ---------- Axes ----------
  const bottomAxis = d3.axisBottom(xScale)
    .ticks(10)
    .tickFormat(d3.format("d"));                   // "d" = integer, so no 1,998.5 or "2,000"
  innerChart.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(bottomAxis);

  innerChart.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(yScale).ticks(6));

  // ---------- Axis labels ----------
  svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -(margin.top + innerHeight / 2))
    .attr("y", 18)
    .text("Average spot price ($ per MWh)");

  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", margin.left + innerWidth / 2)
    .attr("y", height - 8)
    .text("Year");

  // ---------- Line: the generator turns each row into an [x, y] pixel point ----------
  const lineGenerator = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.averagePrice));
    // .curve(d3.curveCatmullRom);                 // un-comment to try a smooth curve

  innerChart.append("path")
    .datum(data)                                   // one path for the whole data set
    .attr("class", "line")
    .attr("d", lineGenerator);

  // ---------- Points (scatter plot). Remove this block to get a plain line ----------
  innerChart.selectAll(".dot")
    .data(data)
    .join("circle")
    .attr("class", "dot")
    .attr("r", 4)
    .attr("cx", d => xScale(d.year))
    .attr("cy", d => yScale(d.averagePrice));
};

// Column names must match the csv header exactly (case sensitive): year, averagePrice
d3.csv("data/ARE_Spot_Prices.csv", d => ({
  year: +d.Year,
  averagePrice: +d["Average Price (notTas-Snowy)"]
})).then(data => {
  console.log(data);
  data = data.filter(d => !isNaN(d.year) && !isNaN(d.averagePrice));
  drawLineChart(data);
}); 
