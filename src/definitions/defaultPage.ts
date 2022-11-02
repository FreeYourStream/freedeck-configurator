import { Button, Display, DisplayButton, Page } from "../generated";
import { getBase64Image } from "../lib/image/base64Encode";
import { createDefaultBackDisplay } from "./defaultBackImage";
import { getEmptyConvertedImage } from "./emptyConvertedImage";
import { fontMedium } from "./fonts";
import { EAction, EImageMode, ETextPosition } from "./modes";

const createDefaultButton: () => Button = () => {
  const button: Button = {
    primary: {
      mode: EAction.noop,
      values: {
        [EAction.changePage]: "",
        [EAction.hotkeys]: [],
        [EAction.settings]: {
          setting: 0,
          value: 128,
        },
        [EAction.special_keys]: 0,
        [EAction.text]: "",
      },
      leavePage: { enabled: false },
    },
    secondary: {
      mode: EAction.noop,
      values: {
        [EAction.changePage]: "",
        [EAction.hotkeys]: [],
        [EAction.settings]: { setting: 0, value: 128 },
        [EAction.special_keys]: 0,
        [EAction.text]: "",
      },
      leavePage: { enabled: false },
    },
  };
  return button;
};
export const createDefaultDisplay = (): Display => ({
  originalImage: undefined,
  convertedImage: getEmptyConvertedImage(),
  previewImage: getBase64Image(getEmptyConvertedImage()),
  imageSettings: {
    brightness: 0,
    contrast: 0,
    whiteThreshold: 64,
    blackThreshold: 192,
    imageMode: EImageMode.normal,
    invert: true,
    autoCrop: true,
  },
  textSettings: {
    font: fontMedium,
    text: "",
    position: ETextPosition.right,
  },
  textWithIconSettings: {
    iconWidthMultiplier: 0.35,
  },
  isGeneratedFromDefaultBackImage: false,
});

export const createDefaultDisplayButton = async (): Promise<DisplayButton> => {
  return {
    button: createDefaultButton(),
    display: createDefaultDisplay(),
    live: {
      bottom: "none",
      top: "none",
    },
  };
};

export const createDefaultPage = async (
  count: number,
  previousPage?: string
): Promise<Page> => {
  const page: Page = {
    name: "",
    usePageNameAsWindowName: true,
    displayButtons: [],
  };
  for (var i = 0; i < count; i++) {
    page.displayButtons.push(await createDefaultDisplayButton());
  }
  if (previousPage !== undefined) {
    page.displayButtons[0].button!.primary.mode = EAction.changePage;
    page.displayButtons[0].button!.primary.values[EAction.changePage] =
      previousPage;
    page.displayButtons[0].display = await createDefaultBackDisplay(
      previousPage
    );
  }
  return page;
};
