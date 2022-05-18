import { PlaitElement } from "./element";

export interface PlaitBoard {
    children: PlaitElement[];
    viewport: Viewport;
}

export type Viewport = {
    offsetX: number;
    offsetY: number;
    zoom: number;
    viewBackgroundColor: string | null;
};