import { shareOnMobile } from "react-mobile-share";

const Share = ({ children, tileTags }) => {
  const rows = [];
  const url = "https://wordle-ten-sable.vercel.app/";

  rows.push("Wordle:\n");

  for (const row of tileTags) {
    const rowText = row
      .map((t) => {
        if (t === "green") return "🟩";
        if (t === "yellow") return "🟨";
        return "⬛";
      })
      .join("");
    rows.push(rowText);
    if (row.every((t) => t === "green")) break;
  }
  let text = rows.join("\n");
  text += `\n\n${url}`;
  console.log(text);

  return (
    <div>
      <button
        className="play-again-button"
        onClick={() =>
          shareOnMobile({
            text: text,
            title: "Wordle",
          })
        }
      >
        {children}
      </button>
    </div>
  );
};

export default Share;
