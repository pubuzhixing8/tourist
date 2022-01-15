export interface Selection {
    anchor: [number, number];
    focus: [number, number];
}

export const Selection = {
    interaction: (first: Selection, second: Selection) => {
        const xArray = [first.anchor[0], first.focus[0], second.anchor[0], second.focus[0]];
        const yArray = [first.anchor[1], first.focus[1], second.anchor[1], second.focus[1]];
        const xMin = Math.min(...xArray);
        const xMax = Math.max(...xArray);
        const yMin = Math.min(...yArray);
        const yMax = Math.max(...yArray);
        const firstWidth = Selection.width(first);
        const firstHeight = Selection.height(first);
        const secondWidth = Selection.width(second);
        const secondHeight = Selection.height(second);
        const xWidth = (firstWidth + secondWidth) - (xMax - xMin);
        const yHeight = (firstHeight + secondHeight) - (yMax - yMin);
        if (xWidth > 0 && yHeight > 0) {
            return true;
        } else {
            return false;
        }
    },
    isBackward: (selection: Selection) => {
        if (selection.anchor[0] > selection.focus[0]) {
            return true;
        } else {
            return false;
        }
    },
    width: (selection: Selection) => {
        return Math.abs(selection.anchor[0] - selection.focus[0]);
    },
    height: (selection: Selection) => {
        return Math.abs(selection.anchor[1] - selection.focus[1]);
    }
}