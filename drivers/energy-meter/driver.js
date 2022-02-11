"use strict";

const Homey = require("homey");
const MeterPair = require("./access/MeterPair");

class HttpEnergyMeterDriver extends Homey.Driver {
  async onPair(session) {
    this.log("HttpEnergyMeterDriver pairing started");
    var meterPair = new MeterPair(session, this);
    meterPair.startPairing();
  }

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log("HttpEnergyMeterDriver has been initialized");
  }
}

module.exports = HttpEnergyMeterDriver;
