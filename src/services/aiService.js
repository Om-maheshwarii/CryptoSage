/**
 * AI Service - Handles communication with AI APIs
 *
 * This service provides functions to interact with AI APIs like DeepSeek or Gemini.
 * It abstracts the API calls and provides a consistent interface for the application.
 */

import fetch from "cross-fetch";
import { validateAPIConfig } from "../utils/apiUtils";

// API Configuration
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "microsoft/mai-ds-r1:free";
const MAX_TOKENS = 1000;

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_AI_API_KEY;
const SITE_URL =
  import.meta.env.VITE_OPENROUTER_SITE_URL || "http://localhost:5173";
const SITE_NAME = import.meta.env.VITE_OPENROUTER_SITE_NAME || "CryptoSage";

// Validate API configuration
validateAPIConfig();

/**
 * Call the AI API with proper error handling and debugging
 */
const callAIAPI = async (messages, systemPrompt = "") => {
  try {
    console.log("Making API request with configuration:", {
      url: API_URL,
      model: MODEL,
      siteUrl: SITE_URL,
      siteName: SITE_NAME,
      apiKeyPrefix: API_KEY ? `${API_KEY.substring(0, 10)}...` : "missing",
    });

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        max_tokens: MAX_TOKENS,
        temperature: 0.7,
      }),
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });

      switch (response.status) {
        case 401:
          throw new Error("Authentication failed. Please check your API key.");
        case 403:
          throw new Error(
            "Access forbidden. Please check your API permissions."
          );
        case 429:
          throw new Error("Rate limit exceeded. Please try again later.");
        case 500:
          throw new Error("Server error. Please try again later.");
        default:
          throw new Error(
            `API request failed with status ${response.status}: ${response.statusText}`
          );
      }
    }

    const data = await response.json();
    console.log("Response data:", data);

    // Check if we have a valid response with choices
    if (
      !data.choices ||
      !Array.isArray(data.choices) ||
      data.choices.length === 0
    ) {
      console.error("Invalid response format - no choices array:", data);
      throw new Error("Invalid response format from API - no choices array");
    }

    // Extract the message content from the content field
    const messageContent = data.choices[0].message?.content;
    if (!messageContent) {
      console.error("Invalid response format - no content:", data.choices[0]);
      throw new Error("Invalid response format from API - no content");
    }

    console.log("Extracted message content:", messageContent);
    return messageContent;
  } catch (error) {
    console.error("Error in callAIAPI:", error);
    throw error;
  }
};

/**
 * Get AI response for user message
 */
export const getAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    const messages = [
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];

    return await callAIAPI(messages);
  } catch (error) {
    console.error("Failed to get AI response:", error);
    throw error;
  }
};

/**
 * Analyze cryptocurrency chart data
 */
export const analyzeChartData = async (chartData, coinName, timeframe) => {
  try {
    const systemPrompt = `You are a cryptocurrency technical analyst. Analyze the provided chart data for ${coinName} and provide insights about price trends, support/resistance levels, and trading suggestions. Focus on the ${timeframe} timeframe.`;

    const messages = [
      {
        role: "user",
        content: `Please analyze this chart data for ${coinName} (${timeframe} timeframe):\n${JSON.stringify(
          chartData,
          null,
          2
        )}`,
      },
    ];

    return await callAIAPI(messages, systemPrompt);
  } catch (error) {
    console.error("Failed to analyze chart data:", error);
    throw error;
  }
};

/**
 * Extract keywords from user message
 */
const extractKeywords = (message) => {
  const lowerMessage = message.toLowerCase();
  const keywords = [];

  // Cryptocurrency keywords
  if (lowerMessage.includes("bitcoin") || lowerMessage.includes("btc"))
    keywords.push("bitcoin");
  if (lowerMessage.includes("ethereum") || lowerMessage.includes("eth"))
    keywords.push("ethereum");
  if (lowerMessage.includes("solana") || lowerMessage.includes("sol"))
    keywords.push("solana");
  if (lowerMessage.includes("cardano") || lowerMessage.includes("ada"))
    keywords.push("cardano");
  if (lowerMessage.includes("dogecoin") || lowerMessage.includes("doge"))
    keywords.push("dogecoin");

  // Action keywords
  if (lowerMessage.includes("buy") || lowerMessage.includes("purchase"))
    keywords.push("buy");
  if (lowerMessage.includes("sell") || lowerMessage.includes("trade"))
    keywords.push("sell");
  if (lowerMessage.includes("analyze") || lowerMessage.includes("analysis"))
    keywords.push("analyze");
  if (lowerMessage.includes("price") || lowerMessage.includes("value"))
    keywords.push("price");
  if (lowerMessage.includes("future") || lowerMessage.includes("prediction"))
    keywords.push("future");

  // Strategy keywords
  if (lowerMessage.includes("strategy") || lowerMessage.includes("strategy"))
    keywords.push("strategy");
  if (lowerMessage.includes("invest") || lowerMessage.includes("investment"))
    keywords.push("invest");
  if (lowerMessage.includes("risk") || lowerMessage.includes("safe"))
    keywords.push("risk");

  return keywords;
};

