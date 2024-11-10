console.log("Trade Extension script loaded");

import * as tradeCalculator from './pageHandlers/tradeCalculator';

// Check the current URL and run specific page logic or render React components
function loadPageScript() {
    console.log('loading scripts...')
    const currentUrl = window.location.href;

    if (currentUrl.includes('/trade-calculator')) {
        tradeCalculator.run(); // Run the logic specific to the trade-calculator page
    }
    // You can add other conditions here for other pages
}

// Load the appropriate script when the page loads
loadPageScript();
