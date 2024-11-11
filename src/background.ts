import { League } from "./types/httpModels";
import { LeagueDetailsMessage, MessageTypes } from "./types/types";

console.log('loading background.ts')

let pendingRequests: LeagueDetailsMessage[] = [];
let headersMap: Map<string, chrome.webRequest.HttpHeader[] | undefined> = new Map<string, chrome.webRequest.HttpHeader[] | undefined>();

// Listen to capture headers
chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        // Save headers of the request if it's a target API call
        if (details.url.includes("fantasycalc.com")) {
            // requestHeaders = details.requestHeaders || [];
            headersMap.set(details.url, details.requestHeaders);
        }
        return { requestHeaders: details.requestHeaders };
    },
    { urls: ["*://*.fantasycalc.com/*"] },
    ["requestHeaders"]
);

chrome.webRequest.onCompleted.addListener(
    (details) => {
        console.log(' url ==> ' + details.url)
        const url = new URL(details.url);

        // Ensure it's the API endpoint we're interested in
        if (url.hostname === 'api.fantasycalc.com' && url.pathname.startsWith('/leagues/')) {
            console.log('listening to URL: ' + url.hostname)
            const leagueId = url.pathname.split('/')[2];
            const site = url.searchParams.get('site');

            console.log(`League ID: ${leagueId}, Site: ${site}`);

            // Now, you can send this info to your content script or popup using messaging
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0] && tabs[0].id) {
                    const message: LeagueDetailsMessage = { url: details.url, leagueId, site };
                    // chrome.tabs.sendMessage(tabs[0].id, message);
                    sendMessage(tabs[0].id, message)
                } else {
                    pendingRequests.push({ url: details.url, leagueId, site });
                }
            });
            // pendingRequests.push({ leagueId, site });
        }
    },
    { urls: ["https://*.fantasycalc.com/leagues/*"] }
    // { urls: ['*://*/*'] }  // Match all URLs for debugging
);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log('tab changed to: ' + tabId)
    if (changeInfo.status === 'complete' && tab.active) {
        // Send all pending requests to the content script
        while (pendingRequests.length > 0) {
            const request = pendingRequests.shift();
            if (request) {
                // chrome.tabs.sendMessage(tabId, request);
                sendMessage(tabId, request)
            }
        }
    }
});

const sendMessage = (tabId: number, message: LeagueDetailsMessage) => {
    console.log('sending message...')

    // const headers = headersMap.get(url);
    const headers = new Headers();
    headersMap.get(message.url)?.forEach(header => {
        headers.append(header.name, header.value || '');
    })

    // Fetch the data with the original headers
    fetch(message.url, { method: 'GET', headers })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data: League) => {
            console.log('Received response, fully sending message now.');
            chrome.tabs.sendMessage(tabId, { ...message, data, type: MessageTypes.LEAGUE_DETAILS });
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
};
