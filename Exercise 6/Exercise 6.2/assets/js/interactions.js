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