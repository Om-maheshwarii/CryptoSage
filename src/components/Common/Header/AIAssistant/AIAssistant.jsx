import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Paper,
  Typography,
  TextField,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
} from "@mui/material";
import {
  SmartToyOutlined as BotIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { marked } from "marked";
import {
  getAIResponse,
  generateFallbackResponse,
  analyzeChartData,
} from "./aiService";
import "./style.css";

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false,
});

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your AI assistant. I can help you with cryptocurrency analysis, trading strategies, and market insights. How can I assist you today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Focus input field when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setError(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Chat history cleared. How can I help you?",
      },
    ]);
  };

  const renderMarkdown = (text) => {
    try {
      return { __html: marked(text) };
    } catch (error) {
      console.error("Error rendering markdown:", error);
      return { __html: text };
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setIsTyping(true);
    setError(null);

    try {
      // Check if the message is requesting chart analysis
      if (
        userMessage.toLowerCase().includes("analyze") &&
        (userMessage.toLowerCase().includes("chart") ||
          userMessage.toLowerCase().includes("price"))
      ) {
        // Extract coin name from the message (this is a simple implementation)
        const coinMatch = userMessage.match(
          /(?:analyze|chart|price)\s+(?:for|of|the)?\s+([a-zA-Z]+)/i
        );
        const coinName = coinMatch ? coinMatch[1] : "Bitcoin"; // Default to Bitcoin if no coin specified

        // Get chart data from your application state or API
        // This is a placeholder - you'll need to implement this based on your app's structure
        const chartData = {
          currentPrice: 50000, // Example value
          priceChange24h: 1000,
          priceChangePercentage24h: 2.5,
          marketCap: 1000000000000,
          totalVolume: 50000000000,
          high24h: 51000,
          low24h: 49000,
          prices: [
            [Date.now() - 3600000, 49000],
            [Date.now() - 1800000, 49500],
            [Date.now(), 50000],
          ],
          volumes: [
            [Date.now() - 3600000, 1000000000],
            [Date.now() - 1800000, 1200000000],
            [Date.now(), 1500000000],
          ],
          indicators: {
            RSI: 65,
            MACD: "Bullish",
            "Moving Average (50)": 49000,
            "Moving Average (200)": 48000,
          },
        };

        // Get AI analysis of the chart
        const analysis = await analyzeChartData(chartData, coinName, "1D");
        setMessages((prev) => [...prev, { sender: "bot", text: analysis }]);
      } else {
        // Regular chat response
        const response = await getAIResponse(userMessage, messages);
        setMessages((prev) => [...prev, { sender: "bot", text: response }]);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      setError("Sorry, I encountered an error. Please try again.");
      const fallbackResponse = generateFallbackResponse(userMessage);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: fallbackResponse },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Box className="ai-assistant-container">
      <Tooltip title="AI Assistant">
        <IconButton
          className="ai-assistant-button"
          onClick={handleOpen}
          color="primary"
        >
          <BotIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: "ai-assistant-dialog",
        }}
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">AI Assistant</Typography>
            <Box>
              <IconButton onClick={clearChat} size="small">
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Paper
            elevation={0}
            sx={{
              height: "60vh",
              overflowY: "auto",
              p: 2,
              backgroundColor: "transparent",
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.sender === "user" ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection:
                      message.sender === "user" ? "row-reverse" : "row",
                    alignItems: "flex-start",
                    maxWidth: "80%",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor:
                        message.sender === "user"
                          ? "primary.main"
                          : "secondary.main",
                      width: 32,
                      height: 32,
                      mr: message.sender === "user" ? 0 : 1,
                      ml: message.sender === "user" ? 1 : 0,
                    }}
                  >
                    {message.sender === "user" ? "U" : <BotIcon />}
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      backgroundColor:
                        message.sender === "user"
                          ? "primary.main"
                          : "background.paper",
                      color:
                        message.sender === "user" ? "white" : "text.primary",
                      borderRadius: 2,
                    }}
                  >
                    {message.sender === "bot" ? (
                      <div
                        className="markdown-content"
                        dangerouslySetInnerHTML={renderMarkdown(message.text)}
                      />
                    ) : (
                      <Typography>{message.text}</Typography>
                    )}
                  </Paper>
                </Box>
              </Box>
            ))}
            {isTyping && (
              <Box display="flex" justifyContent="flex-start" mb={2}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "background.paper",
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography variant="body2">AI is typing...</Typography>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Paper>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isTyping}
            inputRef={inputRef}
            error={!!error}
            helperText={error}
            multiline
            maxRows={4}
            sx={{ mr: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AIAssistant;
