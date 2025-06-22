const fetch = require("node-fetch");

class ElectricMeterDevice {
  constructor(settings, device) {
    this.device = device;
    this.reloadSettings(settings);
  }

  async reloadSettings(settings) {
    this.device.log(`ReloadSettings settings: ${JSON.stringify(settings)}`);

    this.settings = {};

    this.settings.baseUrl = settings.baseUrl;
    this.settings.measure_power_path = settings.measure_power_path;
    this.settings.meter_power_path = settings.meter_power_path;
    this.settings.isCumulative = settings.isCumulative;

    this.device.log("Reloading settings");
    this.device.log(`baseUrl=${this.settings.baseUrl}`);
    this.device.log(`measure_power_path=${this.settings.measure_power_path}`);
    this.device.log(`meter_power_path=${this.settings.meter_power_path}`);
    this.device.log(`isCumulative=${this.settings.isCumulative}`);
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
      const response = await fetch(this.settings.baseUrl + path);
      if (response.ok) {
        var text = await response.text();

        if (text != undefined) {
          try {
            let value = parseFloat(text);
            this.device.log(`${path} - value: ${value}`);
            let capability = "measure_power";

            if (path === this.settings.meter_power_path) {
              capability = "meter_power";
            }     

            this.device.setCapabilityValue(capability, value)
              .then((result) => {
                this.device.log(`capability '${capability}' updated successfully: ${value}`);
              }).catch((error) => {
                this.device.log(`ERROR updating capability '${capability}' ${error}`);
              });            

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
    this.update(this.settings.meter_power_path);
    this.update(this.settings.measure_power_path);
  }
}

module.exports = ElectricMeterDevice;
