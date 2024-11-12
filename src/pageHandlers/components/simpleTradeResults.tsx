import React from 'react';
import { StarterCount } from './starterForm';
import { Team } from '../../types/httpModels';
import { Trade } from '../../types/tradeModels';
import { calculateStarterAndFlexValues, getSortedTopTrades } from '../utils/tradeUtils';

interface TradeResultProps {
    selectedTeam: Team;
    tradesMap: Map<Team, Trade[]>;
    topTradesCount: number;
    maxValueDiff?: number;
    onlyPositives?: boolean;
}

const SimpleTradeResult: React.FC<TradeResultProps> = ({ selectedTeam, tradesMap, topTradesCount, maxValueDiff, onlyPositives }) => {
    const renderTeamResult = (otherTeam: Team, trades: Trade[]) => {
        console.log(' filter out <0 = ' + onlyPositives)
        if (otherTeam !== selectedTeam) {
            const topTrades = getSortedTopTrades(trades, maxValueDiff, onlyPositives, topTradesCount);

            return (
                <div key={otherTeam.ownerId}>
                    <span>{`${otherTeam.name} - ${otherTeam.owner}`}:</span>
                    <div className="team-trades-container">
                        {topTrades.map((trade, index) => (
                            <div key={index} className="trade-details">
                                <div className="trade-info">
                                    {/* Trade Details for selectedTeam -> otherTeam */}
                                    <div className="trade-team-info">
                                        {/* Show trade player like this: ` > Josh Allen - Garrett Wilson ==> +2976 / +2053, difference: +764` */}
                                        <span>
                                            <span>{' > '}</span>
                                            {trade.TeamFrom.players.map(player => (
                                                <span key={player.player.id}>
                                                    {player.player.name}
                                                </span>
                                            ))}
                                            <span>{' - '}</span>
                                            {trade.TeamTo.players.map(player => (
                                                <span key={player.player.id}>
                                                    {player.player.name}
                                                </span>
                                            ))}
                                            <span>{' ==> '}</span>
                                            <span>{(trade.tradeValue.starterFromGain > 0 ? '+' : '')}{trade.tradeValue.starterFromGain}</span>
                                            <span>{' / '}</span>
                                            <span>{(trade.tradeValue.starterToGain > 0 ? '+' : '')}{trade.tradeValue.starterToGain}</span>
                                            <span>{', difference: '}</span>
                                            <span>{(trade.tradeValue.netValueDifference > 0 ? '+' : '')}{trade.tradeValue.netValueDifference}</span>
                                        </span>
                                    </div>
                                </div>
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
            <h3>Suggested Trades for {selectedTeam.name}</h3>
            <hr />
            {Array.from(tradesMap.entries()).map(([otherTeam, trades]) => {
                return renderTeamResult(otherTeam, trades);
            })}
        </div>
    );
};

export default SimpleTradeResult;
