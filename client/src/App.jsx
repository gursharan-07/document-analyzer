import { useState } from "react";

export default function App() {
  const [docsUrl, setDocsUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [crawlStatus, setCrawlStatus] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);
  const [isAsking, setIsAsking] = useState(false);

  const handleCrawl = async () => {
    if (!docsUrl.trim()) return;

    setIsCrawling(true);
    setCrawlStatus("");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/crawl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: docsUrl }),
      });

      const data = await res.json();
      setCrawlStatus(data.message || "Crawl started successfully.");
    } catch (error) {
      console.error("Crawl request error:", error);
      setCrawlStatus("Failed to start crawl. Please try again.");
    } finally {
      setIsCrawling(false);
    }
  };

  const sendQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user", text: question };
    setChat((prev) => [...prev, userMessage]);

    const currentQuestion = question;
    setQuestion("");
    setIsAsking(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: currentQuestion }),
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "No response received.",
        },
      ]);
    } catch (error) {
      console.error("Question request error:", error);
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Server error. Please try again.",
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Documentation Analyzer with Smart Crawling</h1>
        <p style={styles.subtitle}>
          Enter a documentation URL, crawl the content, and ask questions about it.
        </p>

        <div style={styles.section}>
          <label style={styles.label}>Documentation URL</label>
          <div style={styles.inputRow}>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter documentation URL..."
              value={docsUrl}
              onChange={(e) => setDocsUrl(e.target.value)}
            />
            <button
              style={styles.button}
              onClick={handleCrawl}
              disabled={isCrawling}
            >
              {isCrawling ? "Crawling..." : "Crawl Docs"}
            </button>
          </div>

          {crawlStatus && <p style={styles.statusText}>{crawlStatus}</p>}
        </div>

        <div style={styles.chatBox}>
          {chat.length === 0 ? (
            <p style={styles.emptyText}>
              No questions yet. Crawl a docs URL and start asking.
            </p>
          ) : (
            chat.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  ...(msg.role === "user"
                    ? styles.userMessage
                    : styles.botMessage),
                }}
              >
                {msg.text}
              </div>
            ))
          )}
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Ask a question</label>
          <div style={styles.inputRow}>
            <input
              style={styles.input}
              type="text"
              placeholder="Ask a question about the crawled docs..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button
              style={styles.button}
              onClick={sendQuestion}
              disabled={isAsking}
            >
              {isAsking ? "Asking..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: "850px",
    backgroundColor: "#1e293b",
    borderRadius: "16px",
    padding: "24px",
    boxSizing: "border-box",
  },
  title: {
    marginTop: 0,
    marginBottom: "8px",
  },
  subtitle: {
    marginTop: 0,
    marginBottom: "20px",
    color: "#cbd5e1",
  },
  section: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
  },
  chatBox: {
    height: "360px",
    overflowY: "auto",
    backgroundColor: "#020617",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "20px",
    boxSizing: "border-box",
  },
  emptyText: {
    color: "#94a3b8",
    margin: 0,
  },
  message: {
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "10px",
    maxWidth: "80%",
    whiteSpace: "pre-wrap",
  },
  userMessage: {
    backgroundColor: "#2563eb",
    marginLeft: "auto",
  },
  botMessage: {
    backgroundColor: "#475569",
    marginRight: "auto",
  },
  inputRow: {
    display: "flex",
    gap: "8px",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "16px",
  },
  button: {
    padding: "12px 16px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
  statusText: {
    marginTop: "10px",
    color: "#93c5fd",
  },
};