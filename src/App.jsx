import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CheckCircle, XCircle, ChevronRight, RefreshCw, Sun, Moon } from 'lucide-react';

// --- QUIZ DATA: 14 Unique Questions on South Africa and Nigeria ---
const BASE_QUIZ_DATA = [
  // Nigerian Questions (NG)
  { question: "What is the capital city of Nigeria?", options: ["Lagos", "Abuja", "Ibadan", "Kano"], correctAnswer: "Abuja", country: "NG" },
  { question: "Nigeria gained independence in which year?", options: ["1960", "1950", "1970", "1980"], correctAnswer: "1960", country: "NG" },
  { question: "Which river is the most important river in Nigeria?", options: ["Benue River", "Cross River", "Niger River", "Imo River"], correctAnswer: "Niger River", country: "NG" },
  { question: "Which Nigerian city is known as the 'Centre of Excellence'?", options: ["Port Harcourt", "Abuja", "Lagos", "Calabar"], correctAnswer: "Lagos", country: "NG" },
  { question: "Who was the first President of Nigeria?", options: ["Nnamdi Azikiwe", "Abubakar Tafawa Balewa", "Olusegun Obasanjo", "Shehu Shagari"], correctAnswer: "Nnamdi Azikiwe", country: "NG" },
  { question: "What is the largest ethnic group in Nigeria?", options: ["Yoruba", "Igbo", "Hausa/Fulani", "Tiv"], correctAnswer: "Hausa/Fulani", country: "NG" },
  { question: "The currency of Nigeria is the...", options: ["Cedi", "Naira", "Rand", "Shilling"], correctAnswer: "Naira", country: "NG" },
  // South African Questions (SA)
  { question: "What are the three capital cities of South Africa?", options: ["Cape Town, Durban, Joburg", "Pretoria, Bloemfontein, Cape Town", "Pretoria, Johannesburg, Durban", "Bloemfontein, Cape Town, PE"], correctAnswer: "Pretoria, Bloemfontein, Cape Town", country: "SA" },
  { question: "Who was the first democratically elected President of South Africa?", options: ["Thabo Mbeki", "Nelson Mandela", "F.W. de Klerk", "Cyril Ramaphosa"], correctAnswer: "Nelson Mandela", country: "SA" },
  { question: "South Africa is known for producing what precious metal?", options: ["Silver", "Platinum", "Copper", "Iron"], correctAnswer: "Platinum", country: "SA" },
  { question: "What is the highest mountain peak in South Africa?", options: ["Table Mountain", "Cathedral Peak", "Mafadi", "Sani Pass"], correctAnswer: "Mafadi", country: "SA" },
  { question: "Which SA province is home to Kruger National Park?", options: ["Gauteng", "Western Cape", "Limpopo", "Mpumalanga"], correctAnswer: "Mpumalanga", country: "SA" },
  { question: "What is the name of the currency used in South Africa?", options: ["Kwacha", "Pula", "Rand", "Shilling"], correctAnswer: "Rand", country: "SA" },
  { question: "In which year did South Africa host the FIFA World Cup?", options: ["2010", "2006", "2014", "2002"], correctAnswer: "2010", country: "SA" },
];

// Use only the base data to avoid repetition
const QUIZ_DATA = BASE_QUIZ_DATA.map((q, index) => {
  const topic = q.country === "NG" ? "Nigeria" : "South Africa";
  // Add question number and topic prefix
  return {
    ...q,
    question: `[${topic} Q${index + 1}] ${q.question}`
  };
});

const TOTAL_QUESTIONS = QUIZ_DATA.length;
// --- END QUIZ DATA ---


// Function to get system theme preference
const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

