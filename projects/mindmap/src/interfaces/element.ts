import { Element } from "slate";

export interface MindmapElement {
    id: string,
    value: Element,
    children: MindmapElement[],
    isRoot?: boolean,
    width: number,
    height: number
}

export function addMindmapElement(root: MindmapElement, parent: MindmapElement) {
    const newElement = {
        id: 'c909a4ed-c9ba-4812-b353-93bf18027f33',
        value: {
            children: [{ text: '新节点' }]
        },
        children: [],
        width: 48,
        height: 22
    };
    parent.children.push(newElement);
    return root;
}

export function removeMindmapElement(root: MindmapElement, current: MindmapElement) {
    const parent = getMindmapElementParent(root, current);
    if (parent) {
        parent.children.splice(parent.children.indexOf(current), 1);
    }
    return root;
}

export function getMindmapElementParent(root: MindmapElement, origin: MindmapElement): MindmapElement | null {
    const isParent = root.children.includes(origin);
    if (isParent) {
        return root;
    } else {
        for (let index = 0; index < root.children.length; index++) {
            const element = root.children[index];
            const parent = getMindmapElementParent(element, origin);
            if (parent) {
                return parent;
            }
        }
    }
    return null;
}