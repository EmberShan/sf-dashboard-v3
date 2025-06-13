import React, { useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { X, ChartPie } from "lucide-react";

const xAxisOptions = [
  { value: "season", label: "Season" },
  { value: "line", label: "Line" },
  { value: "category", label: "Category" },
  { value: "color", label: "Color" },
  { value: "buyer", label: "Buyer" },
  { value: "fabric", label: "Fabric" },
];
const yAxisOptions = [
  { value: "quantity_sold", label: "Quantity Sold" },
  { value: "price", label: "Price" },
  { value: "cost", label: "Cost" },
  { value: "margin", label: "Margin" },
];

function getStackKeys(data, stackBy) {
  // Get all unique values for the stackBy field
  const set = new Set();
  data.forEach((item) => {
    if (Array.isArray(item[stackBy])) {
      item[stackBy].forEach((v) => set.add(v));
    } else {
      set.add(item[stackBy]);
    }
  });
  return Array.from(set);
}

function aggregateData(data, xAxis, yAxis, stackBy, yFunc) {
  // Group by xAxis, then stackBy
  const stackKeys = getStackKeys(data, stackBy);
  const groups = {};
  data.forEach((item) => {
    const xVal = Array.isArray(item[xAxis]) ? item[xAxis][0] : item[xAxis];
    const stackVals = Array.isArray(item[stackBy])
      ? item[stackBy]
      : [item[stackBy]];
    stackVals.forEach((stackVal) => {
      if (!groups[xVal]) groups[xVal] = {};
      if (!groups[xVal][stackVal]) groups[xVal][stackVal] = [];
      let yValue;
      if (yAxis === "margin") {
        yValue = item.quantity_sold * (item.price - item.cost);
      } else {
        yValue = item[yAxis];
      }
      groups[xVal][stackVal].push(yValue);
    });
  });
  // Aggregate
  const result = Object.entries(groups).map(([xVal, stacks]) => {
    const entry = { [xAxis]: xVal };
    stackKeys.forEach((stackKey) => {
      const arr = stacks[stackKey] || [];
      entry[stackKey] =
        yFunc === "avg" && arr.length > 0
          ? arr.reduce((a, b) => a + b, 0) / arr.length
          : arr.reduce((a, b) => a + b, 0);
    });
    return entry;
  });
  return { data: result, keys: stackKeys };
}

const PANEL_WIDTH = "50vw";

export default function Analytics({ open, onClose, filteredData, filters }) {
  const [xAxis, setXAxis] = useState("season");
  const [yAxis, setYAxis] = useState("quantity_sold");
  const [yFunc, setYFunc] = useState("sum");
  const [stackBy, setStackBy] = useState("category");

  // Prevent stackBy === xAxis and xAxis === stackBy (bidirectional exclusion)
  const xAxisOptionsFiltered = xAxisOptions.filter((opt) => opt.value !== stackBy);
  const stackByOptions = xAxisOptions.filter((opt) => opt.value !== xAxis);

  // Prepare data for Nivo
  const { data, keys } = aggregateData(
    filteredData,
    xAxis,
    yAxis,
    stackBy,
    yFunc
  );

  // Custom label for each bar segment: truncate stack-by label with ellipsis if too long
  const getBarLabel = (bar) => {
    const maxLen = 8;
    let label = String(bar.id);
    if (label.length > maxLen) label = label.slice(0, maxLen - 1) + '…';
    const value = Number(bar.value).toFixed(0);
    // Show label and value on two lines (if possible)
    return `${label}\n${value}`;
  };

  // Custom color palette for stacks
  const stackColors = ['#B6E6FF', '#36BCF8', '#0085C8'];
  const getColor = (bar) => {
    // Get the order of non-zero stack segments for this bar
    const stackOrder = keys.filter(k => bar.data[k] > 0);
    const idx = stackOrder.indexOf(bar.id);
    return stackColors[idx % stackColors.length];
  };

  if (!open) return null;

  return (
    <div
      className={
        `h-full bg-background-color border-l border-gray-200 flex flex-col w-[50vw] max-w-[50vw] min-w-0 flex-1 min-h-0`
      }
    >
      {/* header */}
      <div className="flex items-center justify-between px-8 py-3 border-b flex-shrink-0">
        <div className="flex items-center gap-2">
          <ChartPie className="w-4 h-4" />
          <div className="font-semibold">Analytics Report</div>
        </div>
        <button onClick={onClose} className="p-2 rounded hover:bg-gray-100 hover:cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>
      {/* filters */}
      <div className="flex flex-col gap-4 px-8 pt-4 flex-shrink-0">
        <div className="flex gap-2 items-center flex-wrap">
          <label className="text-sm font-medium ml-2">Y-Axis:</label>
          <select
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {yAxisOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* y function */}
          <label className="text-sm font-medium ml-2">Y Function:</label>
          <select
            value={yFunc}
            onChange={(e) => setYFunc(e.target.value)}
            className="border rounded px-2 py-1 ml-1"
          >
            <option value="sum">Sum</option>
            <option value="avg">Average</option>
          </select>
          {/* x axis */}
          <label className="text-sm font-medium">X-Axis:</label>
          <select
            value={xAxis}
            onChange={(e) => {
              setXAxis(e.target.value);
              if (e.target.value === stackBy) setStackBy(stackByOptions[0]?.value || "category");
            }}
            className="border rounded px-2 py-1"
          >
            {xAxisOptionsFiltered.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* stack by */}
          <label className="text-sm font-medium ml-2">Stack By:</label>
          <select
            value={stackBy}
            onChange={(e) => {
              setStackBy(e.target.value);
              if (e.target.value === xAxis) setXAxis(xAxisOptionsFiltered[0]?.value || "season");
            }}
            className="border rounded px-2 py-1"
          >
            {stackByOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex-1 min-h-0 p-4 overflow-auto flex flex-col">
        <ResponsiveBar
          data={data}
          keys={keys}
          indexBy={xAxis}
          margin={{ top: 20, right: 50, bottom: 50, left: 60 }}
          padding={0.1}
          groupMode="stacked"
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          axisBottom={{ legend: '', legendOffset: 32 }}
          axisLeft={{ legend: '', legendOffset: -40 }}
          label={getBarLabel}
          labelSkipWidth={12}
          labelSkipHeight={12}
          colors={getColor}
          labelTextColor="#000"
          theme={{
            labels: {
              text: {
                dominantBaseline: 'central',
                dy: 4, // 4px from edge (SVG dy)
              },
            },
            axis: {
              legend: {
                text: {
                  fontSize: 14,
                  fontWeight: 500,
                },
              },
            },
          }}
          animate={true}
        />
      </div>
    </div>
  );
}
