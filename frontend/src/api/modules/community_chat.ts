import { communityChatPayload, communityChatResponse } from "../apiTypes";
import httpClient from "../axiosSetup";

export const communityChatApi = {
  create: (data: communityChatPayload) =>
    httpClient.post<communityChatResponse>(
      "/api/community/chat/createcommunity",
      data,
      {
        headers: { useAuth: true },
      }
    ),

  getJoinedCommunity: () =>
    httpClient.get<any>("/api/community/chat/getJoinedCommunity", {
      headers: { useAuth: true },
    }),
};
