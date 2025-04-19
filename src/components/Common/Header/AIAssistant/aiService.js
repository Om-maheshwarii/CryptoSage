/**
 * AI Service - Re-exports functions from the main aiService
 *
 * This file re-exports the AI service functions from the main services directory
 * to maintain compatibility with the existing imports.
 */

import {
  getAIResponse,
  generateFallbackResponse,
  analyzeChartData,
} from "../../../../services/aiService";

export { getAIResponse, generateFallbackResponse, analyzeChartData };
