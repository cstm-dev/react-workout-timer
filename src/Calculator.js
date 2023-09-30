import { memo, useEffect, useReducer } from "react";
import clickSound from "./ClickSound.m4a";

function calcDuration(number, sets, speed, durationBreak) {
  const calc = (number * sets * speed) / 60 + (sets - 1) * durationBreak;

  return calc;
}

function reducer(state, action) {
  switch (action.type) {
    case "initDuration": {
      return {
        ...state,
        duration: calcDuration(
          state.number,
          state.sets,
          state.speed,
          state.durationBreak
        ),
      };
    }
    case "changeNumber": {
      return {
        ...state,
        number: action.payload,
        duration: calcDuration(
          action.payload,
          state.sets,
          state.speed,
          state.durationBreak
        ),
      };
    }
    case "changeSets": {
      return {
        ...state,
        sets: action.payload,
        duration: calcDuration(
          state.number,
          action.payload,
          state.speed,
          state.durationBreak
        ),
      };
    }
    case "changeSpeed": {
      return {
        ...state,
        speed: action.payload,
        duration: calcDuration(
          state.number,
          state.sets,
          action.payload,
          state.durationBreak
        ),
      };
    }
    case "changeDurationBreak": {
      return {
        ...state,
        durationBreak: action.payload,
        duration: calcDuration(
          state.number,
          state.sets,
          state.speed,
          action.payload
        ),
      };
    }
    case "increaseDuration": {
      return { ...state, duration: Math.floor(state.duration) + 1 };
    }
    case "decreaseDuration": {
      return {
        ...state,
        duration: state.duration > 1 ? state.duration - 1 : 0,
      };
    }

    default:
      throw new Error("Unknown action type.");
  }
}

function Calculator({ workouts, allowSound }) {
  const [{ number, sets, speed, durationBreak, duration }, dispatch] =
    useReducer(reducer, {
      number: workouts.at(0).numExercises,
      sets: 3,
      speed: 90,
      durationBreak: 5,
      duration: 0,
    });

  const mins = Math.floor(duration);
  const seconds = (duration - mins) * 60;

  useEffect(() => {
    dispatch({ type: "initDuration" });
  }, []);

  useEffect(() => {
    const playSound = function () {
      if (!allowSound) return;
      const sound = new Audio(clickSound);
      sound.play();
    };

    playSound();
  }, [duration, allowSound]);

  return (
    <>
      <form>
        <div>
          <label>Type of workout</label>
          <select
            value={number}
            onChange={(e) => {
              dispatch({ type: "changeNumber", payload: e.target.value });
            }}
          >
            {workouts.map((workout) => (
              <option value={workout.numExercises} key={workout.name}>
                {workout.name} ({workout.numExercises} exercises)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>How many sets?</label>
          <input
            type="range"
            min="1"
            max="5"
            value={sets}
            onChange={(e) =>
              dispatch({ type: "changeSets", payload: e.target.value })
            }
          />
          <span>{sets}</span>
        </div>
        <div>
          <label>How fast are you?</label>
          <input
            type="range"
            min="30"
            max="180"
            step="30"
            value={speed}
            onChange={(e) =>
              dispatch({ type: "changeSpeed", payload: e.target.value })
            }
          />
          <span>{speed} sec/exercise</span>
        </div>
        <div>
          <label>Break length</label>
          <input
            type="range"
            min="1"
            max="10"
            value={durationBreak}
            onChange={(e) =>
              dispatch({ type: "changeDurationBreak", payload: e.target.value })
            }
          />
          <span>{durationBreak} minutes/break</span>
        </div>
      </form>
      <section>
        <button onClick={() => dispatch({ type: "decreaseDuration" })}>
          –
        </button>
        <p>
          {mins < 10 && "0"}
          {mins}:{seconds < 10 && "0"}
          {seconds}
        </p>
        <button onClick={() => dispatch({ type: "increaseDuration" })}>
          +
        </button>
      </section>
    </>
  );
}

export default memo(Calculator);
