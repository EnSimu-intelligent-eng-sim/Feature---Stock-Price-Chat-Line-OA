const { convert } = require('./unitConverter');

// Universal gas constant in different units
const R = {
  SI: 8.314462618, // J/(mol·K)
  L_atm: 0.08205746, // L·atm/(mol·K)
};

class IdealGas {
  constructor(pressure, temperature, volume, moles) {
    this.P = pressure; // Pa
    this.T = temperature; // K
    this.V = volume; // m³
    this.n = moles; // moles
  }

  // Calculate missing property using ideal gas law: PV = nRT
  interpolate(knownProperties) {
    const { P, T, V, n } = knownProperties;
    
    if (P && T && V && !n) {
      return { ...knownProperties, n: (P * V) / (R.SI * T) };
    }
    if (P && T && n && !V) {
      return { ...knownProperties, V: (n * R.SI * T) / P };
    }
    if (P && V && n && !T) {
      return { ...knownProperties, T: (P * V) / (n * R.SI) };
    }
    if (T && V && n && !P) {
      return { ...knownProperties, P: (n * R.SI * T) / V };
    }

    throw new Error('Invalid combination of properties. Need exactly 3 known properties.');
  }
}

async function handleThermodynamics(event, client) {
  const text = event.message.text;
  // Expected format: "thermo <property1> <value1> <unit1>, <property2> <value2> <unit2>, <property3> <value3> <unit3>"
  // Example: "thermo P 1 atm, T 298 K, V 22.4 L"
  
  try {
    const properties = {};
    const matches = text.matchAll(/(\w+)\s+(\d*\.?\d+)\s+(\w+)/g);
    
    for (const match of matches) {
      const [_, property, value, unit] = match;
      
      switch (property.toUpperCase()) {
        case 'P':
          properties.P = convert(parseFloat(value), unit, 'Pa');
          break;
        case 'T':
          properties.T = convert(parseFloat(value), unit, 'K');
          break;
        case 'V':
          properties.V = convert(parseFloat(value), unit, 'm3');
          break;
        case 'N':
          properties.n = parseFloat(value); // moles are always in moles
          break;
        default:
          throw new Error(`Unknown property: ${property}`);
      }
    }

    const thermodynamicsCard = require('../templates/thermodynamicsCard');
    const idealGas = new IdealGas();
    const result = idealGas.interpolate(properties);
    
    // Create a copy of the card template
    const card = JSON.parse(JSON.stringify(thermodynamicsCard));
    
    // Convert values to display units and update card
    const displayValues = {
      P: convert(result.P || properties.P, 'Pa', 'atm').toFixed(4),
      V: convert(result.V || properties.V, 'm3', 'L').toFixed(4),
      T: (result.T || properties.T).toFixed(4),
      n: (result.n || properties.n).toFixed(4)
    };

    // Update all values in the card
    const contents = card.body.contents[3].contents;
    contents[0].contents[1].text = `${displayValues.P} atm`;
    contents[1].contents[1].text = `${displayValues.V} L`;
    contents[2].contents[1].text = `${displayValues.n} mol`;
    contents[3].contents[1].text = `${displayValues.T} K`;

    // Update timestamp and calculated property info
    const timestamp = new Date().toLocaleString();
    card.body.contents[5].contents[1].text = timestamp;

    // Indicate which property was calculated
    let calculatedProperty = '';
    if (!properties.P) calculatedProperty = 'Calculated Pressure (P)';
    if (!properties.V) calculatedProperty = 'Calculated Volume (V)';
    if (!properties.T) calculatedProperty = 'Calculated Temperature (T)';
    if (!properties.n) calculatedProperty = 'Calculated Moles (n)';
    card.body.contents[5].contents[1].text = calculatedProperty;

    await client.replyMessage(event.replyToken, {
      type: 'flex',
      altText: 'Ideal Gas Law Calculation Result',
      contents: card
    });

  } catch (error) {
    await client.replyMessage(event.replyToken, {
      type: 'text',
      text: `Error: ${error.message}\n\nPlease use format: thermo <property> <value> <unit>, ...\nExample: thermo P 1 atm, T 298 K, V 22.4 L`
    });
  }
}

module.exports = {
  IdealGas,
  handleThermodynamics
};