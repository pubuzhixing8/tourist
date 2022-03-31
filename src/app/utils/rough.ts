import { Paper } from "../interfaces/paper";
import { PAPER_TO_ROUGHSVG } from "./weak-maps";

export function getRoughSVG(paper: Paper) {
    const roughSVG =  PAPER_TO_ROUGHSVG.get(paper);
    if (!roughSVG) {
      throw new Error('undefined roughSVG');
    }
    return roughSVG;
}