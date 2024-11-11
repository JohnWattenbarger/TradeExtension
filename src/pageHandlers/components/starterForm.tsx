import React, { useState } from 'react';

type StartersFormProps = {
  starterCount: StarterCount;
  setStarterCount: React.Dispatch<React.SetStateAction<StarterCount>>;
};

export interface StarterCount {
  qb: number;
  rb: number;
  wr: number;
  te: number;
  flex: number;
}

const StartersForm: React.FC<StartersFormProps> = React.memo(({ starterCount, setStarterCount }) => {
  return (
    <div>
      <div>
        <label>QB:</label>
        <input
          type="number"
          value={starterCount.qb}
          onChange={(e) => {
            const newCount = parseInt(e.target.value);
            setStarterCount({ ...starterCount, qb: newCount })
          }}
        />
      </div>
      <div>
        <label>RB:</label>
        <input
          type="number"
          value={starterCount.rb}
          onChange={(e) => {
            const newCount = parseInt(e.target.value);
            setStarterCount({ ...starterCount, rb: newCount })
          }}
        />
      </div>
      <div>
        <label>WR:</label>
        <input
          type="number"
          value={starterCount.wr}
          onChange={(e) => {
            const newCount = parseInt(e.target.value);
            setStarterCount({ ...starterCount, wr: newCount })
          }}
        />
      </div>
      <div>
        <label>TE:</label>
        <input
          type="number"
          value={starterCount.te}
          onChange={(e) => {
            const newCount = parseInt(e.target.value);
            setStarterCount({ ...starterCount, te: newCount })
          }}
        />
      </div>
      <div>
        <label>Flex (RB/WR/TE):</label>
        <input
          type="number"
          value={starterCount.flex}
          onChange={(e) => {
            const newCount = parseInt(e.target.value);
            setStarterCount({ ...starterCount, flex: newCount })
          }}
        />
      </div>
    </div>
  );
});

export default StartersForm;
