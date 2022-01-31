import Comparator from "../../../utils/comparator/Comparator";
import { BinaryTreeNode } from "../binary-tree-node";

export class BinarySearchTreeNode extends BinaryTreeNode {
    compareFunction: any;
    nodeValueComparator: Comparator;
    constructor(value = null, compareFunction = undefined) {
        super(value);
        this.compareFunction = compareFunction;
        this.nodeValueComparator = new Comparator(compareFunction);
    }

    insert(value: any): BinarySearchTreeNode {
        if (this.nodeValueComparator.equal(value, null)) {
            this.value = value;

            return this;
        }

        if (this.nodeValueComparator.lessThan(value, this.value)) {
            if (this.left) {
                return (this.left as BinarySearchTreeNode).insert(value);
            }

            const newNode = new BinarySearchTreeNode(value, this.compareFunction);
            this.setLeft(newNode);

            return newNode;
        }

        if (this.nodeValueComparator.greaterThan(value, this.value)) {
            if (this.right) {
                return (this.right as BinarySearchTreeNode).insert(value);
            }

            const newNode = new BinarySearchTreeNode(value, this.compareFunction);
            this.setRight(newNode);

            return newNode;
        }

        return this;
    }
}