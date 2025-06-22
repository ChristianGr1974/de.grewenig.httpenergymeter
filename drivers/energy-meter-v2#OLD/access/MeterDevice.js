const fetch = require("node-fetch");

class MeterDevice {
  constructor(settings, device) {
    this.device = device;
    this.reloadSettings(settings);
  }

  async reloadSettings(settings) {
    const {
      baseUrl,
      measure_power_path,
      meter_power_path,
      is_solarpanel
    } = settings;

    this.baseUrl = baseUrl;
    this.measure_power_path = measure_power_path;
    this.meter_power_path = meter_power_path;
    this.is_solarpanel = is_solarpanel;

    this.device.log("Releading settings");
    this.device.log(`baseUrl=${this.baseUrl}`);
    this.device.log(`measure_power_path=${this.measure_power_path}`);
    this.device.log(`meter_power_path=${this.meter_power_path}`);
    this.device.log(`is_solarpanel=${this.is_solarpanel}`);
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

  async update(path) {
    try {
      const response = await fetch(this.baseUrl + path);
      if (response.ok) {
        var text = await response.text();

        if (text != undefined) {
          try {
            let value = parseFloat(text);
            this.device.log(`${path} - value: ${value}`);
            let capability = "measure_power";

            if (path === this.meter_power_path) {
              capability = "meter_power";
            }     

            this.device.setCapabilityValue(capability, value)
              .then((result) => {
                this.device.log(`capability '${capability}' updated successfully: ${value}`);
              }).catch((error) => {
                this.device.log(`ERROR updating capability '${capability}' ${error}`);
              });


            let extension = ".imported";
            if (this.is_solarpanel) {
              extension = ".exported";
            }

            if (capability.startsWith("meter")) {            
              this.device.setCapabilityValue(capability + extension, value)
                .then((result) => {
                  this.device.log(`capability '${capability+ extension}' updated successfully: ${value}`);
                }).catch((error) => {
                  this.device.log(`ERROR updating capability '${capability+ extension}' ${error}`);
                })
            }

          } catch (err) {
            this.device.log(`error: ${err}`);
          }
        }
      }
    } catch (error) {
      this.device.log(`ERROR updating path '${path}' ${error}`);
    }
  }

  async updateDeviceState() {
    this.update(this.meter_power_path);
    this.update(this.measure_power_path);
  }
}

module.exports = MeterDevice;
