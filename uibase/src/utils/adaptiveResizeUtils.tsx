export enum adaptiveElementSize {
    extraSmall,
    small,
    medium,
    large,
    extraLarge
}

export const breakPointsSizePx = {
    paginator: [375, 540, 857, 857, 857],
    diagram: [375, 400, 638, 878, 878],
    edit: [375, 375, 522, 750, 750],
    normal: [375, 510, 630, 900, 900],
    referenceMenu: [40, 40, 40, 40, 40]
};

export type adaptiveElementType = "edit"|"diagram"|"normal"|"paginator"|"referenceMenu";

export function getAdaptiveSize(sizePx: number, et:adaptiveElementType) {
    if (sizePx > breakPointsSizePx[et][adaptiveElementSize.extraLarge]) {
        return adaptiveElementSize.extraLarge
    } else if (sizePx > breakPointsSizePx[et][adaptiveElementSize.large]) {
        return adaptiveElementSize.large
    } else if (sizePx > breakPointsSizePx[et][adaptiveElementSize.medium]) {
        return adaptiveElementSize.medium
    } else if (sizePx > breakPointsSizePx[et][adaptiveElementSize.small]) {
        return adaptiveElementSize.small
    } else {
        return adaptiveElementSize.extraSmall
    }
}