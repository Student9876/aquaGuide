import httpClient from "../axiosSetup";

export const faqApi = {
  getAllCommunityForums: async (page: number) => {
    const res = await httpClient.get<any>(`/api/faqs/get-faq?page=${page}`, {
      headers: { useAuth: true },
    });
    return res.data;
  },
};
