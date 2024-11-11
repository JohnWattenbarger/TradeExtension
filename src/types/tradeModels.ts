import { Player, Team } from "./httpModels";

export interface Trade {
    TeamFrom: { team: Team, players: Player[] };
    TeamTo: { team: Team, players: Player[] };
    tradeValue: {
        teamFromBefore: number,
        teamToBefore: number,
        teamFromValue: number, // updated from team value after trade
        teamToValue: number, // updated to team value after trade
        starterToGain: number, // the difference betwen to new - original
        starterFromGain: number,
        combinedUpgradeGained: number, // The amount that team A and team B both improved (or got worse)
        netValueDifference: number, // The difference in value between what team A gives up and team B gives up
    }
}