const API_BASE_URL =
    process.env.REACT_APP_API_URL ||
    (window.location.hostname === "localhost"
        ? "http://localhost:4000"
        : "https://collab-ve2d.onrender.com");

export const apiUrl = (path) => `${API_BASE_URL}${path}`;
