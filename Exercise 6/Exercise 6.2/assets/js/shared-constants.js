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
const bodyBackgroundColor = "#e9ebee";
const barColor = "#17a398";
const highlightColor = "#f5a623";     // used by the filters in 6.2

// ----- Scales (domains and ranges are set in drawHistogram) -----
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

// ----- Bin generator -----
// Tells D3 which value to bin, and roughly how many bins to make.
// NOTE: drawHistogram sets .domain() once from the full data set, so that
// filtered data uses exactly the same bin edges as the full histogram.
const binGenerator = d3.bin()
  .value(d => d.energyConsumption)
  .thresholds(14);

// ----- Filter buttons -----
// id: matches the value in the data (or "all"); label: text on the button;
// isActive: starting state.
const filters_screen = [
  { id: "all",  label: "All",  isActive: true  },
  { id: "LED",  label: "LED",  isActive: false },
  { id: "LCD",  label: "LCD",  isActive: false },
  { id: "OLED", label: "OLED", isActive: false }
];

// Most frequent screen sizes (inches). Ids are numbers to match d.screenSize.
const filters_size = [
  { id: "all", label: "All Sizes", isActive: true  },
  { id: 24,    label: '24"',       isActive: false },
  { id: 32,    label: '32"',       isActive: false },
  { id: 55,    label: '55"',       isActive: false },
  { id: 65,    label: '65"',       isActive: false },
  { id: 98,    label: '98"',       isActive: false }
];