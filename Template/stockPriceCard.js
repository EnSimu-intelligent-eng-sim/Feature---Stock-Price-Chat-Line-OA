const stockPriceCard = {
    type: "bubble",
    body: {
        type: "box",
        layout: "vertical",
        contents: [
            {
                type: "text",
                text: "{marketStatus}",
                weight: "bold",
                color: "#1DB446",
                size: "sm"
            },
            {
                type: "text",
                text: "{stockSymbol}",
                weight: "bold",
                size: "xxl",
                margin: "md"
            },
            {
                type: "text",
                text: "{fullname}",
                size: "xs",
                color: "#aaaaaa",
                wrap: true
            },
            {
                type: "separator",
                margin: "xxl"
            },
            {
                type: "box",
                layout: "vertical",
                margin: "xxl",
                spacing: "sm",
                contents: [
                    {
                        type: "box",
                        layout: "horizontal",
                        contents: [
                            {
                                type: "text",
                                text: "Price:",
                                size: "sm",
                                color: "#555555",
                                flex: 0
                            },
                            {
                                type: "text",
                                text: "{stockPrice}",
                                size: "sm",
                                color: "#111111",
                                align: "end"
                            }
                        ]
                    },
                    {
                        type: "box",
                        layout: "horizontal",
                        contents: [
                            {
                                type: "text",
                                text: "Change:",
                                size: "sm",
                                color: "#555555",
                                flex: 0
                            },
                            {
                                type: "text",
                                text: "{change}",
                                size: "sm",
                                color: "#FF0000",
                                align: "end",
                                weight: "bold"
                            }
                        ]
                    },
                    {
                        type: "box",
                        layout: "horizontal",
                        contents: [
                            {
                                type: "text",
                                text: "High/Low: ",
                                size: "sm",
                                color: "#555555",
                                flex: 0
                            },
                            {
                                type: "text",
                                text: "{high}/{low}",
                                size: "sm",
                                color: "#111111",
                                align: "end"
                            }
                        ]
                    },
                    {
                        type: "box",
                        layout: "horizontal",
                        contents: [
                            {
                                type: "text",
                                text: "Volume (shares):",
                                size: "sm",
                                color: "#555555",
                                flex: 0
                            },
                            {
                                type: "text",
                                text: "{volume}",
                                size: "sm",
                                color: "#111111",
                                align: "end"
                            }
                        ]
                    },
                    {
                        type: "separator",
                        margin: "xxl"
                    },
                    {
                        type: "box",
                        layout: "vertical",
                        margin: "md",
                        contents: [
                            {
                                type: "text",
                                text: "Stock Exchange of Thailand (SET)",
                                size: "xs",
                                color: "#aaaaaa",
                                flex: 0
                            },
                            {
                                type: "text",
                                text: "{timestamp}",
                                color: "#aaaaaa",
                                size: "xxs",
                                align: "start"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    styles: {
        body: {
            separator: false
        },
        footer: {
            separator: true
        }
    }
};

module.exports = stockPriceCard;
