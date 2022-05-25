import { PlaitBoard } from 'plait/interfaces/board';
import { Element } from 'slate';

export interface MindmapElement {
    id: string;
    value: Element;
    children: MindmapElement[];
    isRoot?: boolean;
    width: number;
    height: number;
}
