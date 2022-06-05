export function Layout(root: { children: [] }) {
    root.children.forEach((child, index) => {
        Layout(child);
        Separate(root.children[index - 1], child);
    });
    // Set position of root
}

export function Separate(leftSiblings: [], currentSubtree: any) {
    // The contour pair is the pair of these two variables.
    // Current right contour node <- root of rightmost sibling;
    // Current left contour node <- root of current subtree
    let rightContourNode = leftSiblings[leftSiblings.length - 1] as any;
    let leftContourNode: any = currentSubtree;
    while(rightContourNode !== null && leftContourNode !== null) {
        const xl = leftContourNode.x;
        const xr = rightContourNode.x + rightContourNode.width;
        if (xl < xr) {
            // Move current subtree to xr - xl to right
        }
        const yl = leftContourNode.y + leftContourNode.height;
        const yr = rightContourNode.y + rightContourNode.height;
        // Coordinate system increases upwards.
        if (yl <= yr) {
            leftContourNode = leftContourNode.next;
        }
        if (yl >= yr) {
            rightContourNode = rightContourNode.next;
        }
    }
    // Merge contours
}