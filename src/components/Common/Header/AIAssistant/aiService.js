/**
 * AI Service - Handles communication with AI APIs
 *
 * This service provides functions to interact with the DeepSeek R1 API.
 * It abstracts the API calls and provides a consistent interface for the application.
 */

// Configuration for the AI API
const API_CONFIG = {
  API_URL: "https://openrouter.ai/api/v1/chat/completions",
  API_KEY: import.meta.env.VITE_AI_API_KEY,
  MODEL: "deepseek/deepseek-r1:free",
  SITE_URL: window.location.origin,
  SITE_NAME: "CryptoSage",
};

// Log API configuration (without exposing the full API key)
console.log("API Configuration:", {
  ...API_CONFIG,
  API_KEY: API_CONFIG.API_KEY
    ? "***" + API_CONFIG.API_KEY.slice(-4)
    : "Not set",
});

/**
 * Call the AI API with the user's message
 *
 * @param {string} userMessage - The user's message to send to the AI
 * @param {Array} conversationHistory - The conversation history for context
 * @returns {Promise<string>} - The AI's response
 */
export const getAIResponse = async (userMessage, conversationHistory) => {
  try {
    return await callDeepSeekAPI(userMessage, conversationHistory);
  } catch (error) {
    console.error("Error getting AI response:", error);
    // Return a fallback response instead of throwing an error
    return generateFallbackResponse(userMessage);
  }
};

/**
 * Call the DeepSeek API
 *
 * @param {string} userMessage - The user's message
 * @param {Array} conversationHistory - The conversation history
 * @returns {Promise<string>} - The AI's response
 */
const callDeepSeekAPI = async (userMessage, conversationHistory) => {
  try {
    const formattedHistory = formatConversationHistory(conversationHistory);

    // Log the request details for debugging
    console.log("Making API request to:", API_CONFIG.API_URL);
    console.log(
      "Using API key:",
      API_CONFIG.API_KEY ? "***" + API_CONFIG.API_KEY.slice(-4) : "Not set"
    );

    const response = await fetch(API_CONFIG.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_CONFIG.API_KEY}`,
        "HTTP-Referer": API_CONFIG.SITE_URL,
        "X-Title": API_CONFIG.SITE_NAME,
      },
      body: JSON.stringify({
        model: API_CONFIG.MODEL,
        messages: [
          {
            role: "system",
            content: `You are a helpful AI assistant for ${API_CONFIG.SITE_NAME}, a cryptocurrency platform. 
            Provide accurate, informative, and concise responses about cryptocurrencies, trading, and related topics.
            Always maintain a professional and educational tone.
            IMPORTANT: Always provide complete responses. Never cut off mid-sentence or leave responses incomplete.
            If you're providing a list or steps, make sure to complete all items in the list.`,
          },
          ...formattedHistory,
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error Response:", errorData);
      throw new Error(
        `API request failed with status ${response.status}: ${
          errorData.error?.message || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content.trim();

    // Check if the response is incomplete (ends with "..." or mid-sentence)
    if (
      responseText.endsWith("...") ||
      responseText.endsWith("---") ||
      responseText.endsWith(":") ||
      responseText.endsWith(",")
    ) {
      console.warn("Received incomplete response from API, using fallback");
      return generateFallbackResponse(userMessage);
    }

    return responseText;
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    throw error;
  }
};

const formatConversationHistory = (history) => {
  return history.map((msg) => ({
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.text,
  }));
};

/**
 * Fallback response generator for when the API is not available
 *
 * @param {string} userInput - The user's input
 * @returns {string} - A fallback response
 */
export const generateFallbackResponse = (input) => {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes("bitcoin") || lowerInput.includes("btc")) {
    return "Bitcoin (BTC) is the first and most well-known cryptocurrency. It was created in 2009 by an unknown person or group using the pseudonym Satoshi Nakamoto. Bitcoin operates on a decentralized network using blockchain technology. As a store of value, Bitcoin is often compared to digital gold and is considered a hedge against inflation.";
  }

  if (lowerInput.includes("ethereum") || lowerInput.includes("eth")) {
    return "Ethereum (ETH) is a decentralized platform that enables the creation of smart contracts and decentralized applications (DApps). It was proposed in 2013 and launched in 2015 by Vitalik Buterin. Ethereum's transition to proof-of-stake has improved its sustainability and reduced energy consumption. The platform hosts thousands of tokens and DeFi applications.";
  }

  if (lowerInput.includes("portfolio") || lowerInput.includes("invest")) {
    return "When building a cryptocurrency portfolio, it's important to diversify your investments across different assets, understand your risk tolerance, and maintain a long-term perspective. Consider factors like market capitalization, technology, and team credibility. A balanced portfolio might include 40% large-cap coins (BTC, ETH), 30% mid-cap projects, 20% DeFi tokens, and 10% emerging technologies.";
  }

  if (lowerInput.includes("strategy") || lowerInput.includes("trade")) {
    return "Cryptocurrency trading strategies should be based on thorough research, risk management, and a clear investment thesis. Common approaches include long-term holding (HODL), dollar-cost averaging, and technical analysis-based trading. Always set stop-losses, take profits at predetermined levels, and never invest more than you can afford to lose.";
  }

  if (lowerInput.includes("risk") || lowerInput.includes("safe")) {
    return "Cryptocurrency investments carry significant risks. Always invest only what you can afford to lose, use secure wallets, enable two-factor authentication, and be cautious of scams and fraudulent schemes. Diversification across different assets and regular portfolio rebalancing can help manage risk. Consider keeping a portion of your portfolio in stablecoins as a safety net during market volatility.";
  }

  if (lowerInput.includes("solana") || lowerInput.includes("sol")) {
    return "Solana (SOL) is a high-performance blockchain platform designed for decentralized applications and marketplaces. It uses a unique proof-of-history consensus mechanism combined with proof-of-stake. Solana offers fast transaction speeds and low fees, making it attractive for DeFi and NFT applications. However, it has experienced some network outages in the past.";
  }

  if (lowerInput.includes("dogecoin") || lowerInput.includes("doge")) {
    return "Dogecoin (DOGE) is a cryptocurrency that started as a joke based on the popular Doge meme. Despite its origins, it has gained significant popularity and market value. Dogecoin uses a proof-of-work consensus mechanism similar to Bitcoin but with faster block times. It's known for its active community and celebrity endorsements, particularly from Elon Musk.";
  }

  return "I'm here to help you with cryptocurrency-related questions. Could you please be more specific about what you'd like to know? I can provide information about specific cryptocurrencies, investment strategies, risk management, or market trends.";
};
