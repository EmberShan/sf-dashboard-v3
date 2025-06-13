/**
 * Catalogue Data Table with Multi-Select Dropdown Filters (shadcn/ui)
 */
import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./ui/table";
import { Button } from "./ui/button";
import Analytics from "./Analytics";

export default function Catalogue({
  filteredData,
  globalFilter,
  setGlobalFilter,
  sorting,
  setSorting,
  rowSelection,
  setRowSelection,
  analyticsOpen,
  setAnalyticsOpen,
}) {
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
    <div className="w-full relative h-full flex flex-row">
      {/* Catalogue Table Panel */}
      <div className={`flex-1 flex flex-col transition-all duration-300 min-w-0`}>
        {/* buttons and search */}
        <div className="flex w-full justify-between items-center pb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="bg-primary-color/80 hover:bg-primary-color text-white hover:text-white border-none"
              onClick={() => setAnalyticsOpen(true)}
            >
              Generate Report
            </Button>
            {/* add to line plan button */}
            <div className="flex items-center justify-end space-x-4">
              <Button
                className={`$${
                  Object.keys(rowSelection).length > 0
                    ? "text-white bg-primary-color/80 hover:bg-primary-color"
                    : "bg-gray-400 text-white hover:bg-gray-400 hover:cursor-default"
                }`}
              >
                {" "}
                Add to Line Plan ({Object.keys(rowSelection).length} selected)
                {" "}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-muted-foreground flex-1 text-sm">
              {filteredData.length} products found
            </div>
            <input
              type="text"
              placeholder="Search all fields..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-md border rounded px-2 py-1 bg-white"
            />
          </div>
        </div>
        {/* table */}
        <div className="rounded-md border overflow-x-auto bg-white flex-1">
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
    </div>
  );
}
