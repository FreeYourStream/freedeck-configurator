import {IDisplay, IPage} from '../App'
import { fontMedium } from '../components/Settings'
import { EAction } from '../lib/parse/parsePage'

export const getDefaultPage = (width: number, height: number,previousPageIndex?: number): IPage => {
    const defaultDisplay: IDisplay = {
        text: '',
        actionSettings: {
            primary: {
                mode: EAction.noop,
                values: []
            },
            secondary: {
                mode: EAction.noop,
                values: [],
                enabled: false
            },
        },
        iconSettings: {
            contrast: 0,
            dither: false,
            invert: false,
        },
        imageIsConverted: true,
        textWithIconSettings: {
            enabled: false,
            font: fontMedium
        }
    }
    const backButton: IDisplay = {...defaultDisplay}
    const displays = Array<IDisplay>(width*height - 1).fill(defaultDisplay)
    if(previousPageIndex !== undefined) {
        backButton.actionSettings.primary.mode = EAction.changeLayout
        backButton.actionSettings.primary.values = [previousPageIndex]
    }
    displays.unshift(backButton)
    return {
        displays
    }
}