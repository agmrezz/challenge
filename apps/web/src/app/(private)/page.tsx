import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import IncidentsPage from "@/features/incidents/indicents-page";
import { getIncidents, getUsers } from "@/features/incidents/requests";
import getQueryClient from "@/getQueryClient";

export default async function Page() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["incidents"],
    queryFn: getIncidents,
  });
  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <IncidentsPage />
    </HydrationBoundary>
  );
}
