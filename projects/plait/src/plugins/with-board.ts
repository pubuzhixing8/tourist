import { PlaitBoard } from "../interfaces/board";

export function createBoard(): PlaitBoard {
    return {
        children: [],
        viewport: {
            offsetX: 0,
            offsetY: 0,
            zoom: 1,
            viewBackgroundColor: '#000'
        }
    }
}