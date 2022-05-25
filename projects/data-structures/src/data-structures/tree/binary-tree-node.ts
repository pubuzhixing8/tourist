import Comparator from '../../utils/comparator/Comparator';

export class BinaryTreeNode {
    left: BinaryTreeNode | null = null;
    right: BinaryTreeNode | null = null;
    parent: BinaryTreeNode | null = null;
    value: any = null;
    nodeComparator!: Comparator;
    constructor(value: any = null) {
        this.value = value;
        this.nodeComparator = new Comparator();
    }

    get leftHeight() {
        if (!this.left) {
            return 0;
        }
        return this.left.height + 1;
    }

    get rightHeight() {
        if (!this.right) {
            return 0;
        }
        return this.right.height + 1;
    }

    get height(): number {
        return Math.max(this.leftHeight, this.rightHeight);
    }

    setLeft(node: BinaryTreeNode | null) {
        if (this.left) {
            this.left.parent = null;
        }

        this.left = node;

        if (this.left) {
            this.left.parent = this;
        }
    }

    setRight(node: BinaryTreeNode | null) {
        if (this.right) {
            this.right.parent = null;
        }

        this.right = node;

        if (this.right) {
            this.right.parent = this;
        }
    }

    setValue(value: any) {
        this.value = value;
    }

    removeChild(nodeToRemove: BinaryTreeNode) {
        if (this.left && this.nodeComparator.equal(this.left, nodeToRemove)) {
            this.left = null;
            return true;
        }

        if (this.right && this.nodeComparator.equal(this.right, nodeToRemove)) {
            this.right = null;
            return true;
        }

        return false;
    }

    replaceChild(nodeToReplace: BinaryTreeNode | null, replacementNode: BinaryTreeNode | null) {
        if (!nodeToReplace || !replacementNode) {
            return false;
        }

        if (this.left && this.nodeComparator.equal(this.left, nodeToReplace)) {
            this.left = replacementNode;
            return true;
        }

        if (this.right && this.nodeComparator.equal(this.right, nodeToReplace)) {
            this.right = replacementNode;
            return true;
        }

        return false;
    }

    traverseInOrder() {
        let traverse: any[] = [];

        if (this.left) {
            traverse = traverse.concat(this.left.traverseInOrder());
        }

        traverse.push(this.value);

        if (this.right) {
            traverse = traverse.concat(this.right.traverseInOrder());
        }

        return traverse;
    }

    toString() {
        return this.traverseInOrder().toString();
    }
}
