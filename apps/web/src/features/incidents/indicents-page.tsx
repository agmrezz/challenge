"use client";
import { Separator } from "@repo/ui/components/ui/separator";
import { SidebarTrigger } from "@repo/ui/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { NewIncidentDialog } from "./new-incident-dialog";
import { getIncidents } from "./requests";
import { columns } from "./table/columns";
import { DataTable } from "./table/incidents-table";

export default function IncidentsPage() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["incidents"],
    queryFn: () => getIncidents(),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b p-3 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger />
          <Separator
            className="mx-2 data-[orientation=vertical]:h-4"
            orientation="vertical"
          />
          <h1 className="font-mediumd text-base">Incidents</h1>
        </div>
        <NewIncidentDialog />
      </header>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
