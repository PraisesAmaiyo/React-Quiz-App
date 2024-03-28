import { useQuiz } from '../contexts/QuizContext';
import Options from './Options';

function Question() {
  const { filteredQuestions, index } = useQuiz();

  const question = filteredQuestions[index];

  return (
    <div className="question">
      <h4>{question.question}</h4>
      <Options />
    </div>
  );
}

export default Question;
