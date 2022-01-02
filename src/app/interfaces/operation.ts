import { Point } from "roughjs/bin/geometry";

export interface Operation {
    type: 'add' | 'remove';
}

export interface AddOperation extends Operation {
    type: 'add';
    data: Point[];
}

export interface RemoveOperation extends Operation {
    type: 'remove';
    key: string;
}
