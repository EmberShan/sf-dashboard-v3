import React from "react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { ChevronDown, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "./ui/dropdown-menu";

export default function GlobalHeader({
  filters,
  setFilters,
  dropdowns,
  maxPrice,
  maxCost,
  maxMargin,
  handleMultiSelect,
  isAllSelected,
  filterChips,
  removeFilterValue,
  clearAllFilters,
}) {
  // const { open } = useSidebar(); // No longer needed for header margin
  return (
    <header className="w-full flex flex-col border-b border-gray-200 bg-background-color z-40 px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <span className="font-bold text-lg">Catalogue</span>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center ml-8">
          {dropdowns.map((dropdown) => {
            const selectedCount = filters[dropdown.key].length;
            return (
              <DropdownMenu key={dropdown.key}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    {dropdown.label}
                    {selectedCount > 0 && (
                      <span className="ml-1 text-xs bg-gray-200 rounded-full px-2 py-0.5">
                        {selectedCount}
                      </span>
                    )}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" closeOnSelect={false}>
                  <DropdownMenuCheckboxItem
                    checked={isAllSelected(dropdown.key)}
                    onCheckedChange={() =>
                      handleMultiSelect(dropdown.key, "__ALL__")
                    }
                    onSelect={(e) => e.preventDefault()}
                  >
                    {dropdown.allLabel}
                  </DropdownMenuCheckboxItem>
                  {dropdown.options.map((s) => (
                    <DropdownMenuCheckboxItem
                      key={s}
                      checked={filters[dropdown.key].includes(s)}
                      onCheckedChange={() => handleMultiSelect(dropdown.key, s)}
                      onSelect={(e) => e.preventDefault()}
                    >
                      {s}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
          {/* Price filter */}
          <div className="flex items-center gap-1 rounded-md font-medium text-sm">
            <span className="pr-1">Price</span>
            <input
              type="number"
              min={0}
              max={maxPrice}
              value={filters.price.min}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  price: { ...f.price, min: e.target.value },
                }))
              }
              className="w-16 border rounded-md px-1 py-1.5 bg-white p-4 shadow-xs hover:bg-gray-50"
              placeholder="Min"
            />
            <span className="text-xs">-</span>
            <input
              type="number"
              min={0}
              max={maxPrice}
              value={filters.price.max}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  price: { ...f.price, max: e.target.value },
                }))
              }
              className="w-16 border rounded-md px-1 py-1.5 bg-white p-4 shadow-xs hover:bg-gray-50"
              placeholder="Max"
            />
          </div>
          {/* Cost filter */}
          <div className="flex items-center gap-1 font-medium text-sm ml-2">
            <span className="pr-1">Cost</span>
            <input
              type="number"
              min={0}
              max={maxCost}
              value={filters.cost.min}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  cost: { ...f.cost, min: e.target.value },
                }))
              }
              className="w-16 border rounded-md px-1 py-1.5 bg-white p-4 shadow-xs hover:bg-gray-50"
              placeholder="Min"
            />
            <span className="text-xs">-</span>
            <input
              type="number"
              min={0}
              max={maxCost}
              value={filters.cost.max}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  cost: { ...f.cost, max: e.target.value },
                }))
              }
              className="w-16 border rounded-md px-1 py-1.5 bg-white p-4 shadow-xs hover:bg-gray-50"
              placeholder="Max"
            />
          </div>
          {/* Margin filter */}
          <div className="flex items-center gap-1 font-medium text-sm ml-2">
            <span className="pr-1">Margin (%)</span>
            <input
              type="number"
              min={0}
              max={Math.round(maxMargin)}
              value={Number(filters.margin.min).toFixed(1)}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  margin: {
                    ...f.margin,
                    min: Number(e.target.value).toFixed(1),
                  },
                }))
              }
              className="w-16 border rounded-md px-1 py-1.5 bg-white p-4 shadow-xs hover:bg-gray-50"
              placeholder="Min"
            />
            <span className="text-xs">-</span>
            <input
              type="number"
              min={0}
              max={Math.round(maxMargin)}
              value={Number(filters.margin.max).toFixed(1)}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  margin: {
                    ...f.margin,
                    max: Number(e.target.value).toFixed(1),
                  },
                }))
              }
              className="w-16 border rounded-md px-1 py-1.5 bg-white p-4 shadow-xs hover:bg-gray-50"
              placeholder="Max"
            />
          </div>
        </div>
      </div>
      {/* Filter chips */}
      {filterChips.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          <span
            className="flex items-center rounded-full py-1 text-sm font-medium text-gray-700 hover:text-primary-color transition hover:cursor-pointer"
            onClick={clearAllFilters}
          >
            Clear all filters
          </span>
          {filterChips.map((chip) => (
            <span
              key={chip.key + chip.value}
              className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-3 py-1 text-sm font-medium text-gray-700 max-w-full"
            >
              <span className="truncate mr-1">
                {chip.key}: {chip.value}
              </span>
              <button
                className="ml-1 p-0.5 rounded-full hover:bg-gray-200 focus:outline-none"
                onClick={() => removeFilterValue(chip.key, chip.value)}
                aria-label={`Remove filter ${chip.key}:${chip.value}`}
                tabIndex={0}
              >
                <X className="w-4 h-4 cursor-pointer" />
              </button>
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
