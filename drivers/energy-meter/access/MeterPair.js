const fetch = require("node-fetch");

class MeterPair {
  constructor(session, driver) {
    this.driver = driver;
    this.session = session;
    this.measure_power_url = "";
    this.measure_property = "";
    this.meter_power_url = "";
    this.meter_property = "";
    this.measure_property_factor = 1.0;
    this.meter_property_factor = 1.0;
    this.id_property = "";
    this.devices = [];
  }

  async startPairing() {
    this.setMeasurePowerUrlHandler();
    this.setMeasurePowerProperty();
    this.setMeterPowerUrl();
    this.setMeterPowerProperty();
    this.setIdProperty();
    this.setHandlerListDevices();
  }

  async setMeasurePowerUrlHandler() {
    this.session.setHandler("measure_power_url", async ({ url }) => {
      this.driver.log("HttpEnergyMeterDriver measure power url set:" + url);
      this.measure_power_url = url;
      await this.session.nextView();
      return true;
    });
  }

  async setMeasurePowerProperty() {
    this.session.setHandler("measure_property", async ({ property }) => {
      this.driver.log(
        "HttpEnergyMeterDriver measure power property set:" + property
      );
      this.measure_property = property;
      await this.session.nextView();
      return true;
    });
  }

  async setMeterPowerUrl() {
    this.session.setHandler("meter_power_url", async ({ url }) => {
      this.driver.log("HttpEnergyMeterDriver meter power url set:" + url);
      this.meter_power_url = url;
      await this.session.nextView();
      return true;
    });
  }

  async setMeterPowerProperty() {
    this.session.setHandler("meter_property", async ({ property }) => {
      this.driver.log(
        "HttpEnergyMeterDriver meter power property set:" + property
      );
      this.meter_property = property;
      await this.session.nextView();
      return true;
    });
  }

  async setIdProperty() {
    this.session.setHandler("id_property", async ({ id }) => {
      this.driver.log("HttpEnergyMeterDriver id property set:" + id);
      this.id_property = id;

      this.devices = await this.verifyMeterService();
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

  async verifyMeterService() {
    try {
      const response = await this.makeRequest(this.measure_power_url);

      var id = "id";
      var json = await response.json();
      if (!json.hasOwnProperty("id")) return undefined;
      if (this.id_property !== undefined && this.id_property != "")
        id = this.id_property;

      var idValue = json[id];

      this.driver.log("Received json:" + JSON.stringify(json));
      this.driver.log(`measure_power_url=${this.measure_power_url}`);
      this.driver.log(`meter_power_url=${this.meter_power_url}`);
      this.driver.log(`measure_property=${this.measure_property}`);
      this.driver.log(`meter_property=${this.meter_property}`);
      this.driver.log(`id read=${idValue}`);

      var devices = [
        {
          name: "Http Energy Meter",
          data: {
            id: idValue,
          },
          settings: {
            measure_power_url: this.measure_power_url,
            meter_power_url: this.meter_power_url,
            measure_property: this.measure_property,
            meter_property: this.meter_property,
            measure_property_factor: this.measure_property_factor,
            meter_property_factor: this.meter_property_factor,
            is_solarpanel: false 
          },
        },
      ];

      return devices;
    } catch (error) {
      return undefined;
    }

    return undefined;
  }

  async makeRequest(url) {
    const response = await fetch(url);

    if (response.ok) return response;

    throw new Error("Metering service connection failed");
  }
}

module.exports = MeterPair;
