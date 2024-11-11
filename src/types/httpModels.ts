export interface Player {
    player: {
        id: number;
        name: string;
        mflId: string;
        sleeperId: string;
        position: string;
        maybeBirthday: string;
        maybeHeight: string;
        maybeWeight: number;
        maybeCollege: string;
        maybeTeam: string;
        maybeAge: number;
        maybeYoe: number;
        espnId: string;
        fleaflickerId: string;
    }
    value: number;
    overallRank: number;
    positionRank: number;
    trend30Day: number;
    redraftDynastyValueDifference: number;
    redraftDynastyValuePercDifference: number;
    redraftValue: number;
    combinedValue: number;
    maybeMovingStandardDeviation: number;
    maybeMovingStandardDeviationPerc: number;
    maybeMovingStandardDeviationAdjusted: number;
    displayTrend: boolean;
    maybeOwner: string | null;
    starter: boolean;
    maybeTier: number;
    maybeAdp: number | null;
    maybeTradeFrequency: number;
}

export interface Team {
    name: string;
    owner: string;
    players: Player[];
    overallValue: number;
    overallRank: number;
    qbValue: number;
    qbRank: number;
    rbValue: number;
    rbRank: number;
    wrValue: number;
    wrRank: number;
    teValue: number;
    teRank: number;
    pickValue: number;
    pickRank: number;
    averageAge: number;
    adjustedAverageAge: number;
    trend30Day: number;
    rosterId: number;
    record: {
        wins: number;
        losses: number;
        ties: number;
        pointsScored: number;
        ppgRank: number;
        maxPointsForRank: number;
    };
    ownerId: string;
    starters: any | null;
}

export interface League {
    id: {
        value: string;
    };
    externalLeagueId: string;
    name: string;
    teams: Team[];
}
