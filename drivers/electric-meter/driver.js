"use strict";

const Homey = require("homey");
const Pairing = require("./access/pairing");

class ElectricMeterDriver extends Homey.Driver {
  async onPair(session) {
    this.log("ElectricMeterDriver pairing started");
    var pairing = new Pairing(session, this);
    pairing.startPairing();
  }

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log("ElectricMeterDriver has been initialized");
  }

  
}

module.exports = ElectricMeterDriver;



// "settings": [
//     {
//       "id": "is_solarpanel",
//       "type": "checkbox",
//       "value": false,
//       "label": {
//         "en": "Solar plant / Inverter",
//         "de": "Solaranlage / Wechselrichter"
//       },
//       "hint": {
//         "en": "Is the meter an Inverter of a solar plant?",
//         "de": "Ist der Zähler ein Wechselrichter einer Solaranlage?"
//       }
//     }    
//   ],
