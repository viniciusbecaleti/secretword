// Packets
import { useCallback, useEffect, useState } from "react";

// Components
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

// Data
import { wordsList } from "./data/words";

// CSS
import "./App.css";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPicketCategory] = useState("");
  const [letters, setLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  // check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      // reset all states
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // pick a random word
    const word =
      wordsList[category][
        Math.floor(Math.random() * wordsList[category].length)
      ];

    return { word, category };
  }, [words]);

  // starts the secret word game
  const startGame = useCallback(() => {
    //clear all letters
    clearLetterStates();

    // pick word and pick category
    const { word, category } = pickWordAndCategory();
    // create an array of letters
    let letters = word.split("");
    letters = letters.map((letter) => letter.toLowerCase());

    // fill states
    setPickedWord(word);
    setPicketCategory(category);
    setLetters(letters);
    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // check if letter has already been utilized
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((prevGuessedLetters) => [
        ...prevGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((prevWrongLetter) => [
        ...prevWrongLetter,
        normalizedLetter,
      ]);

      setGuesses((prevGuesses) => prevGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  // restarts the game
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[1].name);
  };

  // check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    // wind condition
    if (
      guessedLetters.length !== 0 &&
      guessedLetters.length === uniqueLetters.length
    ) {
      // add score
      setScore((prevScore) => prevScore + 100);

      // restart game with new word
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
