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

    const idealGas = new IdealGas();
    const result = idealGas.interpolate(properties);
    
    // Format the result message
    let replyText = 'Ideal Gas Calculation Result:\n';
    for (const [prop, value] of Object.entries(result)) {
      let displayValue = value;
      let unit = '';
      
      switch (prop) {
        case 'P':
          displayValue = convert(value, 'Pa', 'atm');
          unit = 'atm';
          break;
        case 'T':
          unit = 'K';
          break;
        case 'V':
          displayValue = convert(value, 'm3', 'L');
          unit = 'L';
          break;
        case 'n':
          unit = 'mol';
          break;
      }
      
      replyText += `${prop}: ${displayValue.toFixed(4)} ${unit}\n`;
    }

    await client.replyMessage(event.replyToken, {
      type: 'text',
      text: replyText
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