
import React from 'react';

type AnimalCardProps = {
  animal: string;
  emoji: string;
  onClick: () => void;
};

const AnimalCard: React.FC<AnimalCardProps> = ({ animal, emoji, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="animal-button"
    >
      <span className="text-3xl mb-1">{emoji}</span>
      <span>{animal}</span>
    </button>
  );
};

export default AnimalCard;
