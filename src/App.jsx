import { useState, useMemo } from "react";
import "./App.css";
import Catalogue from "@/components/Catalogue";
import GlobalHeader from "@/components/GlobalHeader";
import catalogue from "@/data/catalogue";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { MySidebar } from "@/components/MySidebar";
import { SquarePlus } from "lucide-react";
import Analytics from "@/components/Analytics";

// Helper to get unique values for dropdowns
const getUnique = (arr, key) => {
  const set = new Set();
  arr.forEach((item) => {
    if (Array.isArray(item[key])) {
      item[key].forEach((v) => set.add(v));
    } else {
      set.add(item[key]);
    }
  });
  return Array.from(set);
};

const seasons = getUnique(catalogue, "season");
const lines = getUnique(catalogue, "line");
const colors = getUnique(catalogue, "color");
const fabrics = getUnique(catalogue, "fabric");
const categories = getUnique(catalogue, "category");
const maxPrice = Math.max(...catalogue.map((item) => item.price));
const maxCost = Math.max(...catalogue.map((item) => item.cost));
const maxMargin = Math.max(
  ...catalogue.map((item) => ((item.price - item.cost) / item.price) * 100)
);

const dropdowns = [
  { key: "season", label: "Season", options: seasons, allLabel: "All Seasons" },
  { key: "line", label: "Line", options: lines, allLabel: "All Lines" },
  { key: "color", label: "Color", options: colors, allLabel: "All Colors" },
  { key: "fabric", label: "Fabric", options: fabrics, allLabel: "All Fabrics" },
  { key: "category", label: "Category", options: categories, allLabel: "All Categories" },
];

function AppMain() {
  const { open } = useSidebar();
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState({
    season: [],
    line: [],
    color: [],
    fabric: [],
    category: [],
    price: { min: 0, max: maxPrice },
    cost: { min: 0, max: maxCost },
    margin: { min: 0, max: maxMargin },
  });
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  // Filtering logic
  const filteredData = useMemo(() => {
    return catalogue.filter((item) => {
      // Global search
      const search = globalFilter.toLowerCase();
      const matchesSearch =
        !search ||
        Object.values(item).some((val) =>
          Array.isArray(val)
            ? val.join(", ").toLowerCase().includes(search)
            : String(val).toLowerCase().includes(search)
        );
      // Multi-select dropdown filters
      const matchesDropdowns =
        (filters.season.length === 0 || filters.season.includes(item.season)) &&
        (filters.line.length === 0 || filters.line.includes(item.line)) &&
        (filters.color.length === 0 || (item.color && item.color.some((c) => filters.color.includes(c)))) &&
        (filters.fabric.length === 0 || filters.fabric.includes(item.fabric)) &&
        (filters.category.length === 0 || filters.category.includes(item.category));
      // Price, cost, margin filters
      const matchesPrice =
        Number(item.price) >= Number(filters.price.min) &&
        Number(item.price) <= Number(filters.price.max);
      const matchesCost =
        Number(item.cost) >= Number(filters.cost.min) &&
        Number(item.cost) <= Number(filters.cost.max);
      const margin = ((item.price - item.cost) / item.price) * 100;
      const matchesMargin =
        margin >= Number(filters.margin.min) &&
        margin <= Number(filters.margin.max);
      return (
        matchesSearch &&
        matchesDropdowns &&
        matchesPrice &&
        matchesCost &&
        matchesMargin
      );
    });
  }, [globalFilter, filters]);

  // Multi-select helpers
  const handleMultiSelect = (filterKey, value) => {
    setFilters((prev) => {
      const arr = prev[filterKey];
      if (value === "__ALL__") {
        return { ...prev, [filterKey]: [] };
      }
      if (arr.includes(value)) {
        return { ...prev, [filterKey]: arr.filter((v) => v !== value) };
      }
      return { ...prev, [filterKey]: [...arr, value] };
    });
  };
  const isAllSelected = (filterKey) => filters[filterKey].length === 0;
  const removeFilterValue = (filterKey, value) => {
    if (["price", "cost", "margin"].includes(filterKey)) {
      setFilters((prev) => ({
        ...prev,
        [filterKey]:
          filterKey === "margin"
            ? { min: 0, max: maxMargin }
            : filterKey === "price"
            ? { min: 0, max: maxPrice }
            : { min: 0, max: maxCost },
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [filterKey]: prev[filterKey].filter((v) => v !== value),
      }));
    }
  };
  const clearAllFilters = () => {
    setFilters({
      season: [],
      line: [],
      color: [],
      fabric: [],
      category: [],
      price: { min: 0, max: maxPrice },
      cost: { min: 0, max: maxCost },
      margin: { min: 0, max: maxMargin },
    });
  };
  // Chips
  const filterChips = [
    ...Object.entries(filters)
      .filter(([key]) => !["price", "cost", "margin"].includes(key))
      .flatMap(([key, values]) => values.map((value) => ({ key, value }))),
    ...["price", "cost", "margin"].flatMap((key) => {
      const { min, max } = filters[key];
      const defaultMin = 0;
      const defaultMax =
        key === "price" ? maxPrice : key === "cost" ? maxCost : maxMargin;
      if (Number(min) !== defaultMin || Number(max) !== defaultMax) {
        return [{ key, value: `${min}-${max}` }];
      }
      return [];
    }),
  ];

  // Layout
  return (
    <div className="h-screen flex flex-col min-h-0 w-full bg-background-color">
      <GlobalHeader
        filters={filters}
        setFilters={setFilters}
        dropdowns={dropdowns}
        maxPrice={maxPrice}
        maxCost={maxCost}
        maxMargin={maxMargin}
        handleMultiSelect={handleMultiSelect}
        isAllSelected={isAllSelected}
        filterChips={filterChips}
        removeFilterValue={removeFilterValue}
        clearAllFilters={clearAllFilters}
      />
      <div
        className="flex-1 min-h-0 flex flex-row w-screen transition-all duration-300"
      >
        {/* Catalogue Panel */}
        <div className="flex-1 min-w-0 py-4 px-8 min-h-0 flex flex-col h-full">
          <Catalogue
            filteredData={filteredData}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            sorting={sorting}
            setSorting={setSorting}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            analyticsOpen={analyticsOpen}
            setAnalyticsOpen={setAnalyticsOpen}
          />
        </div>
        {/* Analytics Panel */}
        {analyticsOpen && (
          <div className="w-[50vw] max-w-[50vw] min-w-0 h-full min-h-0 flex flex-col">
            <Analytics
              open={analyticsOpen}
              onClose={() => setAnalyticsOpen(false)}
              filteredData={filteredData}
              filters={{}}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="w-full bg-background-color">
        <MySidebar />
        <AppMain />
      </div>
    </SidebarProvider>
  );
}

export default App;
