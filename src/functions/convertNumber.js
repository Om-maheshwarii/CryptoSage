/**
 * convertNumber.js - Number Formatting Utility
 *
 * This file contains a utility function for formatting large numbers.
 * It converts numbers to a more readable format with appropriate suffixes (K, M, B, T).
 */

/**
 * Converts a number to a formatted string with appropriate suffix
 *
 * Formats large numbers to be more readable by adding appropriate suffixes:
 * - K for thousands
 * - M for millions
 * - B for billions
 * - T for trillions
 *
 * @param {number} number - The number to format
 * @returns {string} The formatted number with appropriate suffix
 */
export const convertNumber = (number) => {
  // Convert to locale string with commas as separators
  const numberWithCommas = number.toLocaleString();
  // Split by commas to determine the magnitude
  const arr = numberWithCommas.split(",");

  if (arr.length === 5) {
    // Trillions
    return arr[0] + "." + arr[1].slice(0, 2) + "T";
  } else if (arr.length === 4) {
    // Billions
    return arr[0] + "." + arr[1].slice(0, 2) + "B";
  } else if (arr.length === 3) {
    // Millions
    return arr[0] + "." + arr[1].slice(0, 2) + "M";
  } else if (arr.length === 2) {
    // Thousands
    return arr[0] + "." + arr[1].slice(0, 2) + "K";
  } else {
    // Hundreds or less - return as is with commas
    return number.toLocaleString();
  }
};
