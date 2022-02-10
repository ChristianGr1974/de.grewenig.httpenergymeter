"use strict";

const Homey = require("homey");
const Meter = require("./access/Meter");

class HttpEnergyMeterDevice extends Homey.Device {
  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    const {
      measure_power_url,
      meter_power_url,
      measure_property,
      meter_property,
    } = this.getSettings();

    this.log(`HttpEnergyMeterDevice has been initialized`);

    this.log("Device init");
    this.log("Name:", this.getName());
    this.log("Class:", this.getClass());

    this.log(`measure_power_url=${measure_power_url}`);
    this.log(`meter_power_url=${meter_power_url}`);
    this.log(`measure_property=${measure_property}`);
    this.log(`meter_property=${meter_property}`);

    this.meter = new Meter();

    this.meter.measure_power_url = measure_power_url;
    this.meter.meter_power_url = meter_power_url;
    this.meter.measure_property = measure_property;
    this.meter.meter_property = meter_property;
    this.meter.device = this;
    this.meter.start();
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
    this.log("HttpEnergyMeterDevice settings where changed");
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
    this.meter.stop();
  }

  // this method is called when the Device has requested a state change (turned on or off)
  async onCapabilityOnoff(value, opts) {
    // ... set value to real device, e.g.
    // await setMyDeviceState({ on: value });
    // or, throw an error
    // throw new Error('Switching the device failed!');
  }

  // this is a custom method for the 'show_toast' Action Flow card as
  // shown in the Driver example above
  //async createToast(message) {
  //await DeviceApi.createToast(message);
  //}
}

module.exports = HttpEnergyMeterDevice;
