# FreeDeck

## An OpenSource device inspired by the Elgato Stream Deck
### Live App hosted [HERE](http://freedeck.gosewis.ch/)
This is the software to create the config file and converting the images for the FreeDeck

The hardware related info can be found [here](https://github.com/koriwi/freedeck-hardware)
## Setup

```bash
npm i; npm start
```

thats it

## Usage

### Creating a Config from scratch
1. You start by clicken __Add Page+__ in the top right corner. This will give you a new page with the specified (for now 6) display button
2. To get something onto the displays, do one of the following
   1. Start by clicking on a display (the black box) to upload an Image. You can also just drag and drop an image onto it.
   2. Hover over one of the displays (the black boxes) and click the little settings icon in the top left corner of the display. You can enter your desired text there. Press __Enter__ to insert a line break. Line breaks will be added automatically if your text is to wide.
3. If you uploaded an image the settings popup will now appear. The display indicates that you can tune it's settings by permanently showing the settings icon. Click on it to hide the popup and vice versa. In this popup you can change a few things
   1. **Dither**: This button enables dithering. Dithering should be used for photo like images. It can _emulate_ colors between white and black. Disable dithering for icons.
   2. **Invert**: Should speak for itself. Inverts the images colors
   3. **+ -**: this will change the contrast of the image. Tune these values if you dont like the current look of the image.
   4. **Text**: If this button is red, text composition is disabled. Click on it to enable it. It should turn green and you uploaded image will shift to the left. Now enter some text in the textbox below. Have a look **2.ii** for more information. The selectbox next to this button will change the font size
   5. **Red X**: This will forever delete your current image
4. Below our display you will find a select box with three options:
   1. **Do nothing**: When you click on the display on your (physical) FreeDeck it will do nothing (doh)
   2. **Send Keys**: When you select this option, additional settings will appear. The red modifier keys (ctrl, shift, win, alt) will turn green and activate when you click them. You can already choose multiple of them here. Below you will find a selectbox with normal keys. Right now you can choose only one here. When you press the display on your (physical) FreeDeck it will press all the selected keys together/send them to your pc (mac, win, gnu/linux, bsd, ... everything with usb keyboard support should work).
   3. **Change Page**: This mode will change the page which is displayed when you press the display on your (physical) FreeDeck. You can select an already existing page or click the **Add Page** button which will create a new page and will automatically link both pages with each other.

## To Do
- allow for changing width and height
