import React, { useState } from "react";
import { testAPIConnection } from "../services/aiService";

const APITest = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTest = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await testAPIConnection();
      setResult(response);
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("API Test Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="api-test">
      <h2>API Connection Test</h2>
      <button
        onClick={handleTest}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? "Testing..." : "Test API Connection"}
      </button>

      {error && (
        <div className="alert alert-danger mt-3">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="alert alert-success mt-3">
          <strong>Success!</strong> API responded: {result}
        </div>
      )}
    </div>
  );
};

export default APITest;
