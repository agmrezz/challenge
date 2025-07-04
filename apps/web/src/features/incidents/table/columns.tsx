"use client";

import { Button } from "@repo/ui/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { type Incident } from "../schemas";
import { SelectStatus } from "./select-status";
import { SelectUser } from "./select-user";

export const columns: ColumnDef<Incident>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <SelectStatus incident={row.original} />,
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant="ghost"
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
    },
  },
  {
    accessorKey: "assignedToId",
    header: "Assigned To",
    cell: ({ row }) => <SelectUser incident={row.original} />,
    filterFn: (row, id, value) => {
      if (value === null) {
        // Filter for unassigned (null or undefined assignedToId)
        return row.getValue(id) === null || row.getValue(id) === undefined;
      }
      // Default behavior for specific user IDs
      return row.getValue(id) === value;
    },
  },
];