/**
 * Generate a response based on keywords
 */
const generateResponseFromKeywords = (keywords, originalMessage) => {
  // If no keywords found, return a generic response
  if (keywords.length === 0) {
    return "I'm here to help with cryptocurrency-related questions. Please try asking a specific question about cryptocurrencies, trading strategies, or market analysis.";
  }

  // Generate a response based on the keywords
  let response = "";

  // Cryptocurrency-specific responses
  if (keywords.includes("bitcoin")) {
    response +=
      "Bitcoin (BTC) is the first and most well-known cryptocurrency. It operates on a decentralized network using blockchain technology. ";

    if (keywords.includes("price")) {
      response +=
        "Bitcoin's price is influenced by various factors including market demand, institutional adoption, regulatory news, and macroeconomic conditions. ";
    }

    if (keywords.includes("future")) {
      response +=
        "Many analysts believe Bitcoin has long-term potential as a store of value and hedge against inflation, similar to digital gold. ";
    }
  }

  if (keywords.includes("ethereum")) {
    response +=
      "Ethereum (ETH) is a decentralized platform that enables smart contracts and decentralized applications (DApps). ";

    if (keywords.includes("price")) {
      response +=
        "Ethereum's price is influenced by network activity, DeFi growth, NFT market trends, and upgrades to the protocol. ";
    }

    if (keywords.includes("future")) {
      response +=
        "Ethereum's future looks promising with ongoing improvements to scalability, security, and sustainability through upgrades like the Merge. ";
    }
  }

  if (keywords.includes("solana")) {
    response +=
      "Solana (SOL) is a high-performance blockchain platform known for its fast transaction speeds and low fees. ";

    if (keywords.includes("price")) {
      response +=
        "Solana's price has shown significant volatility, influenced by network performance, developer activity, and market sentiment. ";
    }
  }

  // Action-specific responses
  if (keywords.includes("buy")) {
    response +=
      "When buying cryptocurrencies, consider factors like your investment goals, risk tolerance, and time horizon. It's often recommended to dollar-cost average rather than making large lump-sum purchases. ";
  }

  if (keywords.includes("sell")) {
    response +=
      "When selling cryptocurrencies, consider your original investment thesis, current market conditions, and tax implications. Some investors use a strategy of taking partial profits while letting the rest ride. ";
  }

  if (keywords.includes("analyze")) {
    response +=
      "Cryptocurrency analysis typically involves examining technical indicators, on-chain metrics, market sentiment, and fundamental factors. Always do your own research and consider consulting with a financial advisor. ";
  }

  // Strategy-specific responses
  if (keywords.includes("strategy")) {
    response +=
      "Effective cryptocurrency trading strategies often include diversification, risk management, and a long-term perspective. Consider approaches like dollar-cost averaging, portfolio rebalancing, and setting clear entry/exit points. ";
  }

  if (keywords.includes("invest")) {
    response +=
      "Cryptocurrency investment should be approached with caution and as part of a diversified portfolio. Consider allocating only a small percentage of your total investments to this volatile asset class. ";
  }

  if (keywords.includes("risk")) {
    response +=
      "Cryptocurrency investments carry significant risks including price volatility, regulatory uncertainty, and security concerns. Always invest only what you can afford to lose and use secure storage methods. ";
  }

  // If we have a specific question about price or analysis but no cryptocurrency mentioned
  if (
    (keywords.includes("price") || keywords.includes("analyze")) &&
    !keywords.some((k) =>
      ["bitcoin", "ethereum", "solana", "cardano", "dogecoin"].includes(k)
    )
  ) {
    response +=
      "To get specific price information or analysis for a particular cryptocurrency, please mention the name of the cryptocurrency in your question. ";
  }

  return response || generateFallbackResponse(originalMessage);
};

