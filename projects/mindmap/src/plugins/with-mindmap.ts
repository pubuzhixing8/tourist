import { isPlaitMindmap } from "../interfaces/mindmap";
import { PlaitBoard } from "plait/interfaces/board";
import { PlaitElementContext } from "plait/interfaces/element-context";
import { PlaitPlugin } from "plait/interfaces/plugin";
import { PlaitMindmapComponent } from "../mindmap.component";

export const withMindmap: PlaitPlugin = (board: PlaitBoard) => {
    const { drawElement } = board;

    board.drawElement = (context: PlaitElementContext) => {
        const { element, selection, viewContainerRef, host } = context.elementInstance;
        if (isPlaitMindmap(element)) {
            const mindmapComponentRef = viewContainerRef.createComponent(PlaitMindmapComponent);
            const mindmapInstance = mindmapComponentRef.instance;
            mindmapInstance.value = element;
            mindmapInstance.selection = selection;
            mindmapInstance.host = host;
            return [mindmapInstance.mindmapGGroup];
        }
        return drawElement(context);
    }

    return board;
}