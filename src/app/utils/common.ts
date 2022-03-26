import { Paper } from "../interfaces/paper";
import { PAPER_TO_ATTRIBUTES } from "./weak-maps";

export function getAttributes(paper: Paper) {
    const fun = PAPER_TO_ATTRIBUTES.get(paper);
    if (!fun) {
        throw new Error('not found attributes');
    }
    return fun();
}