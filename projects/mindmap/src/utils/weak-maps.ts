import { MindmapNodeComponent } from "../components/node/node.component";
import { MindmapNode } from "../interfaces/node";

export const HAS_SELECTED_MINDMAP_NODE: WeakMap<MindmapNode, boolean> = new WeakMap();

export const ELEMENT_GROUP_TO_COMPONENT: WeakMap<SVGGElement, MindmapNodeComponent> = new WeakMap();

export const MINDMAP_NODE_TO_COMPONENT: WeakMap<MindmapNode, MindmapNodeComponent> = new WeakMap();