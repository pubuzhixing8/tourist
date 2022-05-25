import { Operation, Element } from 'slate';

export type BeforeInputEvent = Event & {
    inputType: string;
    isComposing: boolean;
    data: string | null;
    dataTransfer: DataTransfer | null;
};

export interface OnChangeEvent {
    value: Element;
    operations: Operation[];
}
