import React, { useEffect, useState } from "react";
import "./History.css";

function History() {
  const [history, setHistory] = useState([]);

  // Fetch history
  const fetchHistory = () => {
    fetch("https://calculator-history-app-by-valencio.onrender.com/history")
      .then((response) => response.json())
      .then((data) => setHistory(data))
      .catch((error) => console.error("Error fetching history:", error));
  };

  // Load history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // Clear all history
  const clearHistory = () => {
    fetch("https://calculator-history-app-by-valencio.onrender.com/history", {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setHistory([]); // update UI after clearing
      })
      .catch((error) => console.error("Error clearing history:", error));
  };

  return (
    <div className="history-container">
      <h2>History</h2>

      {history.length === 0 ? (
        <p>No calculations yet</p>
      ) : (
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              <span>{item.expression}</span>
              <span>= {item.result}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Clear History Button */}
      <button
        className="clear-btn"
        onClick={clearHistory}
        disabled={history.length === 0}
      >
        Clear
      </button>
    </div>
  );
}

export default History;
