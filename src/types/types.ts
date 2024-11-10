export enum MessageTypes {
    LEAGUE_DETAILS
}

export interface LeagueDetailsMessage {
    url: string,
    leagueId: string,
    site: string | null
}