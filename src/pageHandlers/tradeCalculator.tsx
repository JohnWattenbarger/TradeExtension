import React from 'react';
// import ReactDOM from 'react-dom';
import ReactDOM from 'react-dom/client';
import TradeResults from './components/tradeResults';

// Your trade calculator component
const TradeCalculator = () => {
    const [results, setResults] = React.useState<string[]>([]);

    const suggestTrade = () => {
        // Logic to fetch or generate trade suggestions
        setResults(['Trade A', 'Trade B', 'Trade C']); // Example trade results
    };

    return (
        <div>
            <button onClick={suggestTrade}>Suggest Trade</button>

            {/* Conditionally render the TradeResults component if there are results */}
            {results.length > 0 && <TradeResults results={results} />}
        </div>
    );
};

export const run = () => {
    // Ensure that the target element exists
    const tradeContainer = document.querySelector('.trade-select-container');
    if (tradeContainer) {
        // Render the React component into the trade container
        // const root = ReactDOM.createRoot(tradeContainer);
        // root.render(<TradeCalculator />);

        // Create a new div to hold the React component
        const newElement = document.createElement('div');

        // Append the new div to the trade container as a child
        tradeContainer.appendChild(newElement);

        // Render the React component into the new div
        const root = ReactDOM.createRoot(newElement);
        root.render(<TradeCalculator />);
    }
};
