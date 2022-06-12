import { Tree } from './tree';

function moveSubtree(tree: Tree, i: number, distance: number) {
    // Move subtree by changing mod.
    tree.c[i].mod += distance;
    tree.c[i].msel += distance;
    tree.c[i].mser += distance;
}

function nextLeftContour(tree: Tree) {
    return tree.cs === 0 ? tree : tree.c[0];
}

function nextRightContour(tree: Tree) {
    return tree.cs === 0 ? tree : tree.c[tree.cs - 1];
}

function seperate(tree: Tree, i: number) {
    let sr = tree.c[i - 1];
    let cl = tree.c[i];

    while (sr.cs > 0 || cl.cs > 0) {
        sr = nextRightContour(sr);
        cl = nextLeftContour(cl);
    }

    const distance = sr.mod + sr.prelim + sr.w - (cl.mod + cl.prelim);
    if (distance > 0) {
        moveSubtree(tree, i, distance);
    }
}

function positionRoot(tree: Tree) {
    // Position root between children, taking into account their mod.
    tree.prelim =
        (tree.c[0].prelim + tree.c[0].mod + tree.c[tree.cs - 1].mod + tree.c[tree.cs - 1].prelim + tree.c[tree.cs - 1].w) / 2 - tree.w / 2;
}

function firstWalk(tree: Tree) {
    if (tree.cs === 0) {
        return;
    }
    firstWalk(tree.c[0]);
    for (let i = 1; i < tree.cs; i++) {
        firstWalk(tree.c[i]);
        seperate(tree, i);
    }
    positionRoot(tree);
}

function secondWalk(tree: Tree, modsum: number) {
    modsum += tree.mod;
    // Set absolute (no-relative) horizontal coordinates.
    tree.x = tree.prelim + modsum;
    for (let i = 0; i < tree.cs; i++) {
        secondWalk(tree.c[i], modsum);
    }
}

function layout(tree: Tree) {
    firstWalk(tree);
    secondWalk(tree, 0);
}

export { layout };
