import React, { useState, Suspense } from "react";
import LazyLoader from "./Components/LazyLoader";
import { fetchQuizQuestions, Difficulty, QuestionState } from "./Services";
const QuestionCard = React.lazy(() => import("./Components/QuestionCard"));

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};
const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameover, setGameOver] = useState(true);
  const [answerColor, setAnswerColor] = useState<string>("");
  const TOTAL_QUESTION = 10;


  /**
   * *resolve get question promise
   */
  const startTrivia = async () => {
    try {
      setLoading(true);
      setGameOver(false);
      const newQuestions = await fetchQuizQuestions(
        TOTAL_QUESTION,
        Difficulty.EASY
      );
       setQuestions(newQuestions);
       
      setScore(0);
      setUserAnswers([]);
      setLoading(false);
    } catch (e) {
      console.log("Error " + e);
    }
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameover) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;
      if (correct){
         setScore((prev) => prev + 1); 
         setAnswerColor("green")
        }else{
          setAnswerColor("red")
        } 
      
      // save answer in the array
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    // move to next question if not a last question
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTION) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
    setAnswerColor("")
   };

  return (
    <>
      <div className="app">
        <h1>Mythology Quiz</h1>
        <div className="start-wrapper">
          {gameover || userAnswers.length === TOTAL_QUESTION ? (
            <button className="start" onClick={startTrivia}>
              Start
            </button>
          ) : null}
        </div>
 
        {loading ? (
          <LazyLoader />
        ) : !gameover ? (
          <p className="score" style={{color:answerColor}}>Score : {score * 10}</p>
        ) : null}

        {!loading && !gameover ? (
          <Suspense
            fallback={
              <>
                <LazyLoader />
              </>
            }
          >
            <QuestionCard
              
              questionNr={number + 1}
              totalQuestions={TOTAL_QUESTION}
              question={questions[number].question}
              answers={questions[number].answers}
              userAnswer={userAnswers ? userAnswers[number] : undefined}
              callback={checkAnswer}
             
            /> 
          </Suspense>
        ) : null}

        <div className="next-wrapper">
          {!gameover &&
          !loading &&
          userAnswers.length === number + 1 &&
          number !== TOTAL_QUESTION - 1 ? (
            <button className="next" onClick={nextQuestion}>
              Next Question
            </button>
          ) : null}
        </div>
        { score>70 && number==TOTAL_QUESTION-1 ?   (
           <h3>Your Score {score *10}%, Congratulation You have Passed</h3>
        ):null}
       { score>0&& score<70 && number==TOTAL_QUESTION-1  ?(
           <h3>Your Score {score *10}%, Try Again Later</h3>
        ):null}
      </div>
    </>
  );
};

export default App;
