export type BeforeInputEvent = Event & {
    inputType: string;
    isComposing: boolean;
    data: string | null;
    dataTransfer: DataTransfer | null;
};