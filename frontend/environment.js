let IS_PROD = true;
const server = IS_PROD
  ? "https://ai-chatbot-awn6.onrender.com"
  : "http://localhost:8000";

export default server;
