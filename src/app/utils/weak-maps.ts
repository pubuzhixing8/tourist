import { ComponentRef } from "@angular/core";
import { PlaitRichtextComponent } from "richtext";
import { RoughSVG } from "roughjs/bin/svg";
import { PlaitBaseElement } from "../base/element-base";
import { Attributes } from "../interfaces/attributes";
import { Element } from "../interfaces/element";
import { Paper } from "../interfaces/paper";

export const ELEMENT_TO_COMPONENTS = new WeakMap<Element, PlaitBaseElement>();

export const HOSTSVGG_TO_ELEMENT = new WeakMap<SVGGElement, Element>();

export const HOSTSVGG_TO_RICHTEXT_REF = new WeakMap<SVGGElement, ComponentRef<PlaitRichtextComponent>>();

export const PAPER_TO_ROUGHSVG = new WeakMap<Paper, RoughSVG>();

export const PAPER_TO_ATTRIBUTES = new WeakMap<Paper, ()=> Attributes>();

export const IS_TEXT_EDITABLE = new WeakMap<Paper, boolean>();