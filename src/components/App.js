import Header from './Header';
import { useEffect, useReducer } from 'react';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';
import Footer from './Footer';
import Timer from './Timer';
import PrevButton from './PrevButton';

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  filteredQuestions: [],

  // 'loading', 'error', 'ready', 'active', 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  answers: [],
  points: 0,
  highscore: JSON.parse(localStorage.getItem('highscore')) ?? 0,
  secondsRemaining: null,
  difficulty: 'all',
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
        filteredQuestions: action.payload,
      };
    case 'dataFailed':
      return {
        ...state,
        status: 'error',
      };

    case 'start':
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.filteredQuestions.length * SECS_PER_QUESTION,
      };
    case 'newAnswer':
      const question = state.filteredQuestions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        answers: [...state.answers, action.payload],
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case 'prevQuestion':
      const index = state.index - 1 >= 0 ? state.index - 1 : state.index;

      return {
        ...state,
        index,
        answer: state.answers.at(index) ? state.answers.at(index) : null,
      };
    case 'nextQuestion':
      const iterator =
        state.index + 1 < state.filteredQuestions.length
          ? state.index + 1
          : state.index;

      return {
        ...state,
        index: iterator,
        answer: state.answers.at(iterator) ? state.answers.at(iterator) : null,
      };

    case 'finish':
      const highscore =
        state.points >= state.highscore ? state.points : state.highscore;

      localStorage.setItem('highscore', JSON.stringify(highscore));
      return {
        ...state,
        index: 0,
        status: 'finished',
        highscore,
      };

    case 'restart':
      return {
        ...initialState,
        status: 'ready',
        questions: state.questions,
        filteredQuestions: state.filteredQuestions,
        difficulty: state.difficulty,
        highscore: state.highscore,
      };

    // return {
    //   ...state,
    //   status: 'ready',
    //   index: 0,
    //   answer: null,
    //   points: 0,
    // };

    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
      };

    case 'reviewAnswers':
      return { ...state, answer: state.answers[state.index], status: 'verify' };

    case 'setDifficulty':
      const newFilteredQuestions =
        action.payload === 'all'
          ? state.questions
          : state.questions.filter(
              (question) => question.points === parseInt(action.payload, 10)
            );

      return {
        ...state,
        difficulty: action.payload,
        filteredQuestions: newFilteredQuestions,
      };

    default:
      throw new Error('Action Unknown');
  }
}

export default function App() {
  const [
    {
      questions,
      filteredQuestions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      difficulty,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = filteredQuestions.length;

  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    fetch(
      'https://my-json-server.typicode.com/praisesamaiyo/react-quiz-app/questions/'
    )
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: 'dataReceived', payload: data });
      })
      .catch((err) => dispatch({ type: 'dataFailed' }));
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen
            numQuestions={numQuestions}
            dispatch={dispatch}
            difficulty={difficulty}
            highscore={highscore}
          />
        )}
        {(status === 'active' || status === 'verify') && (
          <>
            <Progress
              index={index}
              numQuestions={filteredQuestions.length}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={filteredQuestions.at(index)}
              dispatch={dispatch}
              answer={answer}
              status={status}
            />

            <Footer>
              {status !== 'verify' && (
                <Timer
                  dispatch={dispatch}
                  secondsRemaining={secondsRemaining}
                />
              )}
              {status === 'verify' && (
                <PrevButton
                  dispatch={dispatch}
                  answer={answer}
                  index={index}
                  numQuestions={numQuestions}
                />
              )}

              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={filteredQuestions.length}
                status={status}
              />
            </Footer>
          </>
        )}
        {status === 'finished' && (
          <FinishScreen
            dispatch={dispatch}
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
          />
        )}
      </Main>
    </div>
  );
}
