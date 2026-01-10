export default function Tile({ letter, tag, animate }) {
  const addAnimateClass = animate ? "animate" : "";

  return (
    <div className={`tile ${tag} ${addAnimateClass}`}>
      <p className="letter">{letter}</p>
    </div>
  );
}
