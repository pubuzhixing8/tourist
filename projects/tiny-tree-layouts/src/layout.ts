import { BoundingBox } from './bounding-box';
import { layout } from './nod-layerd-tidy-tree-layout';
import { Tree } from './tree';

export class Layout {
    boundingBox: BoundingBox;
    constructor(boundingBox: BoundingBox) {
        this.boundingBox = boundingBox;
    }

    /**
     * Layout treeData.
     * Return modified treeData and the bounding box encompassing all the nodes.
     *
     * See getSize() for more explanation.
     */
    layout(treeData: any) {
        const tree = this.convert(treeData);
        layout(tree);
        const { boundingBox, result } = this.assignLayout(tree, treeData);

        return { result, boundingBox };
    }

    /**
     * Returns Tree to layout, with bounding boxes added to each node.
     */
    convert(treeData: any, y = 0): Tree {
        // if (treeData === null) return null;

        const { width, height } = this.boundingBox.addBoundingBox(treeData.width, treeData.height);
        let children = [];
        if (treeData.children && treeData.children.length) {
            for (let i = 0; i < treeData.children.length; i++) {
                children[i] = this.convert(treeData.children[i], y + height);
            }
        }

        return new Tree(width, height, y, children);
    }

    /**
     * Assign layout tree x, y coordinates back to treeData,
     * with bounding boxes removed.
     */
    assignCoordinates(tree: Tree, treeData: any) {
        const { x, y } = this.boundingBox.removeBoundingBox(tree.x, tree.y);
        treeData.x = x;
        treeData.y = y;
        for (let i = 0; i < tree.c.length; i++) {
            this.assignCoordinates(tree.c[i], treeData.children[i]);
        }
    }

    /**
     * Return the bounding box that encompasses all the nodes.
     * The result has a structure of
     * { left: number, right: number, top: number, bottom: nubmer}.
     * This is not the same bounding box concept as the `BoundingBox` class
     * used to construct `Layout` class.
     */
    getSize(treeData: any, box: any = null) {
        const { x, y, width, height } = treeData;
        if (box === null) {
            box = { left: x, right: x + width, top: y, bottom: y + height };
        }
        box.left = Math.min(box.left, x);
        box.right = Math.max(box.right, x + width);
        box.top = Math.min(box.top, y);
        box.bottom = Math.max(box.bottom, y + height);

        if (treeData.children) {
            for (const child of treeData.children) {
                this.getSize(child, box);
            }
        }

        return box;
    }

    /**
     * This function does assignCoordinates and getSize in one pass.
     */
    assignLayout(tree: Tree, treeData: any, box: any = null) {
        const { x, y } = this.boundingBox.removeBoundingBox(tree.x, tree.y);
        treeData.x = x;
        treeData.y = y;

        const { width, height } = treeData;
        if (box === null) {
            box = { left: x, right: x + width, top: y, bottom: y + height };
        }
        box.left = Math.min(box.left, x);
        box.right = Math.max(box.right, x + width);
        box.top = Math.min(box.top, y);
        box.bottom = Math.max(box.bottom, y + height);

        for (let i = 0; i < tree.c.length; i++) {
            this.assignLayout(tree.c[i], treeData.children[i], box);
        }

        return { result: treeData, boundingBox: box };
    }
}
