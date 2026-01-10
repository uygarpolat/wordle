export default function Tile({ letter, tag }) {
  return (
    <div className={`tile ${tag}`}>
      <p className="letter">{letter}</p>
    </div>
  );
}
