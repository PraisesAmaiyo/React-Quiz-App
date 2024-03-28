import Options from './Options';

function Question({ question, dispatch, answer, status }) {
  return (
    <div className="question">
      <h4>{question.question}</h4>
      <Options
        question={question}
        dispatch={dispatch}
        answer={answer}
        status={status}
      />
    </div>
  );
}

export default Question;
