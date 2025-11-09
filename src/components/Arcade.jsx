import { useState } from "react";
import SnakeGame from "./SnakeGame";
import "./Arcade.css";

const Arcade = () => {
  const [currentGame, setCurrentGame] = useState(null);

  const games = [
    {
      id: "snake",
      title: "Snake",
      description: "Classic snake game - eat food and grow longer!",
      component: SnakeGame,
      color: "#4CAF50",
      icon: "🐍",
    },
    // Future games can be added here
    {
      id: "coming-soon-1",
      title: "Tetris",
      description: "Coming Soon...",
      component: null,
      color: "#9C27B0",
      icon: "🧩",
    },
    {
      id: "coming-soon-2",
      title: "Pong",
      description: "Coming Soon...",
      component: null,
      color: "#FF5722",
      icon: "🏓",
    },
    {
      id: "coming-soon-3",
      title: "Pac-Man",
      description: "Coming Soon...",
      component: null,
      color: "#FFD700",
      icon: "👻",
    },
  ];

  const handleGameSelect = (gameId) => {
    const game = games.find((g) => g.id === gameId);
    if (game && game.component) {
      setCurrentGame(game);
    }
  };

  const handleBackToArcade = () => {
    setCurrentGame(null);
  };

  if (currentGame) {
    const GameComponent = currentGame.component;
    return (
      <div className="game-wrapper">
        <button className="back-button" onClick={handleBackToArcade}>
          ← Back to Arcade
        </button>
        <GameComponent />
      </div>
    );
  }

  return (
    <div className="arcade-container">
      <div className="arcade-header">
        <h1 className="arcade-title">Nate&apos;s Arcade</h1>
        <p className="arcade-subtitle">Choose your game and have fun!</p>
      </div>

      <div className="games-grid">
        {games.map((game) => (
          <div
            key={game.id}
            className={`game-tile ${!game.component ? "coming-soon" : ""}`}
            style={{ "--game-color": game.color }}
            onClick={() => handleGameSelect(game.id)}
          >
            <div className="game-icon">{game.icon}</div>
            <h3 className="game-title">{game.title}</h3>
            <p className="game-description">{game.description}</p>
            {!game.component && (
              <div className="coming-soon-badge">Coming Soon</div>
            )}
          </div>
        ))}
      </div>

      <div className="arcade-footer">
        <p>More games coming soon! 🎮</p>
      </div>
    </div>
  );
};

export default Arcade;
