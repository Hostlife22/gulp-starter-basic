import { artworks } from "../data/styles";
interface Props {
  hidden: boolean;
  activeIndex: number | null;
  onSelect: (time: number) => void;
}
export function ArtworkCatalogue({ hidden, activeIndex, onSelect }: Props) {
  return (
    <nav
      id="catalogue"
      className={hidden ? "catalogue visually-hidden" : "catalogue"}
      aria-label="Twenty artworks"
    >
      <details>
        <summary>
          Explore the twenty works <span>3000 BC — 2020s</span>
        </summary>
        <ol>
          {artworks.map((art, index) => (
            <li key={art.id}>
              <button
                aria-current={activeIndex === index ? "true" : undefined}
                onClick={() => onSelect(art.time)}
              >
                <span>{String(art.number).padStart(2, "0")}</span>
                <strong>{art.title}</strong>
                <em>{art.caption}</em>
              </button>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
