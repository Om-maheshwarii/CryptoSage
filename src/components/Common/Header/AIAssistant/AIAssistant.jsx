import React, { useState, useEffect, useRef, useContext } from "react";
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
} from "../../../../services/aiService";
import { cryptoState } from "../../../../CurrencyContext";
import "./style.css";

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false,
});

const AIAssistant = () => {
  const { currency } = cryptoState();
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

  // Add debug logging for currency data
  useEffect(() => {
    console.log("Currency data:", currency);
  }, [currency]);

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
        // Extract coin name from the message
        const coinMatch = userMessage.match(
          /(?:analyze|chart|price)\s+(?:for|of|the)?\s+([a-zA-Z]+)/i
        );
        const coinName = coinMatch ? coinMatch[1] : "Bitcoin";

        console.log("Searching for coin:", coinName);

        // Get the actual chart data from the currency context
        const chartData = Array.isArray(currency)
          ? currency.find((coin) => {
              const matchesName =
                coin.name.toLowerCase() === coinName.toLowerCase();
              const matchesSymbol =
                coin.symbol.toLowerCase() === coinName.toLowerCase();
              console.log(`Checking coin: ${coin.name} (${coin.symbol})`);
              return matchesName || matchesSymbol;
            })
          : null;

        console.log("Found chart data:", chartData);

        if (!chartData) {
          // Instead of throwing an error, provide a helpful message
          const errorMessage = `I couldn't find specific data for ${coinName}. Let me provide some general information instead.`;
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: errorMessage },
          ]);
          setIsTyping(false);

          // Get a general response about the coin
          const generalResponse = await getAIResponse(
            `Tell me about ${coinName} cryptocurrency`,
            messages
          );

          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: generalResponse },
          ]);
          return;
        }

        // Format the chart data
        const formattedChartData = {
          currentPrice: chartData.current_price,
          priceChange24h: chartData.price_change_24h,
          priceChangePercentage24h: chartData.price_change_percentage_24h,
          marketCap: chartData.market_cap,
          totalVolume: chartData.total_volume,
          high24h: chartData.high_24h,
          low24h: chartData.low_24h,
          prices:
            chartData.sparkline_in_7d?.price?.map((price, index) => [
              Date.now() -
                (chartData.sparkline_in_7d.price.length - index) * 3600000,
              price,
            ]) || [],
          volumes: chartData.total_volume
            ? [[Date.now(), chartData.total_volume]]
            : [],
          indicators: {
            "Price Change (24h)": `${
              chartData.price_change_percentage_24h?.toFixed(2) || "N/A"
            }%`,
            "Market Cap Rank": chartData.market_cap_rank || "N/A",
            "Market Cap": chartData.market_cap?.toLocaleString() || "N/A",
            "Circulating Supply":
              chartData.circulating_supply?.toLocaleString() || "N/A",
            "Total Supply": chartData.total_supply?.toLocaleString() || "N/A",
          },
        };

        console.log("Formatted chart data:", formattedChartData);

        try {
          // Get AI analysis of the chart
          const analysis = await analyzeChartData(
            formattedChartData,
            coinName,
            "7D"
          );
          console.log("AI Analysis response:", analysis);
          setMessages((prev) => [...prev, { sender: "bot", text: analysis }]);
        } catch (analysisError) {
          console.error("Error in chart analysis:", analysisError);
          throw analysisError;
        }
      } else {
        // Regular chat response
        const response = await getAIResponse(userMessage, messages);
        setMessages((prev) => [...prev, { sender: "bot", text: response }]);
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      setError(`Sorry, I encountered an error: ${error.message}`);
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
          className: "MuiDialog-paper",
        }}
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" sx={{ color: "white" }}>
              AI Assistant
            </Typography>
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
          <Paper elevation={0} className="messages-container">
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
                    gap: "8px",
                    maxWidth: "80%",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor:
                        message.sender === "user" ? "#7645d9" : "#413060",
                      width: 32,
                      height: 32,
                    }}
                  >
                    {message.sender === "user" ? "U" : <BotIcon />}
                  </Avatar>
                  <Paper
                    elevation={1}
                    className={`chat-bubble ${
                      message.sender === "user" ? "user-bubble" : "bot-bubble"
                    }`}
                  >
                    {message.sender === "bot" ? (
                      <div
                        className="markdown-content"
                        dangerouslySetInnerHTML={renderMarkdown(message.text)}
                      />
                    ) : (
                      <Typography sx={{ color: "white" }}>
                        {message.text}
                      </Typography>
                    )}
                  </Paper>
                </Box>
              </Box>
            ))}
            {isTyping && (
              <Box display="flex" justifyContent="flex-start" mb={2}>
                <Box className="typing-indicator">
                  <CircularProgress size={20} sx={{ color: "#b39ddb" }} />
                  <Typography>AI is typing...</Typography>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Paper>
        </DialogContent>

        <DialogActions>
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
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            endIcon={<SendIcon />}
            className="send-button"
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AIAssistant;
