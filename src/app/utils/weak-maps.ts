import { RoughSVG } from "roughjs/bin/svg";
import { PlaitBaseElement } from "../base/element-base";
import { Attributes } from "../interfaces/attributes";
import { Element } from "../interfaces/element";
import { Paper } from "../interfaces/paper";

export const ELEMENT_TO_COMPONENTS = new WeakMap<Element, PlaitBaseElement>();

export const PAPER_TO_ROUGHSVG = new WeakMap<Paper, RoughSVG>();

export const PAPER_TO_ATTRIBUTES = new WeakMap<Paper, ()=> Attributes>();

// record richtext type status
export const IS_TEXT_EDITABLE = new WeakMap<Paper, boolean>();