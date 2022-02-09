"use strict";

const Homey = require("homey");

class HttpEnergyMeterDriver extends Homey.Driver {
  /*async onPair(session) {
    this.log("HttpEnergyMeterDriver pairing started");
  }*/

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
