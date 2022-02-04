import { Paper } from "../interfaces/paper";

export function resizePaper<T extends Paper>(paper: T) {
    const { mousedown, mousemove, mouseup } = paper;

    paper.mousedown = (event: MouseEvent) => {

        mousedown(event);
    }

    paper.mousemove = (event: MouseEvent) => {

        mousemove(event);
    }

    paper.mouseup = (event: MouseEvent) => {

        mouseup(event);
    }

    return paper;
}