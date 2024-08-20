const stockQuoteHTML = `
<div class="quote-header">
    <div class="cover-quote-center d-block d-md-none">
        <img alt="cover-quote-center" src="/images/cover-page/stock/cover-quote-center.png" class="background-image">
    </div> 
    <div class="cover-quote-left d-none d-md-block">
        <img alt="cover-quote-left" src="/images/cover-page/stock/cover-quote-left.png" class="background-image">
    </div> 
    <div class="cover-quote-right d-none d-md-block">
        <img alt="cover-quote-right" src="/images/cover-page/stock/cover-quote-right.png" class="background-image">
    </div> 
    <div class="quote-breadcrumb position-relative">
        <div class="site-container">
            <nav aria-label="breadcrumb" class="text-white">
                <ol class="breadcrumb flex-nowrap">
                    <li class="breadcrumb-item start">
                        <a href="/en/home"><span class="d-inline-block">Home</span></a>
                    </li>
                    <li class="breadcrumb-item">
                        <a href="https://www.set.or.th/en/market"><span class="d-inline-block">Market</span></a>
                    </li>
                    <li class="breadcrumb-item">
                        <a href="https://www.set.or.th/en/market/product/stock/overview"><span class="d-inline-block">Product</span></a>
                    </li>
                    <li class="breadcrumb-item">
                        <a href="https://www.set.or.th/en/market/product/stock/overview"><span class="d-inline-block">Stock</span></a>
                    </li>
                    <li class="breadcrumb-item">
                        <a href="https://www.set.or.th/en/market/product/stock/search"><span class="d-inline-block">Stock Quote</span></a>
                    </li>
                    <li class="breadcrumb-item beforeend">
                        <a href="/en/market/product/stock/quote/bdms/price"><span class="d-inline-block"><span class="d-none d-sm-inline-block">BDMS</span> <span class="d-inline-block d-sm-none">...</span></span></a>
                    </li>
                    <li class="breadcrumb-item active text-truncate" aria-current="page">
                        Price
                    </li>
                </ol>
            </nav>
        </div>
    </div> 
    <div class="site-container title-font-family position-relative">
        <div class="d-flex d-md-none mb-0 mb-md-2 align-self-center justify-content-end">
            <div id="quote-search-input" class="quote-input-search position-relative me-2">
                <div class="d-flex h-100">
                    <div class="input-group justify-content-end">
                        <input id="inputSuggest" type="text" placeholder="Get Quote" class="input-suggest-search"> 
                        <div class="search-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search text-white">
                                <circle cx="11" cy="11" r="8"></circle> 
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div> 
                        <div role="button" class="close-icon-suggestion" style="display:none;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x text-black">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                    </div>
                </div>
            </div> 
            <button type="button" class="btn btn-favorite d-flex align-items-center justify-content-center px-0 px-md-3 me-2 rounded-0 border-start border-color-grey border-end">
                <svg width="36" height="1em" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.8906 7.7255L15.924 7.16131C15.5478 7.12711 15.2228 6.88776 15.0691 6.52873L12.932 1.3484C12.5901 0.493566 11.376 0.493566 11.0341 1.3484L8.91405 6.52873C8.77728 6.88776 8.43534 7.12711 8.05921 7.16131L2.09239 7.7255C1.20335 7.81099 0.844315 8.92228 1.51109 9.52066L6.00758 13.47C6.29823 13.7265 6.41791 14.1026 6.33242 14.4787L4.98177 20.0179C4.7766 20.89 5.71693 21.6079 6.50339 21.1465L11.4786 18.2227C11.8034 18.0347 12.1967 18.0347 12.5215 18.2227L17.4969 21.1465C18.2833 21.6079 19.2237 20.9071 19.0183 20.0179L17.6848 14.4787C17.5993 14.1026 17.719 13.7265 18.0096 13.47L22.5061 9.52066C23.1558 8.92228 22.7796 7.81099 21.8906 7.7255Z" stroke="currentColor"></path>
                </svg>
            </button>
            <div id="dropdownvsf5sc" class="dropdown col fs-13px align-self-center additional-dropdown">
                <button id="dropdownTogglevsf5sc" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false" class="btn dropdown-toggle dropdown-cnc w-100">
                    <div class="d-flex align-items-center">
                        <span class="fs-20px">BDMS</span> 
                        <span class="ms-auto ps-2 dd-arrow ps-dropdown-arrow align-self-center">
                            <svg width="1em" height="1em" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-arrow-down-bold dropdown-arrow fs-6">
                                <path d="M2.41603 4.66602L1.16797 5.91408L6.37727 11.1234L7.0013 11.7203L7.62533 11.1234L12.8346 5.91408L11.5866 4.66602L7.0013 9.25129L2.41603 4.66602Z" fill="#1E1E21"></path>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" class="bi bi-calendar4 dropdown-arrow fs-6">
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z"></path>
                            </svg>
                        </span>
                    </div>
                </button>
            </div>
        </div> 
        <div class="mb-0 align-items-start justify-content-between align-items-md-center flex-column flex-md-row mb-md-1 d-flex position-relative">
            <div class="quote-info-left d-flex align-items-start align-items-md-center">
                <div class="pe-2 pe-md-3 text-nowrap mb-2 mb-md-0">
                    <span class="d-flex align-items-center">
                        <span class="quote-market-status me-1">
                            <span class="market-open">Close</span>
                        </span>
                        <span class="fs-18px text-black">Bangkok Dusit Medical Services</span>
                    </span> 
                    <span class="fs-20px fw-medium text-black mb-1 mb-md-0">BDMS</span>
                </div> 
                <div class="quote-info-left-values d-flex text-black fs-36px fw-medium me-2">
                    <div class="value d-flex align-items-center">
                        <span>30.25</span>
                    </div> 
                    <div class="d-flex align-items-center align-self-end">
                        <span class="ms-1 fs-18px quote-diff-status positive">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-up text-success me-1">
                                <line x1="12" y1="19" x2="12" y2="5"></line> 
                                <polyline points="5 12 12 5 19 12"></polyline>
                            </svg>
                            0.25 (0.83%)
                        </span>
                    </div>
                </div>
            </div> 
            <div class="quote-market align-self-md-end d-md-block d-flex text-nowrap text-black fw-medium fs-14px">
                <div class="quote-market-volume me-md-3 pe-md-3">
                    <span>30.29 M</span>
                </div> 
                <div class="quote-market-cost">
                    <span>912.50 M</span>
                </div>
            </div>
        </div>
    </div>
</div>
`;

module.exports  = stockQuoteHTML;