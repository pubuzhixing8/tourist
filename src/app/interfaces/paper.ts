import { Element } from './element';
import { AddOperation, Operation, RemoveOperation, SetSelectionOperation } from './operation';
import { Selection } from './selection';

export interface Paper {
    elements: Element[];
    operations: Operation[];
    onChange: () => void;
    apply: (operation: Operation) => void;
    selection: Selection;
}

export function createPaper(): Paper {
    const paper: Paper = {
        elements: [],
        operations: [],
        selection: { anchor: [-1, -1], focus: [-1, -1] },
        onChange: () => {

        },
        apply: (operation: Operation) => {
            if (Operation.isAddOperation(operation)) {
                paper.elements.push(operation.data);
            } else if (Operation.isRemoveOperation(operation)) {
                const index = paper.elements.findIndex((element) => element.key === operation.data.key);
                paper.elements.splice(index, 1);
            } else if (Operation.isSetSelectionOperation(operation)) {
                paper.selection = operation.data;
            }
            paper.operations.push(operation);
            Promise.resolve().then(() => {
                if (paper.operations.length === 1) {
                    paper.onChange();
                }
                paper.operations = [];
            });
        }
    };
    return paper;
}

export interface HistoryPaper extends Paper {
    undos: Operation[][];
    redos: Operation[][];
    undo: () => void;
    redo: () => void;
}

export const HistoryPaper = (paper: Paper) => {
    const historyPaper = paper as HistoryPaper;
    const { apply } = paper;
    historyPaper.undos = [];
    historyPaper.redos = [];
    let isUndoing = false;
    let isRedoing = false;

    historyPaper.apply = (op) => {
        apply(op);
        if (isUndoing || isRedoing) {
            return;
        }
        if (Operation.isSetSelectionOperation(op)) {
            return;
        }
        historyPaper.undos.push([Operation.reverse(op)]);
    }

    historyPaper.undo = () => {
        isUndoing = true;
        const operations = historyPaper.undos.pop();
        if (operations && operations.length > 0) {
            operations.forEach((op) => {
                paper.apply(op);
            });
        }
        if (operations) {
            historyPaper.redos.push(operations.map((op) => Operation.reverse(op)));
        }
        isUndoing = false;
    }

    historyPaper.redo = () => {
        isUndoing = true;
        const operations = historyPaper.redos.pop();
        if (operations && operations.length > 0) {
            operations.forEach((op) => {
                paper.apply(op);
            });
        }
        if (operations) {
            historyPaper.undos.push(operations.map((op) => Operation.reverse(op)));
        }
        isUndoing = false;
    }
    return historyPaper;
}

export function addLinearPath(paper: Paper, element: Element) {
    const operation: AddOperation = { type: 'add', data: element };
    paper.apply(operation);
}

export function removeLinearPath(paper: Paper, element: Element) {
    const operation: RemoveOperation = { type: 'remove', data: element };
    paper.apply(operation);
}

export function setSelection(paper: Paper, selection: Selection) {
    const operation: SetSelectionOperation = { type: 'set_selection', data: selection };
    paper.apply(operation);
}