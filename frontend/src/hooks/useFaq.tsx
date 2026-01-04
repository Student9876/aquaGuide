import { faqApi } from "@/api/modules/faq";
import { useQuery } from "@tanstack/react-query";

export const useFaq = (page: number) => {
  return useQuery({
    queryKey: ["faqs", page],
    queryFn: () => faqApi.getAllFaq(page),
    staleTime: 5 * 60 * 1000, // 5 mins
    gcTime: 10 * 60 * 1000, //cache time 10 mins
  });
};
