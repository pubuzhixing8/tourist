import { PlaitMindmap } from '../interfaces/mindmap';
import { MindmapNodeComponent } from '../components/node/node.component';
import { PlaitMindmapComponent } from '../mindmap.component';
import { PlaitBoard } from 'plait/interfaces/board';
import { MindmapElement } from '../interfaces/element';

export const HAS_SELECTED_MINDMAP_ELEMENT: WeakMap<MindmapElement, boolean> = new WeakMap();

export const HAS_SELECTED_MINDMAP: WeakMap<PlaitBoard, PlaitMindmap> = new WeakMap();

export const ELEMENT_GROUP_TO_COMPONENT: WeakMap<SVGGElement, MindmapNodeComponent> = new WeakMap();

export const MINDMAP_ELEMENT_TO_COMPONENT: WeakMap<MindmapElement, MindmapNodeComponent> = new WeakMap();

export const MINDMAP_TO_COMPONENT: WeakMap<PlaitMindmap, PlaitMindmapComponent> = new WeakMap();
