import axios from "axios";
import { getAuthHeaders } from "./auth";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const headers = getAuthHeaders();
  config.headers = { ...config.headers, ...headers };
  return config;
});

export const getBooks = (search = "") => {
  return api.get(`/books?search=${search}`);
};

export const getBook = (id) => {
  return api.get(`/books/${id}`);
};

export const createBook = (bookData) => {
  return api.post("/books", bookData);
};

export const getReviews = (bookId) => {
  return api.get(`/books/${bookId}/reviews`);
};

export const getUserReviews = () => {
  return api.get(`/reviews/user`);
};

export const createReview = (bookId, reviewData) => {
  return api.post(`/books/${bookId}/reviews`, reviewData);
};

export const updateReview = (reviewId, reviewData) => {
  return api.put(`/reviews/${reviewId}`, reviewData);
};

export const deleteReview = (reviewId) => {
  return api.delete(`/reviews/${reviewId}`);
};
