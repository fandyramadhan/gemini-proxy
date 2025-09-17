// api/gemini.js
export default async function handler(req, res) {
  // Basic CORS handling (ubah origin kalau perlu)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    const { type, body } = req.body || {};

    if (!type || !body) {
      return res
        .status(400)
        .json({ error: 'Missing "type" or "body" in request' });
    }

    // Pilih URL Gemini berdasarkan type
    let url = "";
    if (type === "imageGen") {
      url =
        "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=" +
        process.env.GEMINI_API_KEY;
    } else if (type === "imageEdit") {
      url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=" +
        process.env.GEMINI_API_KEY;
    } else if (type === "prompt") {
      url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=" +
        process.env.GEMINI_API_KEY;
    } else {
      return res.status(400).json({ error: "Unknown type" });
    }

    // Forward request ke Gemini
    const apiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await apiRes.text();

    // Forward status code dan body (kembalikan apa yang diterima dari Gemini)
    res
      .status(apiRes.status)
      .setHeader(
        "Content-Type",
        apiRes.headers.get("content-type") || "application/json"
      );
    res.send(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: err.message });
  }
}

export default function handler(req, res) {
  res.status(200).json({ message: "Gemini endpoint works!" });
}

