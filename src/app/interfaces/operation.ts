import { Point } from 'roughjs/bin/geometry';
import { Key } from '../utils/key';
import { Element } from './element';
import { Viewport } from './paper';
import { Selection } from './selection';

export interface Operation {
    type: 'add' | 'remove' | 'set_selection' | 'set_element' | 'set_viewport';
}

export interface AddOperation extends Operation {
    type: 'add';
    data: Element;
}

export const Operation = {
    isAddOperation(value: Operation): value is AddOperation {
        return value.type === 'add';
    },
    isRemoveOperation(value: Operation): value is RemoveOperation {
        return value.type === 'remove';
    },
    isSetSelectionOperation(value: Operation): value is SetSelectionOperation {
        return value.type === 'set_selection';
    },
    isSetViewportOperation(value: Operation): value is SetViewportOperation {
        return value.type === 'set_viewport';
    },
    isSetElementOperation(value: Operation): value is SetElementOperation {
        return value.type === 'set_element';
    },
    reverse(value: Operation): Operation {
        if (Operation.isAddOperation(value)) {
            return { ...value, type: 'remove' };
        }
        if (Operation.isRemoveOperation(value)) {
            return { ...value, type: 'add' };
        }
        if (Operation.isSetElementOperation(value)) {
            return { ...value, properties: value.newProperties, newProperties: value.properties } as SetElementOperation;
        }
        return value;
    }
};

export interface RemoveOperation extends Operation {
    type: 'remove';
    data: Element;
}

export interface SetSelectionOperation extends Operation {
    type: 'set_selection';
    data: Selection;
}

export interface SetViewportOperation extends Operation {
    type: 'set_viewport';
    data: Viewport;
}

export interface SetElementOperation extends Operation {
    type: 'set_element';
    properties: Partial<Element>;
    newProperties: Partial<Element>;
    data: Element;
}
