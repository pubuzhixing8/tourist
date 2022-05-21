import { Viewport } from "./viewport";

export type SetViewportOperation = {
    type: 'set_viewport',
    properties: Partial<Viewport>,
    newProperties: Partial<Viewport>
};

export type PlaitOperation = SetViewportOperation;


const isSetViewportOperation = (value: any): value is SetViewportOperation => {
    return value.type === 'set_viewport';
}
