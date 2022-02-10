"use strict";
const fetch = require("node-fetch");
const Homey = require("homey");

class HttpEnergyMeterDriver extends Homey.Driver {
  async onPair(session) {
    this.log("HttpEnergyMeterDriver pairing started");
    let measure_power_url;
    let measure_property;
    let meter_power_url;
    let meter_property;
    let devices = [];

    session.setHandler("measure_power_url", async ({ url }) => {
      this.log("HttpEnergyMeterDriver measure power url set:" + url);
      measure_power_url = url;
      await session.nextView();
      return true;
    });

    session.setHandler("measure_property", async ({ property }) => {
      this.log("HttpEnergyMeterDriver measure power property set:" + property);
      measure_property = property;
      await session.nextView();
      return true;
    });

    session.setHandler("meter_power_url", async ({ url }) => {
      this.log("HttpEnergyMeterDriver meter power url set:" + url);
      meter_power_url = url;
      await session.nextView();
      return true;
    });

    session.setHandler("meter_property", async ({ property }) => {
      try {
        this.log("HttpEnergyMeterDriver meter power property set:" + property);
        meter_property = property;
        devices = this.verifyMeterService(
          measure_power_url,
          meter_power_url,
          measure_property,
          meter_property
        );
        await session.nextView();
        return true;
      } catch (error) {
        this.log("HttpEnergyMeterDriver pairing failed");
        return false;
      }
    });

    session.setHandler("list_devices", async () => {
      return devices;
    });
  }

  async createDevices() {}

  async verifyMeterService(
    measure_power_url,
    meter_power_url,
    measure_property,
    meter_property
  ) {
    const response = await this.makeRequest(measure_power_url);

    var json = await response.json();
    this.log("Received json:" + JSON.stringify(json));
    this.log(`measure_power_url=${measure_power_url}`);
    this.log(`meter_power_url=${meter_power_url}`);
    this.log(`measure_property=${measure_property}`);
    this.log(`meter_property=${meter_property}`);

    var devices = [
      {
        name: "Http Energy Meter",
        data: {
          id: json.id,
        },
        settings: {
          measure_power_url: measure_power_url,
          meter_power_url: meter_power_url,
          measure_property: measure_property,
          meter_property: meter_property,
        },
      },
    ];

    return devices;
  }

  async makeRequest(url) {
    const response = await fetch(url);

    if (response.ok)
      //{
      return response;
    //} else if (response.status >= 400 && response.status < 500) {
    //throw "Invalid credentials or session expired";
    //}

    throw new Error("Metering service connection failed");
  }

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log("HttpEnergyMeterDriver has been initialized");

    //const showToastActionCard = this.homey.flow.getActionCard("show_toast");

    //showToastActionCard.registerRunListener(async ({ device, message }) => {
    //  await device.createToast(message);
    //});

    // {
    //   "id": "url",
    //   "navigation": { "next": "list_my_devices" }
    // },
  }

  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices() {
    /*return [
      {
        name: "My Energy Meter",
        data: {
          id: "my-energy-meter-001",
        },
        store: {
          address: "192.168.0.155",
        },
      },
    ];*/
  }
}

module.exports = HttpEnergyMeterDriver;
