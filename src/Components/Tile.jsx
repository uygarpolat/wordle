export default function Tile({ letter, tag, animate, language }) {
  const addAnimateClass = animate ? "animate" : "";

  return (
    <div className={`tile ${tag} ${addAnimateClass}`}>
      <p className="letter">{letter ? letter.toLocaleUpperCase(language) : ""}</p>
    </div>
  );
}