/**
 * Generate chart analysis based on chart data
 */
const generateChartAnalysis = (chartData, coinName, timeframe) => {
  const currentPrice = chartData.currentPrice?.toFixed(2) || "N/A";
  const priceChange = chartData.priceChangePercentage24h?.toFixed(2) || "N/A";

  let analysis = `Analysis for ${coinName} (${timeframe} timeframe):\n\n`;

  // Basic price analysis
  analysis += `Current Price: $${currentPrice}\n`;
  analysis += `24h Change: ${priceChange}%\n\n`;

  // Trend analysis
  if (priceChange > 5) {
    analysis += `The price is showing strong upward momentum with a ${priceChange}% increase in the last 24 hours. This could indicate bullish sentiment in the market.\n\n`;
  } else if (priceChange > 0) {
    analysis += `The price is slightly up by ${priceChange}% in the last 24 hours, suggesting moderate positive sentiment.\n\n`;
  } else if (priceChange > -5) {
    analysis += `The price is slightly down by ${Math.abs(
      priceChange
    )}% in the last 24 hours, suggesting moderate negative sentiment.\n\n`;
  } else {
    analysis += `The price is showing significant downward pressure with a ${Math.abs(
      priceChange
    )}% decrease in the last 24 hours. This could indicate bearish sentiment in the market.\n\n`;
  }

  // Volume analysis if available
  if (chartData.totalVolume) {
    analysis += `Trading volume appears to be ${
      chartData.totalVolume > 1000000000 ? "high" : "moderate"
    }, which ${
      priceChange > 0
        ? "supports the price increase"
        : "may not be sufficient to reverse the downtrend"
    }.\n\n`;
  }

  // Support and resistance levels (estimated)
  const estimatedSupport = (chartData.currentPrice * 0.9).toFixed(2);
  const estimatedResistance = (chartData.currentPrice * 1.1).toFixed(2);

  analysis += `Estimated support level: $${estimatedSupport}\n`;
  analysis += `Estimated resistance level: $${estimatedResistance}\n\n`;

  // Trading strategy suggestion
  analysis += `Trading Strategy Suggestion:\n`;
  if (priceChange > 5) {
    analysis += `Consider taking partial profits if you're in a profitable position, while maintaining a core position for potential further gains. Set stop-losses below recent support levels.\n`;
  } else if (priceChange > 0) {
    analysis += `The moderate uptrend could continue, but be prepared for potential reversals. Consider dollar-cost averaging if you're looking to build a position.\n`;
  } else if (priceChange > -5) {
    analysis += `The slight downtrend might present buying opportunities if you believe in the long-term prospects. Consider setting limit orders at slightly lower prices.\n`;
  } else {
    analysis += `The significant downtrend suggests caution. If you're looking to enter a position, consider waiting for signs of stabilization or setting limit orders well below current prices.\n`;
  }

  // Risk disclaimer
  analysis += `\nDisclaimer: This analysis is for informational purposes only and should not be considered financial advice. Always do your own research and consider consulting with a financial advisor.`;

  return analysis;
};

/**
 * Generate a fallback response when the API is unavailable
 */
export const generateFallbackResponse = (input) => {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes("bitcoin") || lowerInput.includes("btc")) {
    return "Bitcoin (BTC) is the first and most well-known cryptocurrency. It operates on a decentralized network using blockchain technology.";
  }

  if (lowerInput.includes("ethereum") || lowerInput.includes("eth")) {
    return "Ethereum (ETH) is a decentralized platform that enables smart contracts and decentralized applications (DApps).";
  }

  if (lowerInput.includes("analyze") || lowerInput.includes("chart")) {
    return "Based on general market analysis, it's important to consider multiple factors including price trends, volume, and market sentiment. Always do your own research and consider consulting with a financial advisor.";
  }

  return "I'm here to help with cryptocurrency-related questions. Please try asking a specific question about cryptocurrencies, trading strategies, or market analysis.";
};

/**
 * Test the API connection
 */
export const testAPIConnection = async () => {
  try {
    const testMessage = "Hello, this is a test message.";
    const response = await callAIAPI([{ role: "user", content: testMessage }]);
    console.log("API Test Response:", response);
    return response;
  } catch (error) {
    console.error("API Test Failed:", error);
    throw error;
  }
};
