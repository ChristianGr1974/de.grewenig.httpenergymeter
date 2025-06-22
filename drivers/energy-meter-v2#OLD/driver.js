"use strict";

const Homey = require("homey");
const Pairing = require("./access/pairing");

class HttpEnergyMeterV2Driver extends Homey.Driver {
  async onPair(session) {
    this.log("HttpEnergyMeterV2Driver pairing started");
    var pairing = new Pairing(session, this);
    pairing.startPairing();
  }

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log("HttpEnergyMeterV2Driver has been initialized");
  }

  
}

module.exports = HttpEnergyMeterV2Driver;
