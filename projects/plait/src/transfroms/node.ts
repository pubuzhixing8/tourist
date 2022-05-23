import { InsertNodeOperation } from "../interfaces/operation";
import { PlaitBoard } from "../interfaces/board";
import { PlaitNode } from "../interfaces/node";
import { Path } from "../interfaces/path";

export function insertNode(board: PlaitBoard, node: PlaitNode, path: Path) {
    const operation: InsertNodeOperation = { type: 'insert_node', node, path };
    board.apply(operation);
}

export interface NodeTransforms {
    insertNode: (board: PlaitBoard, node: PlaitNode, path: Path) => void;
}

export const NodeTransforms: NodeTransforms = {
    insertNode
}