import httpClient from "@/api/axiosSetup";
import { GetAllTextGuidesResponse, TextGuidePayload } from "../apiTypes";

export const textApi = {
  create: async (data: TextGuidePayload): Promise<any> => {
    const res = await httpClient.post("/api/textguides/text_guide", data, {
      headers: { useAuth: true },
    });
    return res.data;
  },

  getAllGuides: async (page: number): Promise<GetAllTextGuidesResponse> => {
    const res = await httpClient.get<GetAllTextGuidesResponse>(
      `/api/textguides/get_all_guides?page=${page}`,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },
};
