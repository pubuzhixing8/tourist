import { Operation } from "../interfaces/operation";
import { Paper } from "../interfaces/paper";

export interface HistoryPaper extends Paper {
    undos: Operation[][];
    redos: Operation[][];
    undo: () => void;
    redo: () => void;
}

export const historyPaper = (paper: Paper) => {
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
        if (Operation.isSetViewportOperation(op)) {
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
