import { useQuiz } from '../contexts/QuizContext';

function Options() {
  const { dispatch, answer, status, filteredQuestions, index } = useQuiz();
  const question = filteredQuestions[index];

  const hasAnswered = answer !== null || status === 'verify';

  return (
    <div>
      <div className="option">
        {question.options.map((option, index) => (
          <button
            className={`btn btn-option ${index === answer ? 'answer' : ''} ${
              hasAnswered
                ? index === question.correctOption
                  ? 'correct'
                  : 'wrong'
                : ''
            }`}
            key={option}
            disabled={hasAnswered}
            onClick={() => dispatch({ type: 'newAnswer', payload: index })}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Options;
