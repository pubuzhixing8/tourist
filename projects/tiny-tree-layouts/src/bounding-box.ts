export class BoundingBox {
    gap: number;
    bottomPadding: number;
    /**
     * @param {number} gap - the gap between sibling nodes
     * @param {number} bottomPadding - the height reserved for connection drawing
     */
    constructor(gap: number, bottomPadding: number) {
        this.gap = gap;
        this.bottomPadding = bottomPadding;
    }

    addBoundingBox(width: number, height: number) {
        return { width: width + this.gap, height: height + this.bottomPadding };
    }

    /**
     * Return the coordinate without the bounding box for a node
     */
    removeBoundingBox(x: number, y: number) {
        return { x: x + this.gap / 2, y };
    }
}
