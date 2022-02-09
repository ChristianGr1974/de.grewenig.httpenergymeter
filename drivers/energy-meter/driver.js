"use strict";
const fetch = require("node-fetch");
const Homey = require("homey");

class HttpEnergyMeterDriver extends Homey.Driver {
  async onPair(session) {
    this.log("HttpEnergyMeterDriver pairing started");
    let pairIpAddress;
    let devices = [];

    session.setHandler("ipAddress", async ({ ipAddress }) => {
      try {
        pairIpAddress = ipAddress;
        devices = this.verifyMeterService(ipAddress);
        await session.nextView();
        return true;
      } catch (error) {
        //await session.showView("error");
        this.log("HttpEnergyMeterDriver pairing failed");
        return false;
      }
    });

    session.setHandler("list_devices", async () => {
      return devices;
    });
  }

  async verifyMeterService(ipAddress) {
    const response = await this.makeRequest(ipAddress);

    var json = await response.json();

    this.log("Received json:" + JSON.stringify(json));

    var devices = [
      {
        name: "Http Energy Meter",
        data: {
          id: json.id,
        },
        settings: {
          ipAddress: ipAddress,
        },
      },
    ];

    return devices;
  }

  async makeRequest(ipAddress) {
    const response = await fetch(`http://${ipAddress}/api/meter/actual`);

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
    return [
      {
        name: "My Energy Meter",
        data: {
          id: "my-energy-meter-001",
        },
        store: {
          address: "192.168.0.155",
        },
      },
    ];
  }
}

module.exports = HttpEnergyMeterDriver;
