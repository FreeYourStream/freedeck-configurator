# FreeDeck

## An OpenSource device inspired by the Elgato Stream Deck

### Live App hosted [HERE](https://fdconfig.freeyourstream.com/)

### Discord Community [HERE](https://discord.gg/sEt2Rrd)

This is the software to create the config file and converting the images for the FreeDeck

The hardware related info can be found [here](https://github.com/freeyourstream/freedeck-hardware)

## Setup (for developers only)

```bash
npm i; npm start
```

thats it

## Usage

### Creating a Config from scratch

#### Add Page

![1](https://i.imgur.com/eDk0tL1.jpg)</br>

1. Click **Add Page+** in the top right corner. This will give you one new page with (for now 6) displays.

#### This is what a page looks like.

![2](https://i.imgur.com/Q9JMcSc.jpg)</br>

1. This is the page number. It starts with 0 (for now :P)
2. This is the delete button. Speaks for itself, doesn't it?
3. This is a display. It shows what your FreeDeck would show. (Drag and drop onto another display to reorder) **Click it to continue**

#### Now you will see this modal/window pop up.

![3](https://i.imgur.com/7uYtHsX.jpg)</br>

1.  These are tabs that group our settings. Click them to switch
2.  This preview box will show you what it would look like on your FreeDeck. It updates in realtime while you adjust the image settings. You can also click it to upload an image. Or drag and drop. Whatever you like more :)
3.  These are our image settings. Here you can tweak the appearance of your image. More on those settings later in detail!
4.  Here you can add text to your image. Also more details later.
5.  This button closes this window :o but don't worry, **you don't need to save**. Every change you make is automatically saved. But don't close it yet. We need this window for the next step. **Click on Button Settings[1]** to continue.

#### After changing the tab to _Button Settings_ you should see this.

![4](https://i.imgur.com/BVnFyte.jpg)</br>

1.  This setting changes what the FreeDeck does when you short click it. Also more details later
2.  This setting changes what the FreeDeck does when you long click it. Also more details later
3.  The keyboard layout disclaimer. **Please read it**

#### Now we can save our config!

![5](https://i.imgur.com/QdkE8h6.jpg)</br>

1. Click the **Save Config** button.
2. Put it in the root of your SDCard and make sure it's name is **config.bin** (not config(1).bin or similar)
3. Put the SDCard into your FreeDeck.
4. Please make sure your SDCard is formatted as FAT32 and MBR (not GPT). How to do this? [Put better Link here](https://www.reddit.com/r/3dshacks/comments/4ugheu/psa_sd_cards_with_a_gpt_partition_table_instead/)

### Settings explained in Detail

**_Things marked with \* will only work if you have the develop branch of the arduino software flashed to your FreeDeck!_**

#### Display Settings

These settings all change the appearance of your display.

- **Image Preview** When you click the preview image which in the beginning is just a black box, you can upload an image to then tweak to your liking.
  - **Right click menu** When you right click the preview, the context menu shows up where you can delete the image you uploaded or make it a default back button. More on this later!
- **Text** If you only want text, just enter your text into the text box and choose your font size below.
- **Icon width** You can also combine both steps to have text next to an image/icon. If you had an image before and **now only want text** you can right click the image preview and delete the image.
- **Invert** This button toggles color inversion. As your background should be transparent or black. If it isn't (too bright or even white for example) you can invert the colors of this image so the background becomes dark
- **Dither** This button enables dithering. Dithering should be used for photo like images. It can _emulate_ colors between white and black. Disable dithering for icons in most cases.
- **White threshold(Dither off)** (Will become brightness when dither is on) The higher you put this value, the brighter pixels need to be to be interpreted as white on the bright end.
- **Black threshold(Dither off)** (Will become contrast when dither is on) The higher you put this value, the darker pixels need to be to be interpreted as black. (Normally you can just leave this value as it is)
- **Brightness(Dither on)** Changes the brightness of the image
- **Contrast(Dither on)** Changes the contrast of the image

#### Button Settings

These settings change the behaviour of your FreeDeck when you press a button or display. However you wanna call it. For all modes (except text mode for now) you can have a short and a long press function. So something different will happen when you press longer than a specific amount of time (300ms is the default value) on one display.
This can be usefull if you have a mute button for Discord or Teamspeak. Then you can put the deafen functionality on the same button just with a long press. **Please read the _Disclaimer_ at the bottom of the settings modal.**

##### Modes

- **Change Page** This mode changes the page which is displayed on your FreeDeck. You can choose between another page or the **Add Page+** button which adds a completely new page and automatically changes the top left display to point back to the current page.
- **Hot Key** This mode is for triggering hot keys on your computer. It presses up to 7 keys simultaneously and then releases them. You can just choose the keys you want from the dropdown menu or click the _Click to recognize_ box which than scans which keys you press. You should use the _Click to recognize_ box because of different keyboard layouts are not really supported yet. If you want to delete a key you entered just click it. Drag and drop reordering is not possible yet!
- **Special Keys** This mode is for some special keys like volume up and down, play and pause
- **Text** This mode differs from the hotkey mode in two ways. Firstly it allows up to 15 key presses in stead of 7 but it has no longpress support. Secondly it releases every key after being pressed (except for ctrl, alt, shift and win). It's usefull for entering text into spreadsheets or similar. To enter keys which should be pressed click the black box below and start typing.
- **Settings** This mode lets you change FreeDeck settings on the fly. For now it's only the brightness.

### General Settings

![6](https://i.imgur.com/3vQjX22.jpg)</br>
The general settings can be found here. Here you can set different things including the **default back button**

- **Default back button** Everytime you create a new page (except for the first one ;)) a back button is automatically created in the top left display. Here you can change it's appearance. After updating it and closing the window all back buttons will be update to the new one. Right clicking the image preview opens the context menu, which will let you reset the back button to it's stock image.
- **Brightness** Let's you set the default brightness settings when the FreeDeck is turned on.
- **Serial (Experimental)** This only works in Chrome/Chromium for now (no, not even most Chrome based browsers, if you want to know why, google _Chrome Origin Trials_). Here you can connect, download and upload the config file from your FreeDeck without fiddling with your SDCard. Just press **_Connect_** -> **_Read_** to load the config into the configurator. Then press **_Write_** to upload it. Your FreeDeck should restart now :). If this did not work and your FreeDeck only shows blank illuminated screens, don't panik. A backup was made of the old config file onto your SDCard. It was renamed to **_config.bak_**. Just name it back to config.bin and you are good to go.

### Experimental Functionality

1. **Serial upload and download** You can now upload and download your config from your FreeDeck via USB in a Chrome Browser (Chrome or Chromium for now).
   Go to the general settings menu in the top right corner of your screen to find these new settings.
2. **Quick Serial upload and download** If you've once connected successfully over serial to a FreeDeck, it will automatically reconnect the next you open the configurator and will replace the up and download buttons. If you wish to use the normal way again, just click the litte lock icon next to the url bar and delete the serial connection there. After reloading the page the old buttons appear. (ToDo make this configurable)

## Known issues

- When i change the display layout (width or height) the already created pages don't create additional displays.
  - Solution: Just change this before pressing `Add Page`
