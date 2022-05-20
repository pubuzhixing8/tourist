import { PlaitBoard } from "../interfaces/board";

// record richtext type status
export const IS_TEXT_EDITABLE = new WeakMap<PlaitBoard, boolean>();

export const BOARD_TO_ON_CHANGE = new WeakMap<PlaitBoard, () => void>();