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
        if (json === undefined) return;

        if (!json.hasOwnProperty(this.measure_property)) return;

        var actual = json[this.measure_property];
        this.device.log("Actual=" + actual);

        this.device
          .setCapabilityValue("measure_power", actual)
          .catch(theDevice.error);
      }
    } catch (error) {}
  }

  async updateTotal() {
    try {
      const response = await fetch(this.meter_power_url);

      if (response.ok) {
        var json = await response.json();
        if (json === undefined) return;

        if (!json.hasOwnProperty(this.meter_property)) return;

        var total = json[this.meter_property];
        this.device.log("Total=" + total);

        this.device
          .setCapabilityValue("meter_power", total)
          .catch(theDevice.error);
      }
    } catch (error) {}
  }

  async updateDeviceState() {
    this.updateActual();
    this.updateTotal();
  }
}

module.exports = MeterDevice;
