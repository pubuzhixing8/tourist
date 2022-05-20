import { isPlaitMindmap } from "../interfaces/mindmap";
import { PlaitBoard } from "plait/interfaces/board";
import { PlaitElementContext } from "plait/interfaces/element-context";
import { PlaitPlugin } from "plait/interfaces/plugin";

const withMindmap: PlaitPlugin = (board: PlaitBoard) => {
    const { drawElement } = board;

    board.drawElement = (context: PlaitElementContext) => {
        const { element, viewContainerRef } = context.elementInstance;
        if (isPlaitMindmap(element)) {
            // viewContainerRef.createComponent()
        }
        return drawElement(context);
    }

    return board;
}