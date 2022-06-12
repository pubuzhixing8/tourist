import { layout } from "./non-layerd-tidy-tree-layout";
import { Marshall } from "./testing/marshall";
import { TreeNode } from "./testing/tree-node";

describe('TinyTreeLayoutsService', () => {
    it('should be created', () => {
        const c1 = new TreeNode(10, 30);
        const c2 = new TreeNode(20, 10);
        const root = new TreeNode(40, 10);
        root.addChild(c1);
        root.addChild(c2);
        const tree = Marshall.convert(root);
        layout(tree);

        Marshall.convertBack(tree, root);
        expect(root).toEqual(jasmine.objectContaining({ x: -5, y: 0 }));
        expect(c1).toEqual(jasmine.objectContaining({ x: 0, y: 10 }));
        expect(c2).toEqual(jasmine.objectContaining({ x: 10, y: 10 }));
    });
});
