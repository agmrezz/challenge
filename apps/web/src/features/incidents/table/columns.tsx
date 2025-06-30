"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { type Incident, incidentSchema } from "../schemas";

const updateStatusSchema = incidentSchema.pick({ status: true });

function SelectStatus({ incident }: { incident: Incident }) {
  const form = useForm<z.infer<typeof updateStatusSchema>>({
    defaultValues: {
      status: incident.status,
    },
  });

  async function onSubmit(data: z.infer<typeof updateStatusSchema>) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/incidents/${incident.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  return (
    <Form {...form}>
      <form
        onChange={() => {
          form.handleSubmit(onSubmit)();
        }}
      >
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only" htmlFor={`${incident.id}-status`}>
                Status
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                    className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                    id={`${incident.id}-status`}
                    size="sm"
                  >
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent align="end">
                  {incidentSchema.shape.status.options.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() +
                        status.slice(1).toLowerCase().replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

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
  },
];
