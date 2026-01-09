import {
  AllCommunityResponse,
  communityChatPayload,
  communityChatResponse,
  JoinedCommunityResponse,
} from "../apiTypes";
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

  getJoinedCommunity: async () =>
    httpClient.get<JoinedCommunityResponse>(
      "/api/community/chat/getJoinedCommunity",
      {
        headers: { useAuth: true },
      }
    ),

  getAllPublicCommunity: async () =>
    httpClient.get<AllCommunityResponse>("/api/community/chat/public", {
      headers: { useAuth: true },
    }),
};
