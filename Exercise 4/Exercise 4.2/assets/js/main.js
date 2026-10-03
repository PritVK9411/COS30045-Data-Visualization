// =========================================
// Exercise 4.2: Manipulate and add elements with D3
// =========================================

// ----- Step 2: select an existing element and change its style -----
d3.select("h1")
  .style("color", "green");

// Experiment with other elements:
d3.select(".page-header p")
  .style("font-style", "italic");

// ----- Step 3: append an element to a <div> -----
// d3.select("div") would grab the FIRST div on this page, which is the
// card container, so we select our practice div by its class instead.
d3.select("div.container")
  .append("p")
    .text("Purchasing a low energy consumption TV will help with your energy bills!");

// Try selectAll to apply a change to every matching element:
// d3.selectAll(".card")
//   .append("p")
//     .text("Added to every card!");

// ----- Step 4: append an svg rectangle -----

// With no attributes the <rect> exists in the DOM (F12 > Elements)
// but is invisible. Uncomment to check, then comment it out again:
// d3.select("svg")
//   .append("rect");

// With attributes it becomes visible:
d3.select("svg")
  .append("rect")
    .attr("x", 50)
    .attr("y", 50)
    .attr("width", 100)
    .attr("height", 30)
    .style("fill", "green");