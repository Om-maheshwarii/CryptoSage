// Simple script to test the OpenRouter API directly
import fetch from "node-fetch";

// The API key should be in the format: sk-or-v1-...
const API_KEY =
  "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const SITE_URL = "http://localhost:5174";
const SITE_NAME = "CryptoSage";

async function testAPI() {
  try {
    console.log("Testing API with key:", API_KEY.substring(0, 10) + "...");

    // Try with different header formats
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      "HTTP-Referer": SITE_URL,
      "X-Title": SITE_NAME,
    };

    console.log("Request headers:", headers);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-zero:free",
        messages: [
          {
            role: "user",
            content: "Hello, this is a test message.",
          },
        ],
      }),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      return;
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (data.choices?.[0]?.message?.content) {
      console.log(
        "Success! API responded with:",
        data.choices[0].message.content
      );
    } else {
      console.error("Invalid response format:", data);
    }
  } catch (error) {
    console.error("API call failed:", error);
  }
}

testAPI();
