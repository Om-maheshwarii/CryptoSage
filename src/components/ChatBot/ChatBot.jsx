import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { getAIResponse } from "../../services/aiService";

const MAX_MESSAGES = 50; // Limit message history

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your crypto assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setError(null); // Clear any errors when toggling
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (error) setError(null); // Clear error when typing
  };

  const resetChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hi there! I'm your crypto assistant. How can I help you today?",
        sender: "bot",
      },
    ]);
  };

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    try {
      // Add user message
      const newMessage = {
        id: Date.now(),
        text: input,
        sender: "user",
      };

      // Limit message history to prevent performance issues
      const updatedMessages = [...messages, newMessage].slice(-MAX_MESSAGES);
      setMessages(updatedMessages);
      setInput("");
      setIsTyping(true);

      // Call the AI service
      getAIResponse(input.trim())
        .then((response) => {
          setMessages((prevMessages) => {
            const updated = [
              ...prevMessages,
              {
                id: Date.now(),
                text: response,
                sender: "bot",
              },
            ].slice(-MAX_MESSAGES);
            return updated;
          });
        })
        .catch((err) => {
          console.error("Error getting AI response:", err);
          setError("Sorry, I couldn't process your request. Please try again.");

          // Fallback to local response if API fails
          const botResponse = generateBotResponse(input.trim().toLowerCase());
          setMessages((prevMessages) => {
            const updated = [
              ...prevMessages,
              {
                id: Date.now(),
                text: botResponse,
                sender: "bot",
              },
            ].slice(-MAX_MESSAGES);
            return updated;
          });
        })
        .finally(() => {
          setIsTyping(false);
        });
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Error sending message:", err);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const generateBotResponse = (query) => {
    // Enhanced response logic based on keywords
    const responses = [
      {
        keywords: ["hello", "hi", "hey", "greetings"],
        response: "Hello! How can I assist you with crypto today?",
      },
      {
        keywords: ["what is", "crypto", "cryptocurrency"],
        response:
          "Cryptocurrency is a digital or virtual currency that uses cryptography for security and operates on decentralized networks based on blockchain technology.",
      },
      {
        keywords: ["wishlist", "favorites", "save"],
        response:
          "You can add cryptocurrencies to your wishlist by clicking the heart icon next to any coin. Your wishlist can be accessed from the navigation menu.",
      },
      {
        keywords: ["market cap", "marketcap", "market capitalization"],
        response:
          "Market cap (short for market capitalization) is the total value of a cryptocurrency. It's calculated by multiplying the price of the coin by its circulating supply.",
      },
      {
        keywords: ["volume", "trading volume"],
        response:
          "Trading volume represents how much of a cryptocurrency has been traded in the last 24 hours. Higher volumes often indicate more market activity and liquidity.",
      },
      {
        keywords: ["price change", "percentage"],
        response:
          "Price change percentage shows how much the price of a cryptocurrency has changed in the last 24 hours. Green indicates a price increase, while red indicates a decrease.",
      },
      {
        keywords: ["how to", "buy", "purchase"],
        response:
          "This website is for information purposes only. To buy cryptocurrencies, you'll need to use an exchange like Coinbase, Binance, or Kraken.",
      },
      {
        keywords: ["how to", "use", "website", "app"],
        response:
          "You can use this website to track cryptocurrency prices, view detailed information about coins, and create a wishlist of your favorite cryptocurrencies.",
      },
      {
        keywords: ["bitcoin", "btc"],
        response:
          "Bitcoin (BTC) was the first cryptocurrency, created in 2009 by an unknown person or group using the name Satoshi Nakamoto. It's the largest cryptocurrency by market capitalization.",
      },
      {
        keywords: ["ethereum", "eth"],
        response:
          "Ethereum (ETH) is a decentralized, open-source blockchain with smart contract functionality. It was proposed in 2013 by Vitalik Buterin and went live in 2015.",
      },
      {
        keywords: ["thanks", "thank you", "appreciate"],
        response:
          "You're welcome! If you have any other questions about crypto, feel free to ask.",
      },
      {
        keywords: ["dashboard"],
        response:
          "You can click on the top right corner of the page and go to the dashboard page where you can view different cryptos in either grids or list view according to your choice",
      },
    ];

    // Check for keyword matches
    for (const item of responses) {
      if (item.keywords.some((keyword) => query.includes(keyword))) {
        return item.response;
      }
    }

    // Default fallback response
    return "I'm not sure I understand. Could you try asking in a different way? I can help with basic questions about cryptocurrencies and how to use this website.";
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      {isOpen ? (
        <Paper
          elevation={3}
          sx={{
            width: 320,
            height: 400,
            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: "#261e35",
            color: "white",
            display: "flex",
            flexDirection: "column",
          }}
          role="region"
          aria-label="Chat with crypto assistant"
        >
          {/* Chat Header */}
          <Box
            sx={{
              padding: 2,
              backgroundColor: "#1a1426",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <SmartToyOutlinedIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Crypto Assistant</Typography>
            </Box>
            <Box>
              <Tooltip title="Clear chat history">
                <IconButton
                  onClick={resetChat}
                  size="small"
                  sx={{ color: "white", mr: 1 }}
                  aria-label="Clear chat history"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Close chat">
                <IconButton
                  onClick={toggleChat}
                  size="small"
                  sx={{ color: "white" }}
                  aria-label="Close chat"
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: "auto",
              padding: 2,
              display: "flex",
              flexDirection: "column",
            }}
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.sender === "user" ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                {message.sender === "bot" && (
                  <Avatar
                    sx={{ bgcolor: "#7645d9", mr: 1, width: 32, height: 32 }}
                    aria-hidden="true"
                  >
                    <SmartToyOutlinedIcon fontSize="small" />
                  </Avatar>
                )}
                <Paper
                  sx={{
                    padding: 1.5,
                    borderRadius: 2,
                    maxWidth: "80%",
                    backgroundColor:
                      message.sender === "user" ? "#7645d9" : "#413060",
                    wordBreak: "break-word",
                  }}
                  role={message.sender === "bot" ? "status" : "none"}
                >
                  <Typography variant="body2">{message.text}</Typography>
                </Paper>
                {message.sender === "user" && (
                  <Avatar
                    sx={{ bgcolor: "#8a65ff", ml: 1, width: 32, height: 32 }}
                    aria-hidden="true"
                  />
                )}
              </Box>
            ))}
            {isTyping && (
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Avatar
                  sx={{ bgcolor: "#7645d9", mr: 1, width: 32, height: 32 }}
                >
                  <SmartToyOutlinedIcon fontSize="small" />
                </Avatar>
                <CircularProgress size={20} sx={{ color: "#7645d9", mr: 1 }} />
                <Typography sx={{ fontStyle: "italic", color: "grey" }}>
                  Typing...
                </Typography>
              </Box>
            )}
            {error && (
              <Box
                sx={{
                  backgroundColor: "rgba(211, 47, 47, 0.1)",
                  color: "#ff5252",
                  padding: 1,
                  borderRadius: 1,
                  mt: 1,
                  mb: 1,
                }}
              >
                <Typography variant="body2">{error}</Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Chat Input */}
          <Box
            sx={{
              padding: 2,
              backgroundColor: "#1a1426",
              display: "flex",
              alignItems: "center",
            }}
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask a question..."
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              inputRef={inputRef}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#413060",
                  },
                  "&:hover fieldset": {
                    borderColor: "#7645d9",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#7645d9",
                  },
                  backgroundColor: "#261e35",
                },
                "& .MuiInputBase-input": {
                  color: "white",
                },
              }}
              aria-label="Type your message"
            />
            <Tooltip title="Send message">
              <IconButton
                type="submit"
                disabled={input.trim() === "" || isTyping}
                sx={{
                  ml: 1,
                  color: input.trim() === "" || isTyping ? "grey" : "#7645d9",
                }}
                aria-label="Send message"
              >
                <SendIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      ) : (
        <Tooltip title="Chat with Crypto Assistant">
          <Fab
            color="primary"
            onClick={toggleChat}
            sx={{
              backgroundColor: "#7645d9",
              "&:hover": {
                backgroundColor: "#8a65ff",
              },
            }}
            aria-label="Open chat"
          >
            <ChatIcon />
          </Fab>
        </Tooltip>
      )}
    </Box>
  );
};

export default ChatBot;
