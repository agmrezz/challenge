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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getUsers, updateIncident } from "../requests";
import { Incident, UpdateStatus } from "../schemas";

export function SelectUser({ incident }: { incident: Incident }) {
  const queryClient = useQueryClient();

  const {
    data: users,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const mutation = useMutation({
    mutationFn: updateIncident,
    onMutate: async (newIncident) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["incidents"] });

      // Snapshot the previous value
      const previousIncidents = queryClient.getQueryData(["incidents"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["incidents"], (old: Incident[] | undefined) => {
        if (!old) {
          return old;
        }
        return old.map((inc) => {
          return inc.id === newIncident.id
            ? { ...inc, assignedToId: newIncident.assignedToId }
            : inc;
        });
      });

      // Return a context object with the snapshotted value
      return { previousIncidents };
    },
    onError: (_err, _newIncident, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["incidents"], context?.previousIncidents);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });

  const form = useForm<UpdateStatus>({
    defaultValues: {
      assignedToId: incident.assignedToId,
    },
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

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
          name="assignedToId"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className="sr-only"
                htmlFor={`${incident.id}-assigned`}
              >
                Assigned To
              </FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value === "UNASSIGNED" ? null : value);
                }}
                value={field.value ?? "UNASSIGNED"}
              >
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
                  <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.email}
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
