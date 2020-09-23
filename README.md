# FreeDeck

## An OpenSource device inspired by the Elgato Stream Deck

### Live App hosted [HERE](http://freedeck.gosewis.ch/)

### Discord Community [HERE](https://discord.gg/sEt2Rrd)

This is the software to create the config file and converting the images for the FreeDeck

The hardware related info can be found [here](https://github.com/koriwi/freedeck-hardware)

## Setup

```bash
npm i; npm start
```

thats it

## Usage

### Creating a Config from scratch

1. You start by clicken **Add Page+** in the top right corner. This will give you a new page with the specified (for now 6) display button count
2. To get something onto the displays, do one of the following
   1. Start by clicking on a display (the black box). A window will appear. It has a tab for changing what to display on the screen which you can click to upload an image and a button tab for choosing what to do when the display is clicked. You can also just drag and drop an image onto the display/black box in the display settings tab to upload an image.
   2. You can also just enter some text in the textbox under the black preview box on the right hand side. The text is newline aware. It will be automatically centered. Feel free to change the font size to your liking.
   3. You can also combine both steps above to have an icon with text on the right hand side of it. You can tune the size/space of the icon with the _icon width_ slider on the bottom left hand side.
   4. You can also tweak the image: 3. **White threshold(Dither off)**: The higher you put this value, the brighter pixels need to be to be interpreted as white on the bright end. 4. **Black threshold(Dither off)**: The higher you put this value, the darker pixels need to be to be interpreted as black. (Normally you can just leave this value as it is)
      1. **Dither**: This button enables dithering. Dithering should be used for photo like images. It can _emulate_ colors between white and black. Disable dithering for icons.
      2. **Invert**: Should speak for itself. Inverts the images colors
3. If you uploaded an image the settings popup will now appear. The display indicates that you can tune it's settings by permanently showing the settings icon. Click on it to hide the popup and vice versa. In this popup you can change a few things
   1. **Dither**: This button enables dithering. Dithering should be used for photo like images. It can _emulate_ colors between white and black. Disable dithering for icons.
   2. **Invert**: Should speak for itself. Inverts the images colors
   3. **+ -**: this will change the contrast of the image. Tune these values if you dont like the current look of the image.
   4. **Text**: If this button is red, text composition is disabled. Click on it to enable it. It should turn green and you uploaded image will shift to the left. Now enter some text in the textbox below. Have a look **2.ii** for more information. The selectbox next to this button will change the font size
   5. **Red X**: This will forever delete your current image
4. Below our display you will find a select box with three options:
   1. **Do nothing**: When you click on the display on your (physical) FreeDeck it will do nothing (doh)
   2. **Hot Key**: When you select this option, additional settings will appear. Below you will find a selectbox with all physical keys on a keyboard. It will not correctly mirror your key presses if you have a non-US keyboard. But no worries, it will still press the right keys! When you press the display on your (physical) FreeDeck it will press all the selected keys together/send them to your pc (mac, win, gnu/linux, bsd, ... everything with usb keyboard support should work) and then releases them.
   3. **Change Page**: This mode will change the page which is displayed when you press the display on your (physical) FreeDeck. You can select an already existing page or click the **Add Page** button which will create a new page and will automatically link both pages with each other.
   4. **Send Text (WIP)**: This mode is similar to 2. But it differs slighty. It will send a key and will release it after 8ms then it will press the next key. This is usefull if you need to enter many things by text repetetively.

## Beta

1. Serial upload and download. You can now upload and download your config from your FreeDeck via USB in a Chrome Browser (Chrome or Chromium for now).
   Go to the general settings menu in the top right corner of your screen to find these new settings.
2. You can change the brightness in the general settings menu in the top right corner of your screen.
