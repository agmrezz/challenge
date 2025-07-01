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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getUsers, updateIncident } from "../requests";
import { Incident, UpdateStatus } from "../schemas";

export function SelectUser({ incident }: { incident: Incident }) {
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

  const assignedTo = users?.find((user) => user.id === incident.assignedToId);

  if (!assignedTo) {
    return <div>Unassigned</div>;
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
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
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
