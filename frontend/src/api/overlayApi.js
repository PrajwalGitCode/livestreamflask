import axios from "axios";

const API_URL = "http://localhost:5000/api/overlays";

export const createOverlay = (data) => axios.post(API_URL, data);
export const getOverlays = () => axios.get(API_URL);
export const updateOverlay = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteOverlay = (id) => axios.delete(`${API_URL}/${id}`);
