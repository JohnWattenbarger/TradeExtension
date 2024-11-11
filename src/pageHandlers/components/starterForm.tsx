import React, { useState } from 'react';

interface StartersFormProps {
  onSubmit: (starters: StarterCount) => void;
}

export interface StarterCount {
  qb: number;
  rb: number;
  wr: number;
  te: number;
  flex: number;
}

const StartersForm: React.FC<StartersFormProps> = ({ onSubmit }) => {
  const [starters, setStarters] = useState<StarterCount>({
    qb: 1,
    rb: 2,
    wr: 2,
    te: 1,
    flex: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStarters({
      ...starters,
      [name]: parseInt(value, 10),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(starters); // Send the starters count back to the parent component
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>QB:</label>
        <input
          type="number"
          name="qb"
          value={starters.qb}
          onChange={handleChange}
          min="0"
        />
      </div>
      <div>
        <label>RB:</label>
        <input
          type="number"
          name="rb"
          value={starters.rb}
          onChange={handleChange}
          min="0"
        />
      </div>
      <div>
        <label>WR:</label>
        <input
          type="number"
          name="wr"
          value={starters.wr}
          onChange={handleChange}
          min="0"
        />
      </div>
      <div>
        <label>TE:</label>
        <input
          type="number"
          name="te"
          value={starters.te}
          onChange={handleChange}
          min="0"
        />
      </div>
      <div>
        <label>Flex (RB/WR/TE):</label>
        <input
          type="number"
          name="flex"
          value={starters.flex}
          onChange={handleChange}
          min="0"
        />
      </div>
      <button type="submit">Save Starters</button>
    </form>
  );
};

export default StartersForm;
