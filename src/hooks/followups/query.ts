import { useQuery } from "@tanstack/react-query";
import { fetchFollowupsService } from "@/services/followups";

export const useFollowups = () => useQuery({ queryKey: ["followups"], queryFn: fetchFollowupsService });
