import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import interestsApi from "../api/endpoints/interests";

const INTERESTS_KEY = ["interests", "all"] as const;

export function useInterestsQuery() {
  return useQuery({
    queryKey: INTERESTS_KEY,
    queryFn: async () => {
      const { interests } = await interestsApi.listInterests();
      return interests;
    },
    staleTime: 60_000,
  });
}

export function useAddInterestMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: APIPayloads.AddInterest) => {
      const { interest } = await interestsApi.addInterest(payload);
      return interest;
    },
    onSuccess: () => {
      // Refrescar lista para que aparezca en los combobox
      qc.invalidateQueries({ queryKey: INTERESTS_KEY });
    },
  });
}

export function useDeleteInterestMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (interestId: number) => {
      await interestsApi.deleteInterest(interestId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INTERESTS_KEY });
    },
  });
}
