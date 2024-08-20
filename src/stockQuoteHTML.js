// stockQuoteHTML.js
const stockQuoteHTML = (marketStatus, companyName, stockSymbol, currentPrice, priceChangeClass, priceChangeSvg, priceChangeText) => `
<div class="quote-header">
    <div class="quote-info-left d-flex align-items-start align-items-md-center">
        <div class="pe-2 pe-md-3 text-nowrap mb-2 mb-md-0">
            <span class="d-flex align-items-center">
                <span class="quote-market-status me-1">
                    <span class="market-open">${marketStatus}</span>
                </span>
                <span class="fs-18px text-black">${companyName}</span>
            </span> 
            <span class="fs-20px fw-medium text-black mb-1 mb-md-0">${stockSymbol}</span>
        </div> 
        <div class="quote-info-left-values d-flex text-black fs-36px fw-medium me-2">
            <div class="value d-flex align-items-center">
                <span>${currentPrice}</span>
            </div> 
            <div class="d-flex align-items-center align-self-end">
                <span class="ms-1 fs-18px quote-diff-status ${priceChangeClass}">
                    ${priceChangeSvg}
                    ${priceChangeText}
                </span>
            </div>
        </div>
    </div>
</div>
`;

module.exports = stockQuoteHTML;
