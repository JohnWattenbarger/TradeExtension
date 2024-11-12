import { League, Player, Team } from "../../types/httpModels";
import { Trade } from "../../types/tradeModels";
import { StarterCount } from "../components/starterForm";

export const findAllTrades = (league: League, selectedTeam: Team, starterCounts: StarterCount) => {
    console.log('Finding all trades for ' + selectedTeam.name);
    /** Map team IDs to the value of all starters */
    let initialStarterValueMap: Map<string, number> = new Map<string, number>();
    let tradesMap: Map<Team, Trade[]> = new Map<Team, Trade[]>();

    league.teams.forEach(team => {
        const initialStarterValue = calculateStarterAndFlexValues(team.players, starterCounts);
        // Note: We don't actually have a unique team ID, so I am using ownerID. If an owner could have 2 teams we could change this to use ownerId-Team.name
        initialStarterValueMap.set(team.ownerId, initialStarterValue);
    })

    league.teams.forEach(otherTeam => {
        if (otherTeam != selectedTeam) {
            console.log('- Finding trades for ' + otherTeam.name)
            let trades: Trade[] = [];

            selectedTeam.players.forEach(player => {
                if (!player.player.name.includes('Round')) { // Exclude draft picks that the site added
                    otherTeam.players.forEach(otherPlayer => {
                        if (!otherPlayer.player.name.includes('Round')) { // Exclude draft picks that the site added
                            // add other player and remove player from selectedTeam
                            let selectedTeamCopy = [...selectedTeam.players];
                            selectedTeamCopy = selectedTeamCopy.filter(p => p.player.id !== player.player.id);
                            selectedTeamCopy.push(otherPlayer);

                            // add player and remove other player from otherTeam
                            let otherTeamCopy = [...otherTeam.players];
                            otherTeamCopy = otherTeamCopy.filter(p => p.player.id !== otherPlayer.player.id);
                            otherTeamCopy.push(player);

                            // calculate new team values
                            const fromNewTeamValue = calculateStarterAndFlexValues(selectedTeamCopy, starterCounts);
                            const toNewTeamValue = calculateStarterAndFlexValues(otherTeamCopy, starterCounts);

                            const initialFromValue = initialStarterValueMap.get(selectedTeam.ownerId)!;
                            const initialToValue = initialStarterValueMap.get(otherTeam.ownerId)!;

                            const starterToGain = toNewTeamValue - initialToValue;
                            const starterFromGain = fromNewTeamValue - initialFromValue;

                            const trade: Trade = {
                                TeamFrom: { team: selectedTeam, players: [player] },
                                TeamTo: { team: otherTeam, players: [otherPlayer] },
                                tradeValue: {
                                    // From Team
                                    teamFromBefore: initialFromValue,
                                    teamFromValue: fromNewTeamValue,
                                    starterFromGain, // from team value gained
                                    // To Team
                                    teamToBefore: initialToValue,
                                    teamToValue: toNewTeamValue,
                                    starterToGain, // to team value gained

                                    combinedUpgradeGained: (starterFromGain + starterToGain),
                                    netValueDifference: otherPlayer.redraftValue - player.redraftValue
                                }
                            }

                            trades.push(trade);
                        }
                    });
                }
            });

            // sort trades to have the highest combined gains first
            trades.sort((a, b) => {
                // Compare the upgrade differences (descending order)
                return (b.tradeValue.combinedUpgradeGained - a.tradeValue.combinedUpgradeGained);
            });

            tradesMap.set(otherTeam, trades);
        }
    });

    return tradesMap;
}


export function calculateStarterAndFlexValues(players: Player[], starterCounts: StarterCount) {
    // const players = team.players;

    // Sort players by value in descending order
    const sortedPlayers = [...players].sort((a, b) => b.redraftValue - a.redraftValue);

    // Track how many starters we've assigned by position
    const flexPositions = ["RB", "WR", "TE"];
    const positionCount: { [position: string]: number } = { QB: 0, RB: 0, WR: 0, TE: 0 };
    const starters: Player[] = [];
    const backups: Player[] = [];

    // Separate starters from backups
    for (const player of sortedPlayers) {
        if (positionCount[player.player.position] < getStarterCount(player.player.position, starterCounts)) {
            starters.push(player);
            positionCount[player.player.position] += 1;
        } else {
            backups.push(player);  // Any player exceeding starter counts is a backup
        }
    }

    // Select the top `numFlex` backups for the flex positions
    const flexPlayers = backups.filter(player => flexPositions.includes(player.player.position)).slice(0, starterCounts.flex);

    // Calculate total starter and flex values
    const starterValue = starters.reduce((total, player) => total + player.redraftValue, 0);
    const flexValue = flexPlayers.reduce((total, player) => total + player.redraftValue, 0);

    return starterValue + flexValue;
}

const getStarterCount = (position: string, starterCounts: StarterCount) => {
    switch (position?.toLowerCase()) {
        case 'qb': return starterCounts.qb;
        case 'rb': return starterCounts.rb;
        case 'wr': return starterCounts.wr;
        case 'te': return starterCounts.te;
    }

    return 0;
}

export const getSortedAndFilteredTrades = (trades: Trade[], maxValueDiff: number | undefined, onlyPositives: boolean | undefined, topTradesCount: number) => {
    // Sort trades by net value difference (highest first)
    let sortedTrades = trades.sort((a, b) => b.tradeValue.combinedUpgradeGained - a.tradeValue.combinedUpgradeGained);
    sortedTrades = getTradesWithinMaxDiff(sortedTrades, maxValueDiff);
    sortedTrades = getPositiveTrades(sortedTrades, onlyPositives);

    // Return the full list if fewer than the desired top trades are available
    const topTrades = sortedTrades.length < topTradesCount
        ? sortedTrades
        : sortedTrades.slice(0, topTradesCount);

    return topTrades;
}

const getTradesWithinMaxDiff = (sortedTrades: Trade[], maxValueDiff?: number) => {
    // Apply max value difference filter if specified
    if (maxValueDiff) {
        sortedTrades = sortedTrades.filter(
            trade => Math.abs(trade.tradeValue.netValueDifference) <= maxValueDiff
        );
    }

    return sortedTrades;
}

const getPositiveTrades = (sortedTrades: Trade[], onlyPositives?: boolean) => {
    // filter out negative returns for one team if specified
    if (onlyPositives) {
        // TODO: see if this is working? Looks like a negative starterTo slipped through
        sortedTrades = sortedTrades.filter(
            trade => { return (trade.tradeValue.starterFromGain > 0 && trade.tradeValue.starterToGain > 0) }
        );
    }

    return sortedTrades;
}

export const getBestTrades = (trades: Trade[], maxValueDiff: number | undefined, onlyPositives: boolean | undefined, topTradesCount: number) => {
    // Sort trades by net value difference (highest first)
    let sortedTrades = trades.sort((a, b) => b.tradeValue.starterFromGain - a.tradeValue.starterFromGain);
    sortedTrades = getTradesWithinMaxDiff(sortedTrades, maxValueDiff);
    sortedTrades = getPositiveTrades(sortedTrades, onlyPositives);

    // Return the full list if fewer than the desired top trades are available
    const topTrades = sortedTrades.length < topTradesCount
        ? sortedTrades
        : sortedTrades.slice(0, topTradesCount);

    return topTrades;
}
