import { useState, useEffect } from "react";

const generateWorld = () => {
  const board = [];
  for (let i = 0; i < 20; i++) {
    board.push(Array.from({ length: 20 }));
  }
  return board;
};

const putFoodInRandomCell = (setBoard) => {
  const row = Math.floor(Math.random() * 20);
  const column = Math.floor(Math.random() * 20);
  setBoard((prevBoard) => {
    prevBoard[row][column] = "o";
    return [...prevBoard];
  });
};

const snakeIsHere = (x, y, snake) => {
  return snake.some((snakePart) => {
    const xTrue = snakePart[0] == x;
    const yTrue = snakePart[1] == y;
    return xTrue && yTrue;
  });
};

const growSnake = (setSnake, direction) => {
  setSnake((prev) => {
    switch (direction) {
      case "down":
        console.log("down");
    }
  });
};

const drawCell = (x, y, snake, board, setSnake, direction) => {
  const snakeHere = snakeIsHere(x, y, snake);
  const foodIsHere = board[y][x] == "o";

  if (snakeHere && foodIsHere) {
    growSnake(setSnake, direction);
  }

  if (snakeHere) {
    return "s";
  } else if (foodIsHere) {
    return "0";
  } else {
    return "";
  }
};

const moveRight = (prevSnake) => {
  if (prevSnake[0][0] == 19) prevSnake[0][0] = 0;
  else prevSnake[0][0] = prevSnake[0][0] + 1;
};

const moveSnake = (direction, setSnake) => {
  setSnake((prevSnake) => {
    switch (direction) {
      case "right":
        if (prevSnake[0][0] == 19) prevSnake[0][0] = 0;
        else prevSnake[0][0] = prevSnake[0][0] + 1;
        break;
      case "down":
        if (prevSnake[0][1] == 20) prevSnake[0][1] = 0;
        else prevSnake[0][1] = prevSnake[0][1] + 1;
        break;
      case "up":
        if (prevSnake[0][1] == 0) prevSnake[0][1] = 19;
        prevSnake[0][1] = prevSnake[0][1] - 1;
        break;
      case "left":
        if (prevSnake[0][0] == 0) prevSnake[0][0] = 19;
        else prevSnake[0][0] = prevSnake[0][0] - 1;
    }
    return [...prevSnake];
  });
};

const App = () => {
  const [board, setBoard] = useState(generateWorld());
  const [snake, setSnake] = useState([[0, 0]]);
  const [direction, setDirection] = useState("right");

  useEffect(() => {
    putFoodInRandomCell(setBoard);

    window.addEventListener("keydown", (evt) => {
      const key = evt.key;

      switch (key) {
        case "ArrowDown":
          setDirection("down");
          break;
        case "ArrowRight":
          setDirection("right");
          break;
        case "ArrowLeft":
          setDirection("left");
          break;
        case "ArrowUp":
          setDirection("up");
      }
    });
  }, []);

  useEffect(() => {
    let intervalId;
    intervalId = setInterval(() => {
      moveSnake(direction, setSnake);
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [direction]);

  return (
    <div>
      <h1>Snake</h1>
      {board.map((row, y) => {
        return (
          <div
            key={y}
            style={{
              // border: "1px solid black",
              display: "flex",
              flexDirection: "row",
            }}
          >
            {row.map((column, x) => {
              return (
                <div
                  key={x}
                  style={{
                    border: "1px solid grey",
                    width: "20px",
                    height: "20px",
                    textAlign: "center",
                  }}
                >
                  {drawCell(x, y, snake, board, setSnake, direction)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default App;