const App = () => {
  // State for quiz progression
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(new Array(TOTAL_QUESTIONS).fill(null));
  const [quizStarted, setQuizStarted] = useState(false);
  // isFinished is true when the quiz is done (results view or review)
  const [isFinished, setIsFinished] = useState(false);

  // State for dark theme
  const [isDarkTheme, setIsDarkTheme] = useState(getSystemTheme());

  // Effect to apply/remove the 'dark' class on the HTML element for Tailwind
  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.classList.toggle('dark', isDarkTheme);
  }, [isDarkTheme]);

  // Handler to toggle the theme
  const toggleTheme = useCallback(() => {
    setIsDarkTheme(prev => !prev);
  }, []);

  // Handler to start the quiz
  const startQuiz = useCallback(() => {
    setQuizStarted(true);
  }, []);

  // Handler for selecting an answer
  const handleAnswerSelect = useCallback((answer) => {
    if (isFinished) return;

    // 1. Record the answer
    setUserAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIndex] = answer;
      return newAnswers;
    });

    // 2. Move to the next question after a brief delay (for visual feedback)
    setTimeout(() => {
      if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      } else {
        // 3. End the quiz
        setIsFinished(true);
        setCurrentQuestionIndex(TOTAL_QUESTIONS); // Indicate we are on the results page state
      }
    }, 150); // Short delay for better UX
  }, [currentQuestionIndex, isFinished, TOTAL_QUESTIONS]);

  // Handler to restart the quiz (resets all state to initial)
  const restartQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(TOTAL_QUESTIONS).fill(null));
    setIsFinished(false);
    setQuizStarted(false);
  }, [TOTAL_QUESTIONS]);

  // Calculate the score when the quiz finishes or if needed for review
  const score = useMemo(() => {
    if (!isFinished && quizStarted) return null;

    return userAnswers.reduce((total, answer, index) => {
      const isCorrect = answer === QUIZ_DATA[index].correctAnswer;
      return total + (isCorrect ? 1 : 0);
    }, 0);
  }, [userAnswers, isFinished, quizStarted]);

  // --- Render Components ---

  // 1. Theme Toggle Button
  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition duration-300
                 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100
                 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-teal-500/50"
      aria-label="Toggle Dark Mode"
    >
      {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );


  // 2. Start Screen
  const StartScreen = () => (
    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transition duration-500">
      <h1 className="text-4xl font-extrabold mb-4 text-teal-600 dark:text-teal-400">
        Africa Knowledge Challenge
      </h1>
      <p className="text-xl mb-6 text-gray-700 dark:text-gray-300">
        Test your knowledge of South Africa and Nigeria with these {TOTAL_QUESTIONS} unique questions!
      </p>
      <p className="text-lg font-semibold mb-8 text-gray-600 dark:text-gray-400">
        Total Questions: {TOTAL_QUESTIONS}
      </p>
      <button
        onClick={startQuiz}
        className="px-8 py-3 bg-teal-600 text-white font-bold text-lg rounded-lg shadow-lg
                   hover:bg-teal-700 transition duration-300 transform hover:scale-105"
      >
        Start Quiz
      </button>
    </div>
  );

  // 3. Question Screen
  const QuestionScreen = () => {
    const questionData = QUIZ_DATA[currentQuestionIndex];
    const selectedAnswer = userAnswers[currentQuestionIndex];
    const progress = Math.round(((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100);

    return (
      <div className="w-full max-w-2xl">
        {/* Progress Bar and Counter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1 text-gray-700 dark:text-gray-300 font-medium">
            <span>Question {currentQuestionIndex + 1} of {TOTAL_QUESTIONS}</span>
            <span>{progress}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-teal-500 h-2.5 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transition duration-500 mb-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
            {questionData.question}
          </h2>

          <div className="space-y-4">
            {questionData.options.map((option, index) => {
              const isSelected = selectedAnswer === option;

              // Base button styles
              let buttonClasses = `w-full text-left p-4 rounded-lg border-2 font-medium transition duration-300 ease-in-out `;

              // Apply styles based on selection state
              if (isSelected) {
                // Currently selected style
                buttonClasses += `border-teal-500 bg-teal-50 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 ring-2 ring-teal-500`;
              } else {
                // Unselected style
                buttonClasses += `border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700`;
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={buttonClasses}
                  disabled={!!selectedAnswer} // Disable interaction after selection
                >
                  <span className="flex items-center">
                    <span className="mr-3 w-6 h-6 flex items-center justify-center rounded-full bg-teal-100 dark:bg-teal-700/80 text-teal-700 dark:text-teal-100 text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation and Cancel Button */}
        <div className="flex justify-between mt-6">
          {/* New Cancel/Restart Button */}
          <button
            onClick={restartQuiz}
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md
                           hover:bg-red-700 transition duration-300 flex items-center"
          >
            <XCircle className="mr-2" size={20} />
            Cancel Quiz
          </button>

          {/* Next/Finish button for navigation (only visible after selection) */}
          {selectedAnswer && (
            <button
              onClick={() => {
                if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
                  setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                } else {
                  setIsFinished(true);
                  setCurrentQuestionIndex(TOTAL_QUESTIONS); // Move to results state
                }
              }}
              className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md
                           hover:bg-green-700 transition duration-300 flex items-center"
            >
              {currentQuestionIndex < TOTAL_QUESTIONS - 1 ? 'Next Question' : 'View Results'}
              <ChevronRight className="ml-2" size={20} />
            </button>
          )}
        </div>
      </div>
    );
  };

  // 4. Results Screen
  const ResultsScreen = () => {
    const percentage = ((score / TOTAL_QUESTIONS) * 100).toFixed(1);
    const passed = score >= TOTAL_QUESTIONS / 2; // Simple pass/fail at 50%

    return (
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transition duration-500 w-full max-w-xl">
        {passed ? (
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
        ) : (
          <XCircle className="mx-auto text-red-500 mb-4" size={64} />
        )}

        <h1 className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-gray-100">
          Quiz Complete!
        </h1>
        <p className="text-xl mb-6 text-gray-700 dark:text-gray-300">
          Your final score is:
        </p>

        <div className={`p-4 rounded-xl inline-block shadow-inner mb-8 ${passed ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'}`}>
          <span className="text-5xl font-black">{score}</span>
          <span className="text-2xl font-bold"> / {TOTAL_QUESTIONS}</span>
        </div>

        <p className="text-2xl font-bold mb-8 text-teal-600 dark:text-teal-400">
          {percentage}% Accuracy
        </p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={restartQuiz}
            className="px-8 py-3 bg-teal-600 text-white font-bold text-lg rounded-lg shadow-lg
                         hover:bg-teal-700 transition duration-300 transform hover:scale-[1.02] flex items-center justify-center"
          >
            <RefreshCw className="mr-3" size={20} />
            Start New Quiz
          </button>
          <button
            // Set currentQuestionIndex back to 0 to start review, but keep isFinished true
            onClick={() => { setCurrentQuestionIndex(0); }}
            className="px-8 py-3 bg-gray-200 text-gray-800 font-bold text-lg rounded-lg shadow-md
                         hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition duration-300"
          >
            Review Answers
          </button>
        </div>
      </div>
    );
  };

  // 5. Review Screen (re-uses Question Screen logic for review)
  const ReviewScreen = () => {
    const questionData = QUIZ_DATA[currentQuestionIndex];
    const userAnswer = userAnswers[currentQuestionIndex];

    return (
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-gray-100 text-center">
          Reviewing Answers
        </h1>

        {/* Review Progress */}
        <div className="mb-6 text-center text-lg font-medium text-gray-700 dark:text-gray-300">
          Question {currentQuestionIndex + 1} of {TOTAL_QUESTIONS}
        </div>

        {/* Question Card (Review Mode) */}
        <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transition duration-500 mb-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
            {questionData.question}
          </h2>

          <div className="space-y-4">
            {questionData.options.map((option, index) => {
              const isCorrect = option === questionData.correctAnswer;
              const isUserAnswer = option === userAnswer;

              let buttonClasses = `w-full text-left p-4 rounded-lg border-2 font-medium transition duration-300 flex items-center `;

              if (isCorrect) {
                // Correct Answer: Green border and background
                buttonClasses += `border-green-500 bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-300`;
              } else if (isUserAnswer) {
                // Incorrect User Answer: Red border and background
                buttonClasses += `border-red-500 bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-300`;
              } else {
                // Other options: neutral
                buttonClasses += `border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 opacity-60`;
              }

              return (
                <div key={index} className={buttonClasses}>
                  <span className="mr-3 w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold">
                    {isCorrect && <CheckCircle size={20} className="text-green-600 dark:text-green-400" />}
                    {!isCorrect && isUserAnswer && <XCircle size={20} className="text-red-600 dark:text-red-400" />}
                    {!isCorrect && !isUserAnswer && String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </div>
              );
            })}
          </div>

          <div className={`mt-6 p-3 rounded-lg font-bold text-lg ${userAnswer === questionData.correctAnswer
            ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
            : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'
            }`}>
            {userAnswer === questionData.correctAnswer ? "You answered correctly!" : `Your answer was incorrect. The correct answer was: ${questionData.correctAnswer}`}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 space-x-4">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded-lg shadow-md disabled:opacity-50
                               dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition duration-300"
          >
            &larr; Previous
          </button>
          <button
            onClick={() => { setIsFinished(true); setCurrentQuestionIndex(TOTAL_QUESTIONS); }}
            className="px-4 py-2 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition duration-300"
          >
            Back to Results
          </button>
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.min(TOTAL_QUESTIONS - 1, prev + 1))}
            disabled={currentQuestionIndex === TOTAL_QUESTIONS - 1}
            className="px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded-lg shadow-md disabled:opacity-50
                               dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition duration-300"
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }

  // --- Main Render Logic ---
  let content;
  if (!quizStarted) {
    content = <StartScreen />;
  } else if (isFinished && currentQuestionIndex === TOTAL_QUESTIONS) {
    // Quiz finished, show results
    content = <ResultsScreen />;
  } else if (isFinished && currentQuestionIndex < TOTAL_QUESTIONS) {
    // Quiz finished, currently reviewing answers
    content = <ReviewScreen />;
  }
  else {
    // Quiz in progress
    content = <QuestionScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4 transition duration-500 font-inter">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      {content}
    </div>
  );
};

export default App;
