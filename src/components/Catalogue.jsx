/**
 * Catalogue Data Table with Multi-Select Dropdown Filters (shadcn/ui)
 */
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, X } from "lucide-react";
import catalogue from "../data/catalogue";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./ui/table";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "./ui/dropdown-menu";

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

export default function Catalogue() {
  const [globalFilter, setGlobalFilter] = useState("");
  // Multi-select filters: each is an array
  const [filters, setFilters] = useState({
    season: [],
    line: [],
    color: [],
    fabric: [],
    category: [],
  });
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

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
        (filters.color.length === 0 ||
          (item.color && item.color.some((c) => filters.color.includes(c)))) &&
        (filters.fabric.length === 0 || filters.fabric.includes(item.fabric)) &&
        (filters.category.length === 0 ||
          filters.category.includes(item.category));
      return matchesSearch && matchesDropdowns;
    });
  }, [globalFilter, filters]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            aria-label="Select all"
            className="w-4 h-4 hover:cursor-pointer"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            aria-label="Select row"
            className="w-4 h-4 hover:cursor-pointer"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "style_number",
        header: () => <span>Style #</span>,
        enableSorting: true,
      },
      {
        accessorKey: "image_url",
        header: () => <span>Image</span>,
        cell: ({ row }) => (
          <div className="flex items-center justify-center min-w-[110px] min-h-[110px]">
            <img
              src={row.original.image_url}
              alt={row.original.name}
              style={{ width: 100, height: 100, objectFit: "contain" }}
            />
          </div>
        ),
        enableSorting: false,
      },
      ...[
        "name",
        "season",
        "line",
        "category",
        "color",
        "available_sizes",
        "buyer",
        "date_added",
        "quantity_sold",
        "price",
        "cost",
        "fabric",
        "status",
      ].map((key) => {
        let col = {
          accessorKey: key,
          header: ({ column }) => {
            const sortable = [
              "season",
              "price",
              "date_added",
              "cost",
              "quantity_sold",
            ].includes(key);
            return sortable ? (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                {key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </Button>
            ) : (
              <span>
                {key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
            );
          },
          enableSorting: [
            "season",
            "price",
            "date_added",
            "cost",
            "quantity_sold",
          ].includes(key),
          cell: ({ row }) => {
            const val = row.original[key];
            if (Array.isArray(val)) return val.join(", ");
            if (key === "price" || key === "cost")
              return `$${Number(val).toFixed(2)}`;
            return val;
          },
        };
        return col;
      }),
    ],
    []
  );

  // Helper for multi-select dropdowns
  const handleMultiSelect = (filterKey, value) => {
    setFilters((prev) => {
      const arr = prev[filterKey];
      // If "all" is selected, clear all selections
      if (value === "__ALL__") {
        return { ...prev, [filterKey]: [] };
      }
      // If the value is already selected, remove it
      if (arr.includes(value)) {
        return { ...prev, [filterKey]: arr.filter((v) => v !== value) };
      }
      // Otherwise, add it
      return { ...prev, [filterKey]: [...arr, value] };
    });
  };

  // Helper to check if "all" is selected (i.e., none selected)
  const isAllSelected = (filterKey) => filters[filterKey].length === 0;

  // Helper for removing a single filter value
  const removeFilterValue = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: prev[filterKey].filter((v) => v !== value),
    }));
  };

  // Helper for generating chips for all selected filters
  const filterChips = Object.entries(filters).flatMap(([key, values]) =>
    values.map((value) => ({ key, value }))
  );

  // Dropdown filter config
  const dropdowns = [
    {
      key: "season",
      label: "Season",
      options: seasons,
      allLabel: "All Seasons",
    },
    {
      key: "line",
      label: "Line",
      options: lines,
      allLabel: "All Lines",
    },
    {
      key: "color",
      label: "Color",
      options: colors,
      allLabel: "All Colors",
    },
    {
      key: "fabric",
      label: "Fabric",
      options: fabrics,
      allLabel: "All Fabrics",
    },
    {
      key: "category",
      label: "Category",
      options: categories,
      allLabel: "All Categories",
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    manualPagination: true,
  });

  return (
    <div className="w-full">
      <div className="flex w-full justify-between items-center pb-4">
        {/* how many rows are selected */}
        <div className="flex items-center justify-end space-x-4">
          <Button> Add to Line Plan </Button>
          <div className="text-muted-foreground flex-1 text-sm">
            {Object.keys(rowSelection).length} of {filteredData.length} row(s)
            selected.
          </div>
        </div>
        <input
          type="text"
          placeholder="Search all fields..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm border rounded px-2 py-1"
        />
      </div>
      {/* search and filters */}
      <div className="flex flex-wrap gap-2 items-center mb-4">
        {/* Multi-select Dropdowns for filters */}
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
      </div>

      {/* Filter chips */}
      {filterChips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className="flex items-center rounded-full px-3 py-1 text-sm font-medium text-gray-700 hover:text-primary-color transition hover:cursor-pointer"
            onClick={() =>
              setFilters({
                season: [],
                line: [],
                color: [],
                fabric: [],
                category: [],
              })
            }
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
      {/* table */}
      <div className="rounded-md border overflow-x-auto bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
