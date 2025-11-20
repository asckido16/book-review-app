import axios from "axios";
import { getAuthHeaders } from "./auth";

// Use explicit environment variable for API base URL.
// If not provided, fall back to localhost for local development.
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
// Opt-in toggle for sending credentials (cookies) with requests.
const API_USE_CREDENTIALS =
  process.env.REACT_APP_API_USE_CREDENTIALS === "true";

const api = axios.create({
  baseURL: API_URL,
});

if (API_USE_CREDENTIALS) {
  api.defaults.withCredentials = true;
}

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
