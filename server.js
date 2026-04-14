const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>URL Content Fetcher</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; max-width: 900px; margin: 2rem auto; padding: 0 1rem; }
    h1 { margin-bottom: 1rem; }
    form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    input[type="text"] { flex: 1; padding: 0.5rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 4px; }
    button { padding: 0.5rem 1.25rem; font-size: 1rem; cursor: pointer; border: none; border-radius: 4px; background: #0078d4; color: #fff; }
    button:hover { background: #106ebe; }
    #result { white-space: pre-wrap; word-wrap: break-word; background: #f4f4f4; border: 1px solid #ddd; border-radius: 4px; padding: 1rem; max-height: 70vh; overflow: auto; display: none; font-size: 0.85rem; }
    .error { color: #d32f2f; }
  </style>
</head>
<body>
  <h1>URL Content Fetcher</h1>
  <form id="fetchForm">
    <input type="text" id="urlInput" placeholder="https://example.com" required />
    <button type="submit">Fetch</button>
  </form>
  <pre id="result"></pre>

  <script>
    const form = document.getElementById("fetchForm");
    const urlInput = document.getElementById("urlInput");
    const result = document.getElementById("result");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      result.style.display = "block";
      result.className = "";
      result.textContent = "Fetching…";

      try {
        const res = await fetch("/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlInput.value.trim() })
        });
        const data = await res.json();
        if (data.error) {
          result.className = "error";
          result.textContent = data.error;
        } else {
          result.textContent = data.content;
        }
      } catch (err) {
        result.className = "error";
        result.textContent = "Request failed: " + err.message;
      }
    });
  </script>
</body>
</html>`;

app.get("/", (_req, res) => {
  res.type("html").send(HTML);
});

app.post("/fetch", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required." });
  }

  try {
    new URL(url); // validate URL format
  } catch {
    return res.status(400).json({ error: "Invalid URL format." });
  }

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "NodeJS-URL-Fetcher/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    const content = await response.text();
    res.json({ content });
  } catch (err) {
    res.status(502).json({ error: "Failed to fetch URL: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
