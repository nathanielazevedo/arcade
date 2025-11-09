import { useState, useEffect } from "react";
import "./SnakeGame.css";

const generateWorld = () => {
  const board = [];
  for (let i = 0; i < 20; i++) {
    board.push(Array.from({ length: 20 }));
  }
  return board;
};

const putFoodInRandomCell = (setBoard) => {
  const newBoard = generateWorld();
  const row = Math.floor(Math.random() * 20);
  const column = Math.floor(Math.random() * 20);
  setBoard(() => {
    newBoard[row][column] = "o";
    return [...newBoard];
  });
};

const snakeIsHere = (x, y, snake) => {
  return snake.some((snakePart) => {
    const xTrue = snakePart[0] == x;
    const yTrue = snakePart[1] == y;
    return xTrue && yTrue;
  });
};

const drawCell = (x, y, snake, board) => {
  const snakeHere = snakeIsHere(x, y, snake);
  const foodIsHere = board[y][x] == "o";
  const isHead = snake.length > 0 && snake[0][0] === x && snake[0][1] === y;

  if (snakeHere) {
    return (
      <div className={`snake-segment ${isHead ? "snake-head" : ""}`}></div>
    );
  } else if (foodIsHere) {
    return <div className="food"></div>;
  } else {
    return null;
  }
};

const checkCollision = (oldSnake, newHead) => {
  return oldSnake.some((point) => {
    return point[0] == newHead[0] && point[1] == newHead[1];
  });
};

const moveSnake = (
  direction,
  setSnake,
  board,
  putFood,
  setCollsion,
  setScore
) => {
  let popNeeded = true;
  let collision = false;
  setSnake((prevSnake) => {
    const newHead = [...prevSnake[0]];

    if (board[newHead[1]][newHead[0]] == "o") {
      popNeeded = false;
      setScore((prev) => prev + 10);
    }
    switch (direction) {
      case "right":
        if (newHead[0] == 19) {
          newHead[0] = 0;
          collision = checkCollision(prevSnake, newHead);
          prevSnake = [newHead, ...prevSnake];
        } else {
          newHead[0] = newHead[0] + 1;
          collision = checkCollision(prevSnake, newHead);
          prevSnake = [newHead, ...prevSnake];
        }
        break;
      case "down":
        if (newHead[1] == 19) {
          newHead[1] = 0;
          collision = checkCollision(prevSnake, newHead);
          prevSnake = [newHead, ...prevSnake];
        } else {
          newHead[1] = newHead[1] + 1;
          collision = checkCollision(prevSnake, newHead);
          prevSnake = [newHead, ...prevSnake];
        }
        break;
      case "up":
        if (newHead[1] == 0) {
          newHead[1] = 19;
          collision = checkCollision(prevSnake, newHead);
          prevSnake = [newHead, ...prevSnake];
        } else {
          newHead[1] = newHead[1] - 1;
          collision = checkCollision(prevSnake, newHead);
          prevSnake = [newHead, ...prevSnake];
        }
        break;
      case "left":
        if (newHead[0] == 0) {
          newHead[0] = 19;
          collision = checkCollision(prevSnake, newHead);
          prevSnake = [newHead, ...prevSnake];
        } else {
          newHead[0] = newHead[0] - 1;
          collision = checkCollision(prevSnake, newHead);
          prevSnake = [newHead, ...prevSnake];
        }
    }
    if (popNeeded) {
      prevSnake.pop();
    } else {
      putFood();
    }

    if (collision) {
      setCollsion(true);
    }
    return [...prevSnake];
  });

  return popNeeded;
};

const SnakeGame = () => {
  const [board, setBoard] = useState(generateWorld());
  const [collision, setCollision] = useState(false);
  const [snake, setSnake] = useState([
    [1, 0],
    [0, 0],
  ]);
  const [direction, setDirection] = useState("right");
  const [score, setScore] = useState(0);

  useEffect(() => {
    putFoodInRandomCell(setBoard);

    const handleKeydown = (evt) => {
      const key = evt.key;

      // Prevent changing direction to opposite direction
      setDirection((currentDirection) => {
        switch (key) {
          case "ArrowDown":
            return currentDirection !== "up" ? "down" : currentDirection;
          case "ArrowRight":
            return currentDirection !== "left" ? "right" : currentDirection;
          case "ArrowLeft":
            return currentDirection !== "right" ? "left" : currentDirection;
          case "ArrowUp":
            return currentDirection !== "down" ? "up" : currentDirection;
          default:
            return currentDirection;
        }
      });
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  useEffect(() => {
    if (collision) return;
    let intervalId;
    intervalId = setInterval(() => {
      moveSnake(
        direction,
        setSnake,
        board,
        () => putFoodInRandomCell(setBoard),
        setCollision,
        setScore
      );
    }, 200);

    return () => {
      clearInterval(intervalId);
    };
  }, [direction, board, collision]);

  const restartGame = () => {
    setBoard(generateWorld());
    setCollision(false);
    setSnake([
      [1, 0],
      [0, 0],
    ]);
    setDirection("right");
    setScore(0);
    putFoodInRandomCell(setBoard);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">Snake</h1>
        <div className="game-score">Score: {score}</div>
      </div>

      <div className="game-board">
        {board.map((row, y) => {
          return (
            <div key={y} className="game-row">
              {row.map((column, x) => {
                return (
                  <div key={x} className="game-cell">
                    {drawCell(x, y, snake, board)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="controls">
        Use arrow keys to control the snake. Eat the red food to grow and
        increase your score!
      </div>

      {collision && (
        <div className="game-over-overlay">
          <div className="game-over-text">Game Over!</div>
          <div className="game-score">Final Score: {score}</div>
          <button className="restart-button" onClick={restartGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
