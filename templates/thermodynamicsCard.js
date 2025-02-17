const thermodynamicsCard = {
    type: "bubble",
    body: {
        type: "box",
        layout: "vertical",
        contents: [
            {
                type: "text",
                text: "Ideal Gas Calculation",
                weight: "bold",
                color: "#1DB446",
                size: "sm"
            },
            {
                type: "text",
                text: "PV = nRT",
                weight: "bold",
                size: "xl",
                margin: "md",
                align: "center"
            },
            {
                type: "separator",
                margin: "xl"
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
                                text: "Pressure (P):",
                                size: "sm",
                                color: "#555555",
                                flex: 0
                            },
                            {
                                type: "text",
                                text: "{pressure} atm",
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
                                text: "Volume (V):",
                                size: "sm",
                                color: "#555555",
                                flex: 0
                            },
                            {
                                type: "text",
                                text: "{volume} L",
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
                                text: "Moles (n):",
                                size: "sm",
                                color: "#555555",
                                flex: 0
                            },
                            {
                                type: "text",
                                text: "{moles} mol",
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
                                text: "Temperature (T):",
                                size: "sm",
                                color: "#555555",
                                flex: 0
                            },
                            {
                                type: "text",
                                text: "{temperature} K",
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
                                text: "Gas Constant (R):",
                                size: "sm",
                                color: "#555555",
                                flex: 0
                            },
                            {
                                type: "text",
                                text: "0.08206 L·atm/(mol·K)",
                                size: "sm",
                                color: "#aaaaaa",
                                align: "end"
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
                        text: "Ideal Gas Law Calculator",
                        size: "xs",
                        color: "#aaaaaa",
                        flex: 0
                    },
                    {
                        type: "text",
                        text: "{calculatedProperty}",
                        size: "xs",
                        color: "#1DB446",
                        flex: 0,
                        weight: "bold"
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

module.exports = thermodynamicsCard;