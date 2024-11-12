import React from 'react';
import { StarterCount } from './starterForm';
import { Team } from '../../types/httpModels';
import { Trade } from '../../types/tradeModels';
import { calculateStarterAndFlexValues } from '../utils/tradeUtils';

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
            // Sort trades by net value difference (highest first)
            let sortedTrades = trades.sort((a, b) => b.tradeValue.combinedUpgradeGained - a.tradeValue.combinedUpgradeGained);

            // Get top 'n' trades
            // Apply max value difference filter if specified
            if (maxValueDiff) {
                sortedTrades = sortedTrades.filter(
                    trade => Math.abs(trade.tradeValue.netValueDifference) <= maxValueDiff
                );
            }
            // filter out negative returns for one team if specified
            if (onlyPositives) {
                // TODO: see if this is working? Looks like a negative starterTo slipped through
                sortedTrades = sortedTrades.filter(
                    trade => { return (trade.tradeValue.starterFromGain > 0 && trade.tradeValue.starterToGain > 0) }
                );
            }
            // Return the full list if fewer than the desired top trades are available
            const topTrades = sortedTrades.length < topTradesCount
                ? sortedTrades
                : sortedTrades.slice(0, topTradesCount);

            // const topTrades = sortedTrades.slice(0, topTradesCount);

            return (
                <div key={otherTeam.ownerId}>
                    <h3>Trades with {otherTeam.name}:</h3>
                    <div className="team-trades-container">
                        {topTrades.map((trade, index) => (
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

    return (
        <div>
            <h2>Suggested Trades for {selectedTeam.name}</h2>
            <hr />
            {Array.from(tradesMap.entries()).map(([otherTeam, trades]) => {
                return renderTeamResult(otherTeam, trades);
            })}
        </div>
    );
};

export default DetailedTradeResult;
