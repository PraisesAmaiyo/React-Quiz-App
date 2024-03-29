import { useQuiz } from '../contexts/QuizContext';

function PrevButton() {
  const { dispatch, index = null } = useQuiz();

  if (index === 0) return <span></span>;

  return (
    <button className="btn " onClick={() => dispatch({ type: 'prevQuestion' })}>
      Previous
    </button>
  );
}

export default PrevButton;
