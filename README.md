# HTTP Energy meter

This app provides a virtual HTTP electric meter device.

If you evaluate your electricity meter yourself and have your consumption data available via an HTTP REST service, then you can use this app to display this data in a virtual electricity meter.

Simply enter the respective URL for the current consumption and the total consumption and read out the data.

## Usage

While adding the device you will be prompted to enter an URL for the actual consumption and an URL for the total consumption. These URL have to point against your HTTP Rest service that has to response with a json object in the body:

```
{
    "id": "b8:27:eb:ea:c0:f1",
    "actual": 643,
}
```

```
{
    "id": "b8:27:eb:ea:c0:f1",
    "total": 28019.23,
}
```

Your json response must have the property `id` for identifiying the device.

You can specify the property to parse, while configuring your homey device.
