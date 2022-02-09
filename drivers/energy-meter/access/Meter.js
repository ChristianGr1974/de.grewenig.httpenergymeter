const fetch = require("node-fetch");

class Meter {
  device;
  ipAddress;

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

    this.device.log(`make request: http://${this.ipAddress}/api/meter/actual`);

    const response = await fetch(`http://${this.ipAddress}/api/meter/actual`);

    if (response.ok) {
      var json = await response.json();

      this.device.log("Received json:" + JSON.stringify(json));

      var actual = json.actual;
      theDevice
        .setCapabilityValue("measure_power", actual)
        .catch(theDevice.error);
    }
  }

  async updateTotal() {
    this.device.log("Updating actual meter values");
    var theDevice = this.device;

    const response = await fetch(`http://${this.ipAddress}/api/meter/total`);

    if (response.ok) {
      var json = await response.json();
      var actual = json.total;
      theDevice.setCapabilityValue("meter_power", total).catch(theDevice.error);
    }
  }

  async updateDeviceState() {
    this.updateActual();
    this.updateTotal();
  }
}

module.exports = Meter;
