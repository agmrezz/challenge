import IncidentsPage from "@/features/incidents/indicents-page";
import { getIncidents } from "@/features/incidents/requests";
import getQueryClient from "@/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Page() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["incidents"],
    queryFn: getIncidents,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <IncidentsPage />
    </HydrationBoundary>
  );
}
