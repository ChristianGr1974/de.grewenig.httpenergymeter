const http = require("http");

const actualRequestOptions = {
  hostname: "192.168.0.155",
  port: 8000,
  path: "/actual",
  method: "GET",
};

const totalRequestOptions = {
  hostname: "192.168.0.155",
  port: 8000,
  path: "/total",
  method: "GET",
};

class Meter {
  device;

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

    var callback = function (response) {
      var str = "";

      //another chunk of data has been received, so append it to `str`
      response.on("data", function (chunk) {
        str += chunk;
      });

      //the whole response has been received, so we just print it out here
      response.on("end", function () {
        theDevice.log(str);
        var json = JSON.parse(str);
        var actual = json.actual;
        theDevice
          .setCapabilityValue("measure_power", actual)
          .catch(theDevice.error);
      });
    };

    http.request(actualRequestOptions, callback).end();
  }

  async updateTotal() {
    this.device.log("Updating actual meter values");
    var theDevice = this.device;

    var callback = function (response) {
      var str = "";

      //another chunk of data has been received, so append it to `str`
      response.on("data", function (chunk) {
        str += chunk;
      });

      //the whole response has been received, so we just print it out here
      response.on("end", function () {
        theDevice.log(str);
        var json = JSON.parse(str);
        var total = json.total;
        theDevice
          .setCapabilityValue("meter_power", total)
          .catch(theDevice.error);
      });
    };

    http.request(totalRequestOptions, callback).end();
  }

  async updateDeviceState() {
    this.updateActual();
    this.updateTotal();
  }
}

module.exports = Meter;
