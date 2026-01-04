export const COMMUNITY_URLS = {
  ADD_FORUM: "/api/community/add_community_forum",
  GET_ALL: "/api/community/get_all_community_forum",
  GET_ALL_APPROVED: "/api/community/get_all_approved_community_forum",
  GET_BY_ID: (id: string) => `/api/community/get_community_forum_by_id/${id}`,

  APPROVE: "/api/community/approve_community",
  REJECT: "/api/community/reject_community",
  APPROVE_REJECTION: (forum_id: string) =>
    `/api/community/approve_rejection_request?forum_id=${forum_id}`,

  DELETE_FORUM: "/api/community/delete_community_forum",

  DELETE_COMMENT: (comment_id: string) =>
    `/api/community/comment?comment_id=${comment_id}`,

  LIKE: "/api/community/like",
  DISLIKE: "/api/community/dislike",

  ADD_COMMENT: (forum_id: string) => `/api/community/add_comment/${forum_id}`,
};
