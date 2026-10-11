// =========================================
// Draw the scatterplot: star rating (x) vs energy consumption (y),
// coloured by screen technology. Built in Exercise 6.3.
// =========================================

const drawScatterplot = data => {

  // ----- svg container and inner chart -----
  const svg = d3.select("#scatterplot")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  // innerChartS is declared in shared-constants.js (no const here!)
  innerChartS = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // ----- scales -----
  const maxStar = d3.max(data, d => d.star);
  const maxEnergy = d3.max(data, d => d.energyConsumption);

  xScaleS
    .domain([0, maxStar])
    .range([0, innerWidth])
    .nice();

  yScaleS
    .domain([0, maxEnergy])
    .range([innerHeight, 0])      // flipped: 0 sits at the bottom
    .nice();

  // ----- circles -----
  innerChartS
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("cx", d => xScaleS(d.star))
      .attr("cy", d => yScaleS(d.energyConsumption))
      .attr("r", 5)
      .attr("fill", d => colorScale(d.screenTech))
      .attr("opacity", 0.5);        // see-through so overlaps show; no stroke

  // ----- axes -----
  innerChartS
    .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScaleS));

  innerChartS
    .append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yScaleS));

  // ----- axis labels -----
  svg
    .append("text")
      .attr("class", "axis-label")
      .attr("x", margin.left + innerWidth / 2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .text("Star rating");

  svg
    .append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -(margin.top + innerHeight / 2))
      .attr("y", 22)
      .attr("text-anchor", "middle")
      .text("Energy consumption (kWh/year)");

  // ----- legend (top right of the svg) -----
  const legend = svg
    .append("g")
      .attr("transform", `translate(${width - margin.right - 70}, ${margin.top})`);

  colorScale.domain().forEach((screenTech, i) => {

    // one group per legend item, spaced 20px apart
    const legendRow = legend
      .append("g")
        .attr("transform", `translate(0, ${i * 20})`);

    legendRow
      .append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", colorScale(screenTech));

    legendRow
      .append("text")
        .attr("class", "legend-label")
        .attr("x", 20)
        .attr("y", 6)
        .attr("text-anchor", "start")
        .style("alignment-baseline", "middle")
        .text(screenTech);
  });

};