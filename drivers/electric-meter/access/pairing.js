const fetch = require("node-fetch");

class Pairing {
  constructor(session, driver) {
    this.driver = driver;
    this.session = session;
    this.settings = {
      baseUrl: "",
      measure_power_path: "",
      meter_power_path: "",
      isCumulative: false
    };
    
    this.devices = [];
  }

  async startPairing() {
    this.setConnectionSettingsHandler();    
    this.setHandlerListDevices();
  }    

  async setConnectionSettingsHandler() {
    this.session.setHandler("connectionSettings", async (settings) => {
      this.settings = settings;
      
      this.driver.log(`Electgric Meter settings: ${JSON.stringify(this.settings)}`);
      this.devices = await this.verify();
      this.driver.log(`devices=${this.devices}`);

      if (this.devices == undefined) {
        this.driver.log("No devices found, aborting pairing process.");
        this.devices = [];
      }

      await this.session.nextView();
      
      return true;
    });
  }   

  async setHandlerListDevices() {
    this.session.setHandler("list_devices", async () => {
      return this.devices;
    });
  }

  generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async verify() {
    try {

      //Check meter_power url
      const resMeterPower = await this.makeRequest(this.settings.meter_power_path);
      var meterPower = await resMeterPower.text();
      if (meterPower === undefined || meterPower === "")
        return undefined;

      //Check measure_power url
      const resMeasurePower = await this.makeRequest(this.settings.measure_power_path);
      var measurePower = await resMeasurePower.text();
      if (measurePower === undefined || measurePower === "")
        return undefined;

      var idValue = this.generateGUID();

      this.driver.log("Received meter_power:" + meterPower);
      this.driver.log("Received measure_power:" + measurePower);

      var devices = [
        {
          name: "Electric Meter",
          data: {
            id: idValue,
          },
          settings: {
            meter_power_path: this.settings.meter_power_path,
            measure_power_path: this.settings.measure_power_path,
            baseUrl: this.settings.baseUrl,
            isCumulative: this.settings.isCumulative ?? false
          },
        },
      ];

      return devices;
    } catch (error) {
      return undefined;
    }

    return undefined;
  }

  async makeRequest(path) {
    this.driver.log(`Requesting url: ${this.settings.baseUrl}${path}`);
    const response = await fetch(`${this.settings.baseUrl}${path}`);
    if (response.ok) return response;
    throw new Error("Metering service connection failed");
  }
}

module.exports = Pairing;
