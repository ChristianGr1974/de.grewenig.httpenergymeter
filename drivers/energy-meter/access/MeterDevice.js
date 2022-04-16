const fetch = require("node-fetch");

class MeterDevice {
  constructor(settings, device) {
    this.device = device;
    this.reloadSettings(settings);
  }

  async reloadSettings(settings) {
    const {
      measure_power_url,
      meter_power_url,
      measure_property,
      meter_property,
    } = settings;

    this.measure_power_url = measure_power_url;
    this.meter_power_url = meter_power_url;
    this.measure_property = measure_property;
    this.meter_property = meter_property;

    this.device.log("Releading settings");
    this.device.log(`measure_power_url=${this.measure_power_url}`);
    this.device.log(`meter_power_url=${this.meter_power_url}`);
    this.device.log(`measure_property=${this.measure_property}`);
    this.device.log(`meter_property=${this.meter_property}`);
  }

  async start() {
    this.updateInterval = this.device.homey.setInterval(
      this.updateDeviceState.bind(this),
      10000
    );
  }

  async stop() {
    this.device.homey.clearInterval(this.updateInterval);
  }

  async updateActual() {
    try {
      const response = await fetch(this.measure_power_url);

      if (response.ok) {
        var json = await response.json();
        const value = this.getPropertyValue(this.measure_property, json);

        if (!value) return;

        this.device.log("Actual=" + value);

        this.device
          .setCapabilityValue("measure_power", value)
          .catch(theDevice.error);
      }
    } catch (error) {}
  }

  async updateTotal() {
    try {
      const response = await fetch(this.meter_power_url);

      if (response.ok) {
        var json = await response.json();  
        const value = this.getPropertyValue(this.meter_property, json);
        if (!value) return;

        this.device.log("Total=" + value);

        this.device
          .setCapabilityValue("meter_power", value)
          .catch(theDevice.error);
      }
    } catch (error) {}
  }

/**
 * 
 * @param {*} path path.to.property
 * @param {*} object 
 * @returns null if property not found
 */
  getPropertyValue(path, object) {
    return path.split('.').reduce((p,c)=>p&&p[c]||null, object);
  }

  async updateDeviceState() {
    this.updateActual();
    this.updateTotal();
  }
}

module.exports = MeterDevice;
