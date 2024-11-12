import React from 'react';
import { Team } from '../../types/httpModels';
import { Trade } from '../../types/tradeModels';
import { getBestTrades, getSortedAndFilteredTrades } from '../utils/tradeUtils';

interface TradeResultProps {
    selectedTeam: Team;
    tradesMap: Map<Team, Trade[]>;
    topTradesCount: number;
    maxValueDiff?: number;
    onlyPositives?: boolean;
}

const DetailedTradeResult: React.FC<TradeResultProps> = ({ selectedTeam, tradesMap, topTradesCount, maxValueDiff, onlyPositives }) => {
    const renderTeamResult = (otherTeam: Team, trades: Trade[]) => {
        console.log(' filter out <0 = ' + onlyPositives)
        if (otherTeam !== selectedTeam) {
            const filteredTrades = getSortedAndFilteredTrades(trades, maxValueDiff, onlyPositives, topTradesCount);

            return (
                <div key={otherTeam.ownerId}>
                    <h3>Trades with {otherTeam.name}:</h3>
                    <div className="team-trades-container">
                        {filteredTrades.map((trade, index) => (
                            <div key={index} className="trade-details">
                                <h4>Trade {index + 1}:</h4>
                                <div className="trade-info">
                                    {/* Trade Details for selectedTeam -> otherTeam */}
                                    <div className="trade-team-info">
                                        <span>
                                            <strong>{selectedTeam.name} gives:</strong>
                                            {trade.TeamFrom.players.map(player => (
                                                <div key={player.player.id}>
                                                    {player.player.name} | Player Value: {player.redraftValue}
                                                </div>
                                            ))}
                                        </span>
                                        {/* Additional Information */}
                                        <div>
                                            <span><strong>Team Value Before Trade:</strong> {trade.tradeValue.teamFromBefore}</span>
                                        </div>
                                        <div>
                                            <span><strong>Team Value After Trade:</strong> {trade.tradeValue.teamFromValue}</span>
                                        </div>
                                        <div>
                                            <span><strong>Team Improvement:</strong> {trade.tradeValue.starterFromGain}</span>
                                        </div>
                                        <div>
                                            <span><strong>Player Value Gained:</strong> {trade.tradeValue.netValueDifference}</span>
                                        </div>
                                    </div>
                                    <div className="trade-team-info">
                                        <span>
                                            <strong>{otherTeam.name} gives:</strong>
                                            {trade.TeamTo.players.map(player => (
                                                <div key={player.player.id}>
                                                    {player.player.name} | Player Value: {player.redraftValue}
                                                </div>
                                            ))}
                                        </span>
                                        {/* Additional Information */}
                                        <div>
                                            <span><strong>Team Value Before Trade (to):</strong> {trade.tradeValue.teamToBefore}</span>
                                        </div>
                                        <div>
                                            <span><strong>Team Value After Trade (to):</strong> {trade.tradeValue.teamToValue}</span>
                                        </div>
                                        <div>
                                            <span><strong>Team Improvement (to):</strong> {trade.tradeValue.starterToGain}</span>
                                        </div>
                                        <div>
                                            <span><strong>Player Value Gained (to):</strong> {(0 - trade.tradeValue.netValueDifference)}</span>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        ))}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    const renderBestTrades = () => {
        // Collect all trades into a single array
        const allTrades: Trade[] = Array.from(tradesMap.values()).flat();
        const bestTrades = getBestTrades(allTrades, maxValueDiff, onlyPositives, topTradesCount);

        return (
            <div>
                <h3>Top Trades:</h3>
                <div className="team-trades-container">
                    {bestTrades.map((trade, index) => (
                        <div key={index} className="trade-details">
                            <h4>Trade {index + 1}:</h4>
                            <div className="trade-info">
                                {/* Trade Details for selectedTeam -> otherTeam */}
                                <div className="trade-team-info">
                                    <span>
                                        <strong>{selectedTeam.name} gives:</strong>
                                        {trade.TeamFrom.players.map(player => (
                                            <div key={player.player.id}>
                                                {player.player.name} | Player Value: {player.redraftValue}
                                            </div>
                                        ))}
                                    </span>
                                    {/* Additional Information */}
                                    <div>
                                        <span><strong>Team Value Before Trade:</strong> {trade.tradeValue.teamFromBefore}</span>
                                    </div>
                                    <div>
                                        <span><strong>Team Value After Trade:</strong> {trade.tradeValue.teamFromValue}</span>
                                    </div>
                                    <div>
                                        <span><strong>Team Improvement:</strong> {trade.tradeValue.starterFromGain}</span>
                                    </div>
                                    <div>
                                        <span><strong>Player Value Gained:</strong> {trade.tradeValue.netValueDifference}</span>
                                    </div>
                                </div>
                                <div className="trade-team-info">
                                    <span>
                                        <strong>{trade.TeamTo.team.name} gives:</strong>
                                        {trade.TeamTo.players.map(player => (
                                            <div key={player.player.id}>
                                                {player.player.name} | Player Value: {player.redraftValue}
                                            </div>
                                        ))}
                                    </span>
                                    {/* Additional Information */}
                                    <div>
                                        <span><strong>Team Value Before Trade (to):</strong> {trade.tradeValue.teamToBefore}</span>
                                    </div>
                                    <div>
                                        <span><strong>Team Value After Trade (to):</strong> {trade.tradeValue.teamToValue}</span>
                                    </div>
                                    <div>
                                        <span><strong>Team Improvement (to):</strong> {trade.tradeValue.starterToGain}</span>
                                    </div>
                                    <div>
                                        <span><strong>Player Value Gained (to):</strong> {(0 - trade.tradeValue.netValueDifference)}</span>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2>Suggested Trades for {selectedTeam.name}</h2>
            <hr />
            {renderBestTrades()}
            {Array.from(tradesMap.entries()).map(([otherTeam, trades]) => {
                return renderTeamResult(otherTeam, trades);
            })}
        </div>
    );
};

export default DetailedTradeResult;
