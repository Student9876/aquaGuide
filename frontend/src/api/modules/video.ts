import httpClient from "@/api/axiosSetup";
import { VideoPayload, VideoResponse } from "../apiTypes";

export const videoApi = {
  create: (data: VideoPayload) =>
    httpClient.post<VideoResponse>("/api/videos", data, {
      headers: { useAuth: true },
    }),

  getAllVideo: () =>
    httpClient.get<VideoResponse>("/api/videos", {
      headers: { useAuth: true },
    }),
};
