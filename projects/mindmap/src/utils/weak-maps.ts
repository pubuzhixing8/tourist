import { PlaitMindmap } from "../interfaces/mindmap";
import { MindmapNodeComponent } from "../components/node/node.component";
import { MindmapNode } from "../interfaces/node";
import { PlaitMindmapComponent } from "../mindmap.component";
import { PlaitBoard } from "plait/interfaces/board";

export const HAS_SELECTED_MINDMAP_NODE: WeakMap<MindmapNode, boolean> = new WeakMap();

export const HAS_SELECTED_MINDMAP: WeakMap<PlaitBoard, PlaitMindmap> = new WeakMap();

export const ELEMENT_GROUP_TO_COMPONENT: WeakMap<SVGGElement, MindmapNodeComponent> = new WeakMap();

export const MINDMAP_NODE_TO_COMPONENT: WeakMap<MindmapNode, MindmapNodeComponent> = new WeakMap();

export const MINDMAP_TO_COMPONENT: WeakMap<PlaitMindmap, PlaitMindmapComponent> = new WeakMap();