import { Paper } from '../interfaces/paper';
import { PAPER_TO_ATTRIBUTES } from './weak-maps';

export function getAttributes(paper: Paper) {
    const fun = PAPER_TO_ATTRIBUTES.get(paper);
    if (!fun) {
        throw new Error('not found attributes');
    }
    return fun();
}

export function appendHostSVGG(paper: Paper, hostSVGG: SVGGElement[] | SVGGElement) {
    if (Array.isArray(hostSVGG)) {
        hostSVGG.forEach(dom => {
            paper.container?.appendChild(dom);
            dom.setAttribute('transform', `translate(${paper.viewport.offsetX} ${paper.viewport.offsetY})`);
        });
    } else {
        paper.container?.appendChild(hostSVGG);
        hostSVGG.setAttribute('transform', `translate(${paper.viewport.offsetX} ${paper.viewport.offsetY})`);
    }
}

export function arrayHostSVGG(hostSVGG: SVGGElement[] | SVGGElement) {
    if (Array.isArray(hostSVGG)) {
        return hostSVGG;
    } else {
        return [hostSVGG];
    }
}

export function destroyHostSVGG(hostSVGG: SVGGElement[]) {
    hostSVGG.forEach(g => g.remove());
    hostSVGG = [];
    return hostSVGG;
}
