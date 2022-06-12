import { layout } from './algorithms/non-layerd-tidy-tree-layout';
import { layout as mindLayout } from './algorithms/non-overlapping-tree-layout';
import { Tree } from './algorithms/tree';
import { LayoutOptions, OriginNode } from './types';
import { Node } from './hierarchy/node';
import { wrap } from './hierarchy/wrap';

export class Layout {
    constructor() {}

    /**
     * Layout treeData.
     * Return modified treeData and the bounding box encompassing all the nodes.
     *
     * See getSize() for more explanation.
     */
    static layout(treeData: OriginNode, options: LayoutOptions) {
        const isHorizontal = true;
        const root = new Node(treeData, options);
        Layout.convert(root, isHorizontal);
        const tree = wrap(root, isHorizontal);
        mindLayout(tree);
        Layout.convertBack(tree, root, isHorizontal);
        return root;
    }

    // /**
    //  * Returns Tree to layout, with bounding boxes added to each node.
    //  */
    // static convert(treeData: any, y = 0, options: LayoutOptions): Tree {
    //     // if (treeData === null) return null;

    //     const { width, height } = this.boundingBox.addBoundingBox(treeData.width, treeData.height);
    //     let children = [];
    //     if (treeData.children && treeData.children.length) {
    //         for (let i = 0; i < treeData.children.length; i++) {
    //             children[i] = this.convert(treeData.children[i], y + height);
    //         }
    //     }

    //     return new Tree(width, height, y, children, treeData);
    // }

    static convert(node: Node, isHorizontal: boolean, d = 0) {
        if (isHorizontal) {
            node.x = d;
            d += node.width;
        } else {
            node.y = d;
            d += node.height;
        }
        node.children.forEach(child => {
            Layout.convert(child, isHorizontal, d);
        });
    }

    static convertBack(tree: Tree, root: Node, isHorizontal: Boolean) {
        if (isHorizontal) {
            root.y = tree.x;
        } else {
            root.x = tree.x;
        }
        tree.c.forEach((child, i) => {
            Layout.convertBack(child, root.children[i], isHorizontal);
        });
    }
}
