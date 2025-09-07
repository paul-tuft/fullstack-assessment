import React, { useState } from "react";

interface CardData {
  id: number;
  clicks: number;
  firstClick: string | null;
}

const initialCards: CardData[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  clicks: 0,
  firstClick: null,
}));

const CardGrid = () => {
  const [cards, setCards] = useState(initialCards);
  const [sortMode, setSortMode] = useState("original");

  const handleClick = (id: number) => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id === id) {
          const now = card.firstClick || new Date().toISOString();
          return {
            ...card,
            clicks: card.clicks + 1,
            firstClick: card.firstClick || now,
          };
        }
        return card;
      })
    );
  };

  const handleSort = (mode: string) => {
    let sorted = [...cards];
    if (mode === "mostClicks") {
      sorted.sort((a, b) => b.clicks - a.clicks);
    } else if (mode === "firstClicked") {
      sorted.sort((a, b) => {
        if (!a.firstClick) return 1;
        if (!b.firstClick) return -1;
        return new Date(a.firstClick).getTime() - new Date(b.firstClick).getTime();
      });
    } else {
      sorted.sort((a, b) => a.id - b.id);
    }
    setCards(sorted);
    setSortMode(mode);
  };

  const handleClear = () => {
    setCards(initialCards);
    setSortMode("original");
  };

  //UI
  return (
    <div style={{ padding: "20px" }}>
      <h2>Card Grid</h2>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => handleSort("mostClicks")}>Most → Fewest Clicks</button>
        <button onClick={() => handleSort("firstClicked")}>First Clicked → Last Clicked</button>
        <button onClick={handleClear}>Clear</button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleClick(card.id)}
            style={{
              border: "1px solid black",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "10px" }}>{card.id}</div>
            <div>Clicks: {card.clicks}</div>
            <div>
              First Click: {card.firstClick ? new Date(card.firstClick).toLocaleTimeString() : "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardGrid;
