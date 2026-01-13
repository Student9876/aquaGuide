import httpClient from "../axiosSetup";

export const performanceApi = {
  metrices: () =>
    httpClient.post<any>("/api/performance/metrics", {
      headers: { useAuth: true },
    }),

  history: () =>
    httpClient.post<any>("/api/performance/history", {
      headers: { useAuth: true },
    }),

  summary: () =>
    httpClient.post<any>("/api/performance/summary", {
      headers: { useAuth: true },
    }),
};
