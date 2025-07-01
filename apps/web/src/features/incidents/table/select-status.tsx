"use client";

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
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { updateIncident } from "../requests";
import { type Incident, incidentSchema, UpdateStatus } from "../schemas";

export function SelectStatus({ incident }: { incident: Incident }) {
  const mutation = useMutation({
    mutationFn: updateIncident,
  });

  const form = useForm<UpdateStatus>({
    defaultValues: {
      status: incident.status,
    },
  });

  function onSubmit(data: UpdateStatus) {
    mutation.mutate({ ...data, id: incident.id });
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
