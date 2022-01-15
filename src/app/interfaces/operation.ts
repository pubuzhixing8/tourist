import { Point } from "roughjs/bin/geometry";
import { Key } from "../utils/key";
import { Element } from "./element";
import { Selection } from "./selection";

export interface Operation {
    type: 'add' | 'remove' | 'set_selection';
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
    isSetSelectionOperation(value: Operation): value is SetSelectionOperation {
        return value.type === 'set_selection';
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

export interface SetSelectionOperation extends Operation {
    type: 'set_selection';
    data: Selection;
}
