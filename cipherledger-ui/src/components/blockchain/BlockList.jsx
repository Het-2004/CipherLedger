import BlockCard from "./BlockCard";

export default function BlockList({ blocks, validatingIndex, tamperedIndex = -1 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blocks.map((b, index) => (
        <BlockCard
          key={b.hash || index}
          block={b}
          isValidating={validatingIndex === index}
          isTampered={tamperedIndex === index}
        />
      ))}
    </div>
  );
}

