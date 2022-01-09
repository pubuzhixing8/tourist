import { Point } from "roughjs/bin/geometry";
import { Key } from "../utils/key";
import { Element } from "./element";

export interface Operation {
    type: 'add' | 'remove';
}

export interface AddOperation extends Operation {
    type: 'add';
    data: Element;
}

export const Operation =  {
    isAddOperation(value: Operation): value is AddOperation {
        return value.type === 'add';
    },
    isRemoveOperation(value: Operation): value is RemoveOperation {
        return value.type === 'remove';
    },
    reverse(value: Operation): Operation {
        if (Operation.isAddOperation(value)) {
            return { ...value, type: 'remove' };
        }
        if (Operation.isRemoveOperation(value)) {
            return { ...value, type: 'add' };
        }
        return value;
    }
}

export interface RemoveOperation extends Operation {
    type: 'remove';
    data: Element;
}
