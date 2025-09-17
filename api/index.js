export default function handler(req, res) {
  res.status(200).json({
    message: "🚀 Gemini Proxy is running!",
    endpoints: ["/api/gemini", "/api/prompt", "/api/image", "/api/edit"]
  });
}
