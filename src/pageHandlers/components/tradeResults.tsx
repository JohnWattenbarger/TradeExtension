import React from 'react';
import { StarterCount } from './starterForm';
import { Team } from '../../types/httpModels';
import { Trade } from '../../types/tradeModels';
import DetailedTradeResult from './detailedTradeResults';
import SimpleTradeResult from './simpleTradeResults';
// import { calculateStarterAndFlexValues } from '../utils/tradeUtils';

interface TradeResultProps {
    selectedTeam: Team;
    tradesMap: Map<Team, Trade[]>;
    topTradesCount: number;
    maxValueDiff?: number;
    onlyPositives?: boolean;
    simplifiedView?: boolean;
}

const TradeResult: React.FC<TradeResultProps> = (props: TradeResultProps) => {
    return (
        <>
            {props.simplifiedView ? <SimpleTradeResult {...props} /> : <DetailedTradeResult {...props} />}
        </>
    );
};

export default TradeResult;
