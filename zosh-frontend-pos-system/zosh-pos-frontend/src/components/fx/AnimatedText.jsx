// Word-by-word reveal text animation.
export function AnimatedText({ text = "", className = "", wordClassName = "", delay = 0, as: Tag = "span" }) {
  const words = String(text).split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom" aria-hidden="true">
          <span
            className={`inline-block animate-word ${wordClassName}`}
            style={{ animationDelay: `${delay + i * 70}ms` }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}

export default AnimatedText;
