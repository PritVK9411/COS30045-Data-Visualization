// =========================================
// Draw the histogram
// =========================================

const drawHistogram = data => {

  // ----- svg container and inner chart -----
  const svg = d3.select("#histogram")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  // A group shifted by the margins: everything inside it uses
  // inner-chart coordinates, so (0, 0) is the top-left of the bars area.
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // ----- bins -----
  const bins = binGenerator(data);
  console.log(bins);          // an array of arrays: one array of TVs per bin

  // ----- scales -----
  // x0 is the lowest value of a bin and x1 the highest, so the x domain runs
  // from the first bin's x0 to the last bin's x1.
  const minEnergy = bins[0].x0;
  const maxEnergy = bins[bins.length - 1].x1;

  // The y domain runs from 0 to the number of TVs in the fullest bin.
  const binsMaxLength = d3.max(bins, d => d.length);

  xScale
    .domain([minEnergy, maxEnergy])
    .range([0, innerWidth]);

  yScale
    .domain([0, binsMaxLength])
    .range([innerHeight, 0])      // flipped: 0 sits at the bottom
    .nice();

  // ----- bars -----
  innerChart
    .selectAll("rect")
    .data(bins)
    .join("rect")
      .attr("x", d => xScale(d.x0))
      .attr("y", d => yScale(d.length))
      .attr("width", d => xScale(d.x1) - xScale(d.x0))
      .attr("height", d => innerHeight - yScale(d.length))
      .attr("fill", barColor)
      .attr("stroke", bodyBackgroundColor)   // the outline makes the gap between bars
      .attr("stroke-width", 2);

  // ----- axes -----
  const bottomAxis = d3.axisBottom(xScale);
  const leftAxis = d3.axisLeft(yScale);

  innerChart
    .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);

  innerChart
    .append("g")
      .attr("class", "axis")
      .call(leftAxis);

  // ----- axis labels -----
  svg
    .append("text")
      .attr("class", "axis-label")
      .attr("x", margin.left + innerWidth / 2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .text("Energy consumption (kWh/year)");

  svg
    .append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -(margin.top + innerHeight / 2))
      .attr("y", 22)
      .attr("text-anchor", "middle")
      .text("Number of TVs");

};