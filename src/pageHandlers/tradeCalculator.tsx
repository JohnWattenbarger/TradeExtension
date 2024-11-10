import React from 'react';
// import ReactDOM from 'react-dom';
import ReactDOM from 'react-dom/client';
import TradeResults from './components/tradeResults';
import { MessageTypes } from '../types/types';
import { League } from '../types/models';

// TODO: better share this between background and tradeCalculator
interface LeagueInfoMessage {
    type: MessageTypes;
    leagueId: string;
    site: string;
    data: League;
}

// Your trade calculator component
const TradeCalculator = () => {
    console.log('New TradeCalculator')
    const [results, setResults] = React.useState<string[]>([]);
    const [leagueInfo, setLeagueInfo] = React.useState<{ leagueId: string; site: string, data: League } | null>(null);

    React.useEffect(() => {
        const handleMessage = (message: LeagueInfoMessage, sender: any, sendResponse: any) => {
            console.log('received message: ' + JSON.stringify(message));
            if (message.type === MessageTypes.LEAGUE_DETAILS) {
                // Update the state with the received data
                setLeagueInfo({ leagueId: message.leagueId, site: message.site, data: message.data });
            }
        };

        // Listen for the message from the background script
        chrome.runtime.onMessage.addListener(handleMessage);

        // Clean up the listener when the component unmounts
        return () => {
            console.log('removing listener');
            chrome.runtime.onMessage.removeListener(handleMessage);
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
                        <p>Data: {`League: ${leagueInfo.data.name}.  Teams: ${JSON.stringify(leagueInfo.data.teams.map(t => t.name))}`}</p>
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
