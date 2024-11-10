console.log('loading background.ts')

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
                    chrome.tabs.sendMessage(tabs[0].id, { leagueId, site });
                }
            });
        }
    },
    // { urls: ["https://api.fantasycalc.com/leagues/*"] }
    { urls: ['*://*/*'] }  // Match all URLs for debugging
);
