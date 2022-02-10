const fetch = require("node-fetch");

class Meter {
  device;
  measure_power_url;
  meter_power_url;
  measure_property;
  meter_property;

  async start() {
    this.updateInterval = this.device.homey.setInterval(
      this.updateDeviceState.bind(this),
      5000
    );
  }

  async stop() {
    this.device.homey.clearInterval(this.updateInterval);
  }

  async updateActual() {
    this.device.log("Updating actual meter values");
    var theDevice = this.device;

    this.device.log(`make request: ${this.measure_power_url}`);

    const response = await fetch(this.measure_power_url);

    if (response.ok) {
      var json = await response.json();

      this.device.log("Received json:" + JSON.stringify(json));

      var actual = json[this.measure_property];

      this.device.log(`Try to get property: ${this.measure_property}`);

      theDevice
        .setCapabilityValue("measure_power", actual)
        .catch(theDevice.error);
    }
  }

  async updateTotal() {
    this.device.log("Updating total meter values");
    var theDevice = this.device;

    const response = await fetch(this.meter_power_url);

    if (response.ok) {
      var json = await response.json();
      var total = json[this.meter_property];
      theDevice.setCapabilityValue("meter_power", total).catch(theDevice.error);
    }
  }

  async updateDeviceState() {
    this.updateActual();
    this.updateTotal();
  }
}

module.exports = Meter;
