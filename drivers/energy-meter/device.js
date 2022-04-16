"use strict";

const Homey = require("homey");
const MeterDevice = require("./access/MeterDevice");

class HttpEnergyMeterDevice extends Homey.Device {
  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    var settings = this.getSettings();

    if(settings.is_solarpanel) {
      this.setClass("solarpanel");
      this.setEnergy(Object); // remove the energys object "cumulative"
    }

    this.log(`HttpEnergyMeterDevice has been initialized`);

    this.meter = new MeterDevice(settings, this);
    await this.meter.start();
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log("HttpEnergyMeterDevice has been added");
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    var strOldSettings = JSON.stringify(oldSettings);
    var strNewSettings = JSON.stringify(newSettings);
    var strChangedKeys = JSON.stringify(changedKeys);

    this.log("HttpEnergyMeterDevice settings where changed");
    this.log("OldSettings=" + strOldSettings);
    this.log("NewSettings=" + strNewSettings);
    this.log("ChangedKeys=" + strChangedKeys);



    await this.meter.stop();
    await this.meter.reloadSettings(newSettings);
    await this.meter.start();
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log("HttpEnergyMeterDevice was renamed");
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    await this.meter.stop();
  }

  // this method is called when the Device has requested a state change (turned on or off)
  async onCapabilityOnoff(value, opts) {}
}

module.exports = HttpEnergyMeterDevice;
