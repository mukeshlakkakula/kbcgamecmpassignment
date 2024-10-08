const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let currentQuestionIndex = 0;
const questions = [
  {
    question: "What is the capital of France?",
    options: ["A: Paris", "B: London", "C: Berlin", "D: Madrid"],
    correctAnswer: "A",
  },
  {
    question: "Who developed the theory of relativity?",
    options: ["A: Newton", "B: Einstein", "C: Galileo", "D: Tesla"],
    correctAnswer: "B",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["A: Mars", "B: Venus", "C: Jupiter", "D: Saturn"],
    correctAnswer: "A",
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["A: Atlantic", "B: Indian", "C: Arctic", "D: Pacific"],
    correctAnswer: "D",
  },
  {
    question: "Who wrote 'To Kill a Mockingbird'?",
    options: [
      "A: Harper Lee",
      "B: Mark Twain",
      "C: J.K. Rowling",
      "D: Ernest Hemingway",
    ],
    correctAnswer: "A",
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["A: Ag", "B: Au", "C: Pb", "D: Fe"],
    correctAnswer: "B",
  },
  {
    question: "Which country hosted the 2016 Summer Olympics?",
    options: ["A: China", "B: Brazil", "C: USA", "D: Japan"],
    correctAnswer: "B",
  },
  {
    question: "Who is the author of '1984'?",
    options: [
      "A: Aldous Huxley",
      "B: George Orwell",
      "C: Leo Tolstoy",
      "D: Fyodor Dostoevsky",
    ],
    correctAnswer: "B",
  },
  {
    question: "Which element has the atomic number 1?",
    options: ["A: Oxygen", "B: Hydrogen", "C: Helium", "D: Nitrogen"],
    correctAnswer: "B",
  },
  {
    question: "What is the tallest mountain in the world?",
    options: [
      "A: K2",
      "B: Mount Kilimanjaro",
      "C: Mount Everest",
      "D: Mount Fuji",
    ],
    correctAnswer: "C",
  },
];

io.on("connection", (socket) => {
  console.log("A player connected");

  socket.on("joinGame", (playerName) => {
    io.emit("newPlayer", playerName);

    if (currentQuestionIndex < questions.length) {
      socket.emit("question", questions[currentQuestionIndex]);
    } else {
      socket.emit("gameOver", "All questions completed. Thanks for playing!");
      currentQuestionIndex = 0;
    }
  });

  socket.on("submitAnswer", (data) => {
    const { playerName, answer } = data;
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;

    if (answer === correctAnswer) {
      io.emit("correctAnswer", playerName);
      currentQuestionIndex++;

      if (currentQuestionIndex < questions.length) {
        io.emit("question", questions[currentQuestionIndex]);
      } else {
        io.emit(
          "gameOver",
          `Congratulations! ${playerName} You've completed the game.`
        );
        currentQuestionIndex = 0;
      }
    } else {
      socket.emit("wrongAnswer");
    }
  });

  socket.on("disconnect", () => {
    console.log("A player disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${4000}`);
});
