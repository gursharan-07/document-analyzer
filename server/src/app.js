const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Documentation Analyzer backend is running");
});

app.post("/api/crawl", (req, res) => {
  console.log("Crawl request body received:", req.body);

  const { url } = req.body;

  if (!url || !url.trim()) {
    return res.status(400).json({
      message: "Documentation URL is required",
    });
  }

  try {
    return res.json({
      message: `Crawl started for ${url}`,
    });
  } catch (error) {
    console.error("CRAWL ROUTE ERROR:", error);

    return res.status(500).json({
      message: "Something went wrong while starting the crawl.",
      error: error.message,
    });
  }
});

app.post("/api/chat", (req, res) => {
  console.log("Chat request body received:", req.body);

  const { question } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({
      reply: "Question is required",
    });
  }

  try {
    return res.json({
      reply: `You asked: "${question}". Once crawling and retrieval are added, I will answer using the documentation sources.`,
    });
  } catch (error) {
    console.error("CHAT ROUTE ERROR:", error);

    return res.status(500).json({
      reply: "Something went wrong while processing your question.",
      error: error.message,
    });
  }
});

module.exports = app;