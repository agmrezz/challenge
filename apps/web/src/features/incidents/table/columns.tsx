"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Incident } from "../schemas";

export const columns: ColumnDef<Incident>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
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
  },
];
