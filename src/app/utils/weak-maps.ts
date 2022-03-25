import { PlaitBaseElement } from "../base/element-base";
import { Element } from "../interfaces/element";
import { Paper } from "../interfaces/paper";

export const ELEMENT_TO_COMPONENTS = new WeakMap<Element, PlaitBaseElement>();

// record richtext type status
export const IS_TEXT_EDITABLE = new WeakMap<Paper, boolean>();