export default function Modal({ isOver, targetWord}) {
  let modalContent = null;

  if (isOver !== "ongoing") {
    const history = JSON.parse(localStorage.getItem("history"));

    modalContent = (
      <div className="modal">
        <p>
          you {isOver}! the word was {isOver === "won" ? "indeed " : ""}
          <strong>{targetWord}</strong>
        </p>
        <p>
          your score so far: {history[0].won} / {history[0].played} streak:{" "}
          {history[0].streak} longest streak: {history[0].longestStreak}
        </p>
        <button
          className="play-again-button"
          onClick={() => window.location.reload()}
        >
          Play again
        </button>
      </div>
    );
  }

  return modalContent;
}
