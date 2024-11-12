import React from 'react';
// import ReactDOM from 'react-dom';
import ReactDOM from 'react-dom/client';
import TradeResults from './components/tradeResults';
import { MessageTypes } from '../types/types';
import { League, Player, Team } from '../types/httpModels';
import StartersForm, { StarterCount } from './components/starterForm';
import { findAllTrades } from './utils/tradeUtils';
import { Trade } from '../types/tradeModels';

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
    const [results, setResults] = React.useState<Map<Team, Trade[]>>();
    const [leagueInfo, setLeagueInfo] = React.useState<{ leagueId: string; site: string } | null>(null);
    const [league, setLeague] = React.useState<League>();
    const [starterCounts, setStarterCounts] = React.useState<StarterCount>({ qb: 1, rb: 2, wr: 2, te: 1, flex: 1 });
    const [selectedTeamId, setSelectedTeamId] = React.useState('');
    const [maxValueDiff, setMaxValueDiff] = React.useState<number>(1000);

    // const isLoading = !league;

    React.useEffect(() => {
        console.log('first render');

        // TODO: see why this is getting triggered continuously
        const handleMessage = (message: LeagueInfoMessage, sender: any, sendResponse: any) => {
            if (message.type === MessageTypes.LEAGUE_DETAILS && !(leagueInfo && league)) {
                console.log('received message: ' + JSON.stringify(message));
                // Update the state with the received data
                setLeagueInfo({ leagueId: message.leagueId, site: message.site });
                setLeague(message.data);

                // Send a response back to indicate successful handling
                sendResponse({ success: true });
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
        if (!league) throw `Unable to suggest trades. No team is selected.`;
        // Logic to fetch or generate trade suggestions
        // setResults(['Trade A', 'Trade B', 'Trade C']); // Example trade results
        const selectedTeam = getSelectedTeam();
        const allPossibleTrades = findAllTrades(league, selectedTeam, starterCounts);

        // setResults(['Team: ' + selectedTeamId + ' selected'])
        setResults(allPossibleTrades);
    };

    const getSelectedTeam = () => {
        // const selectedTeam = league?.teams.find(team => team.ownerId === selectedTeamId);
        const selectedTeam = league?.teams.find(team => team.owner === selectedTeamId);
        if (!selectedTeam) {
            throw new Error("Unable to suggest trades. Error getting selected team details.");
        }

        return selectedTeam;
    }

    function calculateStarterAndFlexValues(team: Team) {
        const players = team.players;
        // Sort players by value in descending order
        const sortedPlayers = [...players].sort((a, b) => b.redraftValue - a.redraftValue);

        // Track how many starters we've assigned by position
        const positionCount: { [position: string]: number } = { QB: 0, RB: 0, WR: 0, TE: 0 };
        const starters: Player[] = [];
        const backups: Player[] = [];

        // Separate starters from backups
        for (const player of sortedPlayers) {
            if (positionCount[player.player.position] < getStarterCount(player.player.position)) {
                starters.push(player);
                positionCount[player.player.position] += 1;
            } else {
                backups.push(player);  // Any player exceeding starter counts is a backup
            }
        }

        // Select the top `numFlex` backups for the flex positions
        const flexPlayers = backups.slice(0, starterCounts.flex);

        // Calculate total starter and flex values
        const starterValue = starters.reduce((total, player) => total + player.redraftValue, 0);
        const flexValue = flexPlayers.reduce((total, player) => total + player.redraftValue, 0);

        return starterValue + flexValue;
    }

    const getStarterCount = (position: string) => {
        switch (position?.toLowerCase()) {
            case 'qb': return starterCounts.qb;
            case 'rb': return starterCounts.rb;
            case 'wr': return starterCounts.wr;
            case 'te': return starterCounts.te;
        }

        return 0;
    }

    const renderExtraTeamDetails = () => {
        // return {(league && starterCounts) &&
        //     {league.teams.map(team => (
        //     <div key={team.owner}>
        //         <h3>{team.name}</h3>
        //         <p>Starter Points: {calculateStarterAndFlexValues(team)}</p>
        //         {/* Render other team and player info here */}
        //     </div>
        // ))}
        //     }

        return <div></div>
    }

    return (
        <div>
            <button disabled={!leagueInfo} onClick={suggestTrade}>Suggest Trade</button>

            {(leagueInfo && league) && <div>
                {(leagueInfo && league) ? (
                    <div>
                        <h2>League Info</h2>
                        <p>League ID: {leagueInfo.leagueId}</p>
                        <p>Site: {leagueInfo.site}</p>
                        <p>Data: {`League: ${league.name}.  Teams: ${JSON.stringify(league.teams.map(t => t.name))}`}</p>
                    </div>
                ) : (
                    <p>Loading league info...</p>
                )}
            </div>}
            {(league && starterCounts) && <div>
                <h1>Trade Calculator</h1>
                <StartersForm starterCount={starterCounts} setStarterCount={setStarterCounts} />

                <div>
                    <label>Max Allowed Player Value Difference:</label>
                    <input
                        type="number"
                        value={maxValueDiff}
                        onChange={(e) => {
                            const newValue = parseInt(e.target.value);
                            setMaxValueDiff(newValue)
                        }}
                    />
                </div>

                {renderExtraTeamDetails()}

                <label htmlFor="team-select">Select a team:</label>
                <select
                    id="team-select"
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                >
                    <option value="" disabled>Select a team</option>
                    {league.teams.map((team) => {
                        console.log('Rendering team: ' + team.name + ' - ' + team.owner);
                        return <option key={team.owner} value={team.owner}>
                            {`${team.name} - @${team.owner}`}
                        </option>
                    })}
                </select>

                <button onClick={suggestTrade} disabled={!selectedTeamId}>
                    Find Trades
                </button>
            </div>}

            {/* Conditionally render the TradeResults component if there are results */}
            {results && <TradeResults selectedTeam={getSelectedTeam()} starterCounts={starterCounts} topTradesCount={5} tradesMap={results} maxValueDiff={maxValueDiff} onlyPositives={true} />}
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
