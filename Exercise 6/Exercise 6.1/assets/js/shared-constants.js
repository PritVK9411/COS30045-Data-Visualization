// =========================================
// Shared constants: dimensions, colours, scales and the bin generator.
// They live here (not in histogram.js) so the interactions in
// Exercise 6.2 can reuse them.
// =========================================

// ----- Chart dimensions (Dufour & Meeks "inner chart" strategy) -----
const width = 900;
const height = 500;

const margin = { top: 30, right: 30, bottom: 70, left: 80 };

// The inner chart is the area left inside the margins
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// ----- Colours -----
// bodyBackgroundColor is used as the bar outline to make the gap between
// bars, so it should match the page / svg background.
const bodyBackgroundColor = "#e9ebee";
const barColor = "#17a398";
const highlightColor = "#f5a623";     // used by the filters in 6.2

// ----- Scales (domains and ranges are set in drawHistogram) -----
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

// ----- Bin generator -----
// Tells D3 which value to bin, and roughly how many bins to make.
// thresholds(14) lets D3 choose tidy bin edges (200 kWh wide here).
// Try different numbers to see how the bin size changes the patterns.
const binGenerator = d3.bin()
  .value(d => d.energyConsumption)
  .thresholds(14);