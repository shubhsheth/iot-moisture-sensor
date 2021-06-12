# HomeKit Soil Moisture Sensor

## About
This project will create an accessory that detects moisture level in soil and sends the information to Apple's HomeKit app.

As of building this, HomeKit doesn't support a moisture sensor. Instead of that we'll use a humidity sensor to show the moisutre levels.

## Installation
* Install this library in Arduino IDE: https://github.com/Mixiaoxiao/Arduino-HomeKit-ESP8266
* Upload MoistureSensor.ino, my_accessory.c and wifi_info.h to your NodeMCU (change Wi-Fi config before)

## Components
* NodeMCU
* Breadboard Power Supply
* Soil Moisture Sensor

## Circuit Diagram
![Image](circuit%20design.jpg)

## Moisture Levels Details
Moisture Sensor sends data between 0 - 1024. 0 being maximum moisture and 1024 equals none. This is converted and sent to HomeKit as a percentage between 0 - 100. 0 will be no moisture, 100 will be maximum.

## Thanks
* [Mixiaoxiao](https://github.com/Mixiaoxiao/Arduino-HomeKit-ESP8266)