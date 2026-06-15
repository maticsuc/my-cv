# Building a Custom Touchscreen Kiosk for ASTEL

I built custom kiosk software for ASTEL Lighting using a Portworld YC-SM41P touchscreen panel. The device boots directly into a fullscreen web application used for lighting control and includes a simple touchscreen interface for configuring WiFi, the display URL, brightness, and branding.

## Starting Point

I started with a standard Portworld device running the manufacturer's Debian image. Although the basic hardware was working, the system was not ready to be used as a dedicated product.

My first step was to remove unnecessary startup services and configure the device to launch directly into the kiosk. This reduced the time needed to reach the graphical system from about 6.1 seconds to 4.4 seconds.

## Building the Kiosk Mode

I created a custom Linux session that automatically launches Chromium in fullscreen kiosk mode.

Before opening the configured website, the session waits for a network connection and checks that the system clock is valid. This prevents Chromium from showing connection or certificate errors during startup.

The unusual 480x480 display also introduced several layout problems. I fixed incorrectly sized Chromium windows, hidden content, cursor visibility, and unwanted touchscreen pinch-to-zoom.

## Creating the Setup Interface

To make installation and configuration simple, I built a local setup interface using Flask, HTML, CSS, and JavaScript. It was designed specifically for the small square touchscreen and works without an external keyboard or computer.

The interface allows the installer to:

- Select and connect to a WiFi network
- Configure and test the kiosk URL
- Adjust the screen brightness
- Select an ASTEL Lighting or ASTEL Marine boot logo
- Reboot or shut down the device

An on-screen keyboard appears when text input is needed. After the settings are saved, the device reboots directly into kiosk mode.

## Solving Hardware-Specific Problems

A large part of the project involved investigating problems specific to the device hardware.

The WiFi module regularly attempted to use WPA3 on mixed WPA2/WPA3 networks, causing long connection timeouts. I fixed this by creating explicit WPA2 profiles. I also added a small system service to work around a separate firmware association delay.

Together, these changes reduced cold-boot WiFi connection time from about 19 seconds to 10.5 seconds. The complete kiosk became visible roughly 10 seconds sooner than at the start of the project.

## Branding and Device Controls

I replaced the default boot graphics with ASTEL branding. The logo was stored inside a verified Rockchip boot partition, so I created a guarded flashing tool that safely updates both the image and its integrity hash.

The panel only has one accessible hardware button, so I gave it two functions:

- A short press refreshes the displayed web page
- Holding it for three seconds clears the settings and returns to setup mode

This gives installers a simple recovery method without exposing the Linux desktop.

## Deployment and Recovery

The project began with manual testing directly on one device. As the system became stable, I moved the configuration, scripts, services, and interface into a structured repository and created a repeatable deployment process.

A fresh device can now be prepared over ADB, while later updates can be deployed over SSH. The same process works from Linux and Windows and includes backups and checks for boot-critical changes.

During development, I also tested raw image restoration, which erased the device's boot chain. I recovered it using the board's MaskROM pins and the manufacturer's official image. Based on that experience, the final process uses the official image followed by automated deployment instead of unsafe raw image flashing.

## Result

The finished system turns a standard touchscreen panel into a dedicated ASTEL kiosk that is branded, configurable, recoverable, and straightforward to deploy.

The project combined embedded Linux configuration, frontend development, systemd services, hardware debugging, network troubleshooting, and deployment automation.
