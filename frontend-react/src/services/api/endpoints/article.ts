import axiosInstance from "../axios-instance";

async function addArticle(data: Payloads.AddArticle) {
  const response = await axiosInstance.post<ArticleAPI.ArticleRes>('/article', data);
  return response.data;
}

async function updateArticle(articleId: number, data: Payloads.UpdateArticle) {
  const response = await axiosInstance.patch<ArticleAPI.ArticleRes>(`/article/${articleId}`, data);
  return response.data;
}

async function deleteArticle(articleId: number) {
  const response = await axiosInstance.delete<MessageRes>(`/article/${articleId}`);
  return response.data;
}

async function listMyArticles() {
  const response = await axiosInstance.get<ArticleAPI.ListArticlesRes>('/article/my');
  return response.data.articles;
}

async function listArticlesByUser(userId: number) {
  const response = await axiosInstance.get<ArticleAPI.ListArticlesRes>(`/article/user/${userId}`);
  return response.data.articles;
}

async function listAllArticles() {
  const response = await axiosInstance.get<ArticleAPI.ListArticlesRes>('/article/all');
  return response.data.articles;
}

async function listArticlesByDateRange(startDate: string, endDate: string) {
  const response = await axiosInstance.get<ArticleAPI.ListArticlesRes>('/article/date-range', {
    params: { start_date: startDate, end_date: endDate }
  });
  return response.data.articles;
}

export default {
  addArticle,
  updateArticle,
  deleteArticle,
  listMyArticles,
  listArticlesByUser,
  listAllArticles,
  listArticlesByDateRange,
};
