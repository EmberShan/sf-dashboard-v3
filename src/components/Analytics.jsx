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

  // Prevent stackBy === xAxis
  const stackByOptions = xAxisOptions.filter((opt) => opt.value !== xAxis);

  // Prepare data for Nivo
  const { data, keys } = aggregateData(
    filteredData,
    xAxis,
    yAxis,
    stackBy,
    yFunc
  );

  // Custom label for each bar segment
  const getBarLabel = (bar) => {
    // bar.id is the stackBy value, bar.value is the y value
    return `${bar.id}\n${Number(bar.value).toFixed(0)}`;
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-background-color border-l z-50 border-gray-200 flex flex-col ${
        open ? "" : "translate-x-full"
      }`}
      style={{ width: PANEL_WIDTH, minWidth: PANEL_WIDTH }}
    >
      {/* header */}
      <div className="flex items-center justify-between px-8 py-3 border-b">
        <div className="flex items-center gap-2">
          <ChartPie className="w-4 h-4" />
          <div className="font-semibold">Analytics Report</div>
        </div>
        <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
          <X className="w-5 h-5" />
        </button>
      </div>
      {/* filters */}
      <div className="flex flex-col gap-4 px-8 pt-4">
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
              if (e.target.value === stackBy) setStackBy("category");
            }}
            className="border rounded px-2 py-1"
          >
            {xAxisOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* stack by */}
          <label className="text-sm font-medium ml-2">Stack By:</label>
          <select
            value={stackBy}
            onChange={(e) => setStackBy(e.target.value)}
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
      <div className="flex-1 min-h-0 p-4">
        <ResponsiveBar
          data={data}
          keys={keys}
          indexBy={xAxis}
          margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
          padding={0.3}
          groupMode="stacked"
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          axisBottom={{ legend: xAxis, legendOffset: 32 }}
          axisLeft={{ legend: yAxis, legendOffset: -40 }}
          label={getBarLabel}
          labelSkipWidth={12}
          labelSkipHeight={12}
          //   legends={[
          //     {
          //       dataFrom: 'keys',
          //       anchor: 'bottom-right',
          //       direction: 'column',
          //       translateX: 120,
          //       itemsSpacing: 3,
          //       itemWidth: 100,
          //       itemHeight: 16,
          //     },
          //   ]}
          colors={{ scheme: "nivo" }}
          animate={true}
        />
      </div>
    </div>
  );
}
