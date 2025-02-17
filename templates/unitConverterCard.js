const unitConverterCard = {
    type: "bubble",
    body: {
        type: "box",
        layout: "vertical",
        contents: [
            {
                type: "text",
                text: "Unit Conversion",
                weight: "bold",
                color: "#1DB446",
                size: "sm"
            },
            {
                type: "box",
                layout: "vertical",
                margin: "lg",
                spacing: "sm",
                contents: [
                    {
                        type: "box",
                        layout: "horizontal",
                        contents: [
                            {
                                type: "text",
                                text: "From:",
                                size: "sm",
                                color: "#555555",
                                flex: 0
                            },
                            {
                                type: "text",
                                text: "{fromValue} {fromUnit}",
                                size: "sm",
                                color: "#111111",
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
                                text: "To:",
                                size: "sm",
                                color: "#555555",
                                flex: 0
                            },
                            {
                                type: "text",
                                text: "{toValue} {toUnit}",
                                size: "sm",
                                color: "#111111",
                                align: "end",
                                weight: "bold"
                            }
                        ]
                    }
                ]
            },
            {
                type: "separator",
                margin: "xl"
            },
            {
                type: "box",
                layout: "vertical",
                margin: "md",
                contents: [
                    {
                        type: "text",
                        text: "Unit Converter",
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

module.exports = unitConverterCard;