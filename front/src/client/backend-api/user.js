const UserApi = {
  borrowBook: async (isbn, userId) => {
    const response = await fetch("/v1/user/borrow", {
      method: "POST",
      body: JSON.stringify({ isbn, userId }),
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },
  returnBook: async (isbn, userId) => {
    const response = await fetch("/v1/user/return", {
      method: "POST",
      body: JSON.stringify({ isbn, userId }),
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },
  getBorrowedBooks: async () => {
    const response = await fetch("/v1/user/borrowed-books", { method: "GET" });
    return response.json();
  },
  login: async (username, password) => {
    const response = await fetch("/v1/user/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },
  getProfile: async () => {
    const response = await fetch("/v1/user/profile", { method: "GET" });
    return response.json();
  },
  logout: async () => {
    const response = await fetch("/v1/user/logout", { method: "GET" });
    return response.json();
  },
};

module.exports = { UserApi };
