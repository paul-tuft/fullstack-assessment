import { useEffect, useState } from "react";
import axios from "axios";

// Create Card interface
interface Card {
  id: number;
  click_count: number;
  first_click_ts: string | null;
}

// Main App component
const App = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [sortMode, setSortMode] = useState<"clicks" | "firstClick" | "original">("original");
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
    try {
      const res = await axios.get("http://localhost:4000/cards");
      setCards(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch cards");
    }
  };

// Handle card click
  const clickCard = async (id: number) => {
    try {
      const res = await axios.post(`http://localhost:4000/cards/${id}/click`);
      setCards(cards.map(c => (c.id === id ? res.data : c)));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to click card");
    }
  };

// Handle reset
  const resetCards = async () => {
    try {
      await axios.post("http://localhost:4000/cards/reset");
      fetchCards();
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to reset cards");
    }
  };

// Initial fetch
  useEffect(() => {
    fetchCards();
  }, []);

// Sort cards based on mode
  const sortedCards = [...cards].sort((a, b) => {
    if (sortMode === "clicks") return b.click_count - a.click_count;
    if (sortMode === "firstClick")
      return (a.first_click_ts ? new Date(a.first_click_ts).getTime() : Infinity) -
             (b.first_click_ts ? new Date(b.first_click_ts).getTime() : Infinity);
    return a.id - b.id;
  });

  // UI styles
  const containerStyle: React.CSSProperties = { padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" };
  const controlsStyle: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginBottom: "20px" };
  const buttonStyle: React.CSSProperties = { padding: "10px 15px", cursor: "pointer" };
  const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" };
  const cardStyle: React.CSSProperties = { background: "#f0f0f0", border: "1px solid #333", padding: "15px", textAlign: "center", cursor: "pointer", transition: "transform 0.1s, background 0.2s" };
  const cardNumberStyle: React.CSSProperties = { fontWeight: "bold", marginBottom: "10px" };
  const cardHoverStyle: React.CSSProperties = { transform: "scale(1.05)", background: "#e0e0e0" };
  const errorStyle: React.CSSProperties = { color: "red", textAlign: "center", marginBottom: "15px" };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center" }}>Card Clicker</h1>

      {error && <div style={errorStyle}>Error: {error}</div>}

      <div style={controlsStyle}>
        <button style={buttonStyle} onClick={() => setSortMode("clicks")}>Most Clicks</button>
        <button style={buttonStyle} onClick={() => setSortMode("firstClick")}>First Clicked</button>
        <button style={buttonStyle} onClick={() => setSortMode("original")}>Original</button>
        <button style={buttonStyle} onClick={resetCards}>Clear</button>
      </div>

      <div style={gridStyle}>
        {sortedCards.map(card => (
          <div
            key={card.id}
            style={cardStyle}
            onClick={() => clickCard(card.id)}
            onMouseOver={(e) => Object.assign((e.currentTarget as HTMLDivElement).style, cardHoverStyle)}
            onMouseOut={(e) => Object.assign((e.currentTarget as HTMLDivElement).style, cardStyle)}
          >
            <div style={cardNumberStyle}>Card {card.id}</div>
            <div>Clicks: {card.click_count}</div>
            <div>
              First Click: {card.first_click_ts ? new Date(card.first_click_ts).toLocaleString() : "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;