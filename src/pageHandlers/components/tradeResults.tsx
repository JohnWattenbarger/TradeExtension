import React from 'react';

interface TradeResultsProps {
    results: string[];
}

const TradeResults: React.FC<TradeResultsProps> = ({ results }) => {
    return (
        <div className="trade-results">
            <h3>Suggested Trades</h3>
            <ul>
                {results.map((result, index) => (
                    <li key={index}>{result}</li>
                ))}
            </ul>
        </div>
    );
};

export default TradeResults;
