function StartScreen({ numQuestions, dispatch, difficulty, highscore }) {
  return (
    <div className="start">
      <span className="highscore--start">Highscore: {highscore}</span>

      <h2>Welcome to The React Quiz</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>

      <div className="difficulty">
        <p>Choose your difficulty level :</p>
        <select
          value={difficulty}
          onChange={(e) =>
            dispatch({ type: 'setDifficulty', payload: e.target.value })
          }
        >
          <option value="all">All</option>
          <option value={10}>Easy</option>
          <option value={20}>Medium</option>
          <option value={30}>Hard</option>
        </select>
      </div>

      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'start' })}
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
