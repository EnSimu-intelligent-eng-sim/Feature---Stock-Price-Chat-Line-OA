const unitConversions = {
  // Length
  length: {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344
  },
  // Mass
  mass: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.45359237,
    oz: 0.028349523125
  },
  // Temperature (requires special handling for C, F, K)
  temperature: {
    K: 'base',
    C: 'derived',
    F: 'derived'
  },
  // Volume
  volume: {
    m3: 1,
    L: 0.001,
    mL: 0.000001,
    gal: 0.003785411784,
    qt: 0.000946352946
  },
  // Pressure
  pressure: {
    Pa: 1,
    kPa: 1000,
    bar: 100000,
    psi: 6894.75729,
    atm: 101325
  }
};

function convertTemperature(value, fromUnit, toUnit) {
  let kelvin;
  
  // Convert to Kelvin first
  switch(fromUnit) {
    case 'K': kelvin = value; break;
    case 'C': kelvin = value + 273.15; break;
    case 'F': kelvin = (value - 32) * 5/9 + 273.15; break;
    default: throw new Error('Invalid temperature unit');
  }
  
  // Convert from Kelvin to target unit
  switch(toUnit) {
    case 'K': return kelvin;
    case 'C': return kelvin - 273.15;
    case 'F': return (kelvin - 273.15) * 9/5 + 32;
    default: throw new Error('Invalid temperature unit');
  }
}

function convert(value, fromUnit, toUnit) {
  // Find the category by checking which object contains both units
  let category = null;
  for (const [cat, units] of Object.entries(unitConversions)) {
    if (fromUnit in units && toUnit in units) {
      category = cat;
      break;
    }
  }

  if (!category) {
    throw new Error('Units are not compatible or not supported');
  }

  // Special handling for temperature
  if (category === 'temperature') {
    return convertTemperature(value, fromUnit, toUnit);
  }

  // For other units, use the conversion factors
  const fromFactor = unitConversions[category][fromUnit];
  const toFactor = unitConversions[category][toUnit];
  return (value * fromFactor) / toFactor;
}

const unitConverterCard = require('../templates/unitConverterCard');

async function handleUnitConversion(event, client) {
  const text = event.message.text;
  // Expected format: "convert <value> <fromUnit> to <toUnit>"
  const match = text.match(/convert\s+(\d*\.?\d+)\s+(\w+)\s+to\s+(\w+)/i);
  
  if (!match) {
    await client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'Please use format: convert <value> <fromUnit> to <toUnit>\nExample: convert 100 C to F'
    });
    return;
  }

  const [_, value, fromUnit, toUnit] = match;
  
  try {
    const result = convert(parseFloat(value), fromUnit, toUnit);
    
    // Create a copy of the card template
    const card = JSON.parse(JSON.stringify(unitConverterCard));
    
    // Replace placeholders with actual values
    const timestamp = new Date().toLocaleString();
    
    // Update the conversion values in the card
    card.body.contents[1].contents[0].contents[1].text = `${value} ${fromUnit}`;
    card.body.contents[1].contents[1].contents[1].text = `${result.toFixed(4)} ${toUnit}`;
    card.body.contents[3].contents[1].text = timestamp;
    
    await client.replyMessage(event.replyToken, {
      type: 'flex',
      altText: `Conversion: ${value} ${fromUnit} to ${toUnit}`,
      contents: card
    });
  } catch (error) {
    await client.replyMessage(event.replyToken, {
      type: 'text',
      text: `Error: ${error.message}`
    });
  }
}

module.exports = {
  convert,
  handleUnitConversion
};