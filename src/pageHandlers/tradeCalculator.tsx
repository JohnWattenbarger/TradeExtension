import React from 'react';
// import ReactDOM from 'react-dom';
import ReactDOM from 'react-dom/client';
import TradeResults from './components/tradeResults';

// Your trade calculator component
const TradeCalculator = () => {
    const [results, setResults] = React.useState<string[]>([]);
    const [leagueInfo, setLeagueInfo] = React.useState<{ leagueId: string; site: string } | null>(null);

    React.useEffect(() => {
        // Listen for the message from the background script
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log('received message: ' + JSON.stringify(message));
            if (message.type === 'SET_LEAGUE_INFO') {
                // Update the state with the received data
                setLeagueInfo({ leagueId: message.leagueId, site: message.site });
            }
        });

        // Clean up the listener when the component unmounts
        return () => {
            chrome.runtime.onMessage.removeListener(() => { });
        };
    }, []);

    const suggestTrade = () => {
        // Logic to fetch or generate trade suggestions
        setResults(['Trade A', 'Trade B', 'Trade C']); // Example trade results
    };

    return (
        <div>
            <button disabled={!leagueInfo} onClick={suggestTrade}>Suggest Trade</button>

            {/* Conditionally render the TradeResults component if there are results */}
            {results.length > 0 && <TradeResults results={results} />}
            {leagueInfo && <div>
                {leagueInfo ? (
                    <div>
                        <h2>League Info</h2>
                        <p>League ID: {leagueInfo.leagueId}</p>
                        <p>Site: {leagueInfo.site}</p>
                    </div>
                ) : (
                    <p>Loading league info...</p>
                )}
            </div>}
        </div>
    );
};

export const run = () => {
    // Ensure that the target element exists
    const tradeContainer = document.querySelector('.trade-select-container');
    if (tradeContainer) {
        const newElement = document.createElement('div');
        tradeContainer.appendChild(newElement);
        const root = ReactDOM.createRoot(newElement);
        root.render(<TradeCalculator />);
    }
};
