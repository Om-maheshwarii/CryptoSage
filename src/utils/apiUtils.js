/**
 * Validates the API configuration
 * @returns {boolean} True if the configuration is valid
 * @throws {Error} If the configuration is invalid
 */
export const validateAPIConfig = () => {
  const API_KEY = import.meta.env.VITE_AI_API_KEY;
  const SITE_URL = import.meta.env.VITE_OPENROUTER_SITE_URL;
  const SITE_NAME = import.meta.env.VITE_OPENROUTER_SITE_NAME;

  // Check if API key exists and has the correct format
  if (!API_KEY) {
    throw new Error("API key is missing. Please check your .env file.");
  }

  if (!API_KEY.startsWith("sk-or-v1-")) {
    throw new Error("Invalid API key format. It should start with 'sk-or-v1-'");
  }

  // Check if site URL and name are set
  if (!SITE_URL) {
    console.warn("Site URL is not set. Using default: http://localhost:5173");
  }

  if (!SITE_NAME) {
    console.warn("Site name is not set. Using default: CryptoSage");
  }

  return true;
};
