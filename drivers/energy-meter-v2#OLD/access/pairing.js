const fetch = require("node-fetch");

class Pairing {
  constructor(session, driver) {
    this.driver = driver;
    this.session = session;
    this.baseUrl = "";
    this.measure_power_path = "";
    this.meter_power_path = "";
    this.devices = [];
  }

  async startPairing() {
    this.setBaseUrlHandler();
    this.setMeasurePowerPathHandler();
    this.setMeasuresExportedHandler();
    this.setMeterPowerPath();
    this.setIsSolarPanel();
    this.setIsCumulative();
    this.setHandlerListDevices();
  }

  async setIsSolarPanel() {
    this.session.setHandler("is_solarpanel", async (is_solarpanel) => {
      this.driver.log("HttpEnergyMeterV2Driver is_solarpanel set:" + is_solarpanel);
      this.is_solarpanel = is_solarpanel;

      await this.session.showView("is_cumulative");

      if (this.is_solarpanel) {        
        this.session.emit("state", "solarpanel");
      }
      else {        
        this.session.emit("state", "no-solarpanel");
      }

      // this.devices = await this.verify();
      // this.driver.log(`devices=${this.devices}`);

      // if (this.devices == undefined) {
      //   this.driver.log("No devices found, aborting pairing process.");
      //   this.devices = [];
      // }

      // await this.session.nextView();
      return true;
    });
  }

  async setIsCumulative() {
    this.session.setHandler("is_cumulative", async (data) => {
      this.driver.log(`HttpEnergyMeterV2Driver is_cumulative set: ${data.is_cumulative}, state: ${data.state}`);
      this.is_cumulative = data.is_cumulative;

      if (this.is_cumulative && data.state === "no-solarpanel") {
        //await this.session.showView("is_cumulative");
        //this.session.emit("state", "no-solarpanel");

        //this.PrepateCapabilities();
      }
      if (!this.is_cumulative && data.state === "no-solarpanel") {
        //await this.session.showView("is_cumulative");
        //this.session.emit("state", "no-solarpanel");

        //this.PrepateCapabilities();
      }
      if (this.is_cumulative && data.state === "solarpanel") {
        //await this.session.showView("is_cumulative");
        //this.session.emit("state", "no-solarpanel");

        //this.PrepateCapabilities();
      }
      if (!this.is_cumulative && data.state === "solarpanel") {
        //await this.session.showView("is_cumulative");
        //this.session.emit("state", "no-solarpanel");

        //this.PrepateCapabilities();
      }

      return true;
    });
  }

  async setBaseUrlHandler() {
    this.session.setHandler("baseUrl", async (url) => {
      this.driver.log("HttpEnergyMeterV2Driver baseUrl set:" + url);
      this.baseUrl = url;
      await this.session.showView("measure_power_path");
      return true;
    });
  }

  async setMeasuresExportedHandler() {
    this.session.setHandler("measures_exported", async (measuresExported) => {
      this.driver.log("HttpEnergyMeterV2Driver also measures exported:" + measuresExported);
      this.measuresExported = measuresExported;

      if (this.measuresExported) {
        await this.session.showView("measure_power_exported_path");
      } else {
        await this.session.showView("is_solarpanel");
      }
      return true;
    });
  }

  async setMeasurePowerPathHandler() {
    this.session.setHandler("measure_power_path", async (measure_power_path) => {
      this.driver.log("HttpEnergyMeterV2Driver measure_power_path property set:" + measure_power_path);
      this.measure_power_path = measure_power_path;
      await this.session.showView("meter_power_path");
      return true;
    });
  }

  async setMeterPowerPath() {
    this.session.setHandler("meter_power_path", async (meter_power_path) => {
      this.driver.log("HttpEnergyMeterV2Driver meter_power_path set:" + meter_power_path);
      this.meter_power_path = meter_power_path;
      await this.session.nextView("measures_exported");
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
      const resMeterPower = await this.makeRequest(this.meter_power_path);
      var meterPower = await resMeterPower.text();
      if (meterPower === undefined || meterPower === "")
        return;

      //Check measure_power url
      const resMeasurePower = await this.makeRequest(this.measure_power_path);
      var measurePower = await resMeasurePower.text();
      if (measurePower === undefined || measurePower === "")
        return;

      var idValue = this.generateGUID();

      this.driver.log("Received meter_power:" + meterPower);
      this.driver.log("Received measure_power:" + measurePower);

      var devices = [
        {
          name: "Http Energy Meter V2",
          data: {
            id: idValue,
          },
          settings: {
            meter_power_path: this.meter_power_path,
            measure_power_path: this.measure_power_path,
            baseUrl: this.baseUrl,
            is_solarpanel: this.is_solarpanel
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
    const response = await fetch(`${this.baseUrl}${path}`);
    if (response.ok) return response;
    throw new Error("Metering service connection failed");
  }
}

module.exports = Pairing;
