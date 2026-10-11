// =========================================
// Interactions (filters). Exercise 6.2 + screen size extension.
// The screen-type and screen-size filters work together:
// a TV is shown only if it matches BOTH active buttons.
// =========================================

const populateFilters = (data) => {

  // ----- the update step: filter -> re-bin -> transition bars -----
  const updateHistogram = () => {
    const activeScreen = filters_screen.find(f => f.isActive).id;
    const activeSize = filters_size.find(f => f.isActive).id;

    const updatedData = data
      .filter(tv => activeScreen === "all" || tv.screenTech === activeScreen)
      .filter(tv => activeSize === "all" || tv.screenSize === activeSize);

    // Same bin edges as the full data (domain set in drawHistogram)
    const updatedBins = binGenerator(updatedData);

    d3.selectAll("#histogram rect")
      .data(updatedBins)
      .transition()
      .duration(500)
      .ease(d3.easeCubicInOut)
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length));
  };

  // ----- build one group of buttons (used for both filter rows) -----
  const buildButtons = (containerId, filters) => {
    d3.select(containerId)
      .selectAll(".filter")
      .data(filters)
      .join("button")
        .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
        .text(d => d.label)
        .on("click", (event, d) => {
          console.log("Clicked filter:", d);

          // Only act if the clicked button is not already active
          if (!d.isActive) {
            filters.forEach(f => { f.isActive = (f.id === d.id); });

            d3.selectAll(`${containerId} .filter`)
              .classed("active", f => f.id === d.id);

            updateHistogram();
          }
        });
  };

  buildButtons("#filters_screen", filters_screen);
  buildButtons("#filters_size", filters_size);

};


// =========================================
// Tooltip for the scatterplot. Built in Exercise 6.4.
// createTooltip() builds the (hidden) tooltip once;
// handleMouseEvents() shows it when the mouse is over a circle.
// =========================================

const createTooltip = () => {

  // group appended to the scatterplot's inner chart, hidden at first
  const tooltip = innerChartS
    .append("g")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("pointer-events", "none");   // so the tooltip never blocks the mouse

  // background rectangle (site dark colour, rounded corners, slightly transparent)
  tooltip
    .append("rect")
      .attr("width", tooltipWidth)
      .attr("height", tooltipHeight)
      .attr("rx", 3)
      .attr("ry", 3)
      .attr("fill", "#12141a")
      .attr("fill-opacity", 0.85);

  // text, centred inside the rectangle
  tooltip
    .append("text")
      .text("NA")
      .attr("x", tooltipWidth / 2)
      .attr("y", tooltipHeight / 2 + 2)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "white")
      .style("font-weight", 700);
};

const handleMouseEvents = () => {

  d3.selectAll("#scatterplot circle")
    .on("mouseenter", (e, d) => {
      console.log("Mouse entered circle", d);

      // 1. put the screen size in the tooltip text
      d3.select("#scatterplot .tooltip text")
        .text(`${d.screenSize}"`);

      // 2. where is this circle? (cx, cy are strings, so convert to numbers)
      const cx = +e.target.getAttribute("cx");
      const cy = +e.target.getAttribute("cy");

      // 3. move the tooltip above the circle and fade it in
      d3.select("#scatterplot .tooltip")
        .attr("transform", `translate(${cx - 0.5 * tooltipWidth}, ${cy - 1.5 * tooltipHeight})`)
        .transition()
        .duration(200)
          .style("opacity", 1);
    })
    .on("mouseleave", (e, d) => {
      console.log("Mouse left circle", d);

      // 4. hide the tooltip and park it out of the way
      d3.select("#scatterplot .tooltip")
        .style("opacity", 0)
        .attr("transform", `translate(0, ${height})`);
    });
};