const BookApi = {
  getAllBooks: async () => {
    const response = await fetch("/v1/book", { method: "GET" })
    return response.json()
  },
  getBookByIsbn: async (bookIsbn) => {
    const response = await fetch(`/v1/book/${bookIsbn}`, { method: "GET" })
    return response.json()
  },
  addBook: async (data) => {
    const response = await fetch("/v1/book", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
    return response.json()
  },
  patchBookByIsbn: async (bookIsbn, data) => {
    const response = await fetch(`/v1/book/${bookIsbn}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
    return response.json()
  },
  deleteBook: async (bookIsbn) => {
    const response = await fetch(`/v1/book/${bookIsbn}`, { method: "DELETE" })
    return response.json()
  },
}

module.exports = { BookApi }
