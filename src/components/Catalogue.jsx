import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
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
  const [filters, setFilters] = useState({
    season: "",
    line: "",
    color: "",
    fabric: "",
    category: "",
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
      // Dropdown filters
      const matchesDropdowns =
        (!filters.season || item.season === filters.season) &&
        (!filters.line || item.line === filters.line) &&
        (!filters.color ||
          (item.color && item.color.includes(filters.color))) &&
        (!filters.fabric || item.fabric === filters.fabric) &&
        (!filters.category || item.category === filters.category);
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
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            aria-label="Select row"
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
          <img
            src={row.original.image_url}
            alt={row.original.name}
            style={{ width: 60, height: 60, objectFit: "contain" }}
          />
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
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline"> Start Line Planning </Button>
          <div className="text-muted-foreground flex-1 text-sm">
            {Object.keys(rowSelection).length} of {filteredData.length} row(s)
            selected.
          </div>
        </div>
        {/* search and filters */}
        <div className="flex flex-wrap gap-2 items-center py-4">
          <input
            type="text"
            placeholder="Search all fields..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm border rounded px-2 py-1"
          />
          <select
            value={filters.season}
            onChange={(e) =>
              setFilters((f) => ({ ...f, season: e.target.value }))
            }
            className="border rounded px-2 py-1"
          >
            <option value="">All Seasons</option>
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={filters.line}
            onChange={(e) =>
              setFilters((f) => ({ ...f, line: e.target.value }))
            }
            className="border rounded px-2 py-1"
          >
            <option value="">All Lines</option>
            {lines.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={filters.color}
            onChange={(e) =>
              setFilters((f) => ({ ...f, color: e.target.value }))
            }
            className="border rounded px-2 py-1"
          >
            <option value="">All Colors</option>
            {colors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={filters.fabric}
            onChange={(e) =>
              setFilters((f) => ({ ...f, fabric: e.target.value }))
            }
            className="border rounded px-2 py-1"
          >
            <option value="">All Fabrics</option>
            {fabrics.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((f) => ({ ...f, category: e.target.value }))
            }
            className="border rounded px-2 py-1"
          >
            <option value="">All Categories</option>
            {categories.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* table */}
      <div className="rounded-md border overflow-x-auto">
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
