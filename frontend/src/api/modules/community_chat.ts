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

  checkMember: async (id: string) =>
    httpClient.get<{ member: boolean }>(`/api/community/chat/ismember/${id}`, {
      headers: { useAuth: true },
    }),

  joinCommunity: async (id: string) =>
    httpClient.post<{ member: boolean }>(
      `/api/community/chat/join/${id}`,
      {},
      {
        headers: { useAuth: true },
      }
    ),

  getCommunityMessages: async (id: string, page: number) =>
    httpClient.get<any>(`/api/community/chat/message/${id}?page=${page}`, {
      headers: { useAuth: true },
    }),
};
