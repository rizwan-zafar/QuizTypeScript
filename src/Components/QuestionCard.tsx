import React from "react";
import { AnswerObject } from "../App";

type Props = {
   question: string;
  answers: string[];
  callback: any;
  userAnswer: AnswerObject | undefined;
  questionNr: number;
  totalQuestions: number;
};
const QuestionCard: React.FC<Props> = ({
   question,
  answers,
  callback,
  userAnswer,
  questionNr,
  totalQuestions,
}) => {
  return (
    <div className="questionCard">
      <p>
        Question: {questionNr} / {totalQuestions}
      </p>
      <p dangerouslySetInnerHTML={{ __html: question }} />
      <div>
        {answers.map((answer, id) => (
          <div key={id}>
            <button   
              className="answerButton"
              disabled={!!userAnswer}
              value={answer}
              onClick={callback}
            >
              <span dangerouslySetInnerHTML={{ __html: answer }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
