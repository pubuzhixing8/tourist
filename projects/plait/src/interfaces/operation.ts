import { Selection } from "./selection";
import { Viewport } from "./viewport";

export type SetViewportOperation = {
    type: 'set_viewport',
    properties: Partial<Viewport>,
    newProperties: Partial<Viewport>
};

export type SetSelectionOperation = {
    type: 'set_selection',
    properties: Selection | null,
    newProperties: Selection | null
};


export type PlaitOperation = SetViewportOperation | SetSelectionOperation;


const isSetViewportOperation = (value: any): value is SetViewportOperation => {
    return value.type === 'set_viewport';
}
