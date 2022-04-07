import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Point } from 'roughjs/bin/geometry';
import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';
import { fromEvent } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { isHotkey } from 'is-hotkey';
import Hotkeys from '../utils/hotkeys';
import { createPaper, Paper, setSelection } from '../interfaces/paper';
import { Element } from '../interfaces/element';
import { Attributes, EdgeMode } from '../interfaces/attributes';
import { Operation } from '../interfaces/operation';
import { HistoryPaper, historyPaper } from '../plugins/history';
import { commonPaper } from '../plugins/common';
import { PointerType } from '../interfaces/pointer';
import { Selection } from '../interfaces/selection';
import { ELEMENT_TO_NODE, IS_FOCUSED } from 'richtext';
import { Editor } from 'slate';
import { PAPER_TO_ATTRIBUTES, PAPER_TO_ROUGHSVG } from '../utils/weak-maps';
import { getRoughSVG } from '../utils/rough';
import { circlePaper } from '../plugins/circle';
import { likeLinePaper } from '../plugins/like-line';
import { textPaper } from '../plugins/text';
import { OnChangeEvent } from 'richtext/interface/event';
import { selectionPager } from '../plugins/selection';

export const LOCALSTORAGE_PAPER_DATA_KEY = 'paper-data';

@Component({
    selector: 'plait-white-board',
    templateUrl: './white-board.component.html'
})
export class PlaitWhiteBoardComponent implements OnInit {
    title = 'tourist';
    container: SVGSVGElement = {} as any;

    @ViewChild('SVG', { static: true })
    SVG: ElementRef | undefined;

    get roughSVG(): RoughSVG {
        return getRoughSVG(this.paper as Paper);
    }

    paper: HistoryPaper | undefined;

    attributes: Attributes = { stroke: '#000000', strokeWidth: 1, edgeMode: EdgeMode.sharp };

    pointerType = PointerType;

    value = {
        type: 'p', children: [{
            text: 'richtext'
        }]
    };

    ngOnInit(): void {
        this.container = this.SVG?.nativeElement;
        const roughSVG = rough.svg(this.container, { options: { roughness: 0, strokeWidth: 1 } });
        const paper = selectionPager(textPaper(likeLinePaper(circlePaper(commonPaper(historyPaper(createPaper()))))));
        PAPER_TO_ROUGHSVG.set(paper, roughSVG);
        PAPER_TO_ATTRIBUTES.set(paper, () => {
            return this.attributes;
        });

        this.paper = paper;
        this.initializePen(this.roughSVG, paper);
        this.useCursor();
        const onChange = paper?.onChange;
        paper.onChange = () => {
            onChange();
            console.log(paper.operations, 'operations');
            console.log(paper.elements, 'elements');
            localStorage.setItem(LOCALSTORAGE_PAPER_DATA_KEY, JSON.stringify(paper.elements));
            const op = paper.operations.filter((op: any) => Operation.isSetSelectionOperation(op));
            if (op && this.paper) {
                const elements = [...this.paper.elements];
                // const ele = elements.find((value) => {
                //   const isSelected = Element.isIntersected(value, paper.selection);
                //   return isSelected;
                // });
                // if (ele && ele.stroke && ele.strokeWidth) {
                //   const strokeWidth = ele.strokeWidth;
                //   this.attributes.stroke = ele.stroke;
                //   this.attributes.strokeWidth = strokeWidth;
                // }
            }
        }
        this.paper.container = this.container;

        // 加载本地存储数据
        const els = localStorage.getItem(LOCALSTORAGE_PAPER_DATA_KEY);
        if (els) {
            paper.elements = JSON.parse(els);
        }
    }

    onChange(event: OnChangeEvent) {
        // console.log(event.value, 'value');
        // console.log(event.operations, 'operations');
    }

    initializePen(rc: RoughSVG, paper: HistoryPaper) {
        // mousedown、mousemove、mouseup
        let context: PenContext = { points: [], isDrawing: false, isReadying: false, rc };
        fromEvent<MouseEvent>(this.container as SVGElement, 'mousedown').pipe(
            tap((event) => {
                paper.mousedown(event);
            })
        ).subscribe({
            next: (event: MouseEvent) => {
            }
        });
        fromEvent<MouseEvent>(this.container as SVGElement, 'mousemove').pipe(
            tap((event) => {
                paper.mousemove(event);
            })
        ).subscribe((event: MouseEvent) => {
        });
        fromEvent<MouseEvent>(document, 'mouseup').pipe(
            tap((event) => {
                paper.mouseup(event);
            })
        ).subscribe((event: MouseEvent) => {
        });
        fromEvent<KeyboardEvent>(document, 'keydown').pipe(
            filter((event: KeyboardEvent) => {
                if (event.target instanceof HTMLElement) {
                    const richtext = event.target.closest<HTMLElement>(`.plait-richtext-container`);
                    if (richtext) {
                        const editor = ELEMENT_TO_NODE.get(richtext);
                        if (editor && Editor.isEditor(editor)) {
                            const isFocused = IS_FOCUSED.get(editor);
                            if (isFocused) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            })
        ).subscribe((event: KeyboardEvent) => {
            this.paper?.keydown(event);
            if (isHotkey('mod+a', event)) {
                const rect = this.container.getBoundingClientRect();
                const selection: Selection = { anchor: [0, 0], focus: [rect.width, rect.height] };
                setSelection(paper, selection);
                paper.pointer = PointerType.pointer;
                event.stopPropagation();
                event.preventDefault();
            }
            if (Hotkeys.isUndo(event)) {
                paper.undo();
            }
            if (Hotkeys.isRedo(event)) {
                paper.redo();
            }
        });
        fromEvent<KeyboardEvent>(document, 'keyup').pipe(
        ).subscribe((event: KeyboardEvent) => {
            this.paper?.keyup(event);
        });
        fromEvent<MouseEvent>(this.container as SVGElement, 'dblclick').pipe().subscribe((event: MouseEvent) => {
            this.paper?.dblclick(event);
        });
    }

    attributesChange(attributes: Attributes) {
        const paper = this.paper as HistoryPaper;
        if (paper.pointer === PointerType.pointer) {
            const elements = [...paper.elements];
            // elements.forEach((value) => {
            //   const isSelected = Element.isIntersected(value, paper.selection);
            //   if (isSelected) {
            //     setElement(paper, value, attributes);
            //   }
            // });
        }
    }

    startDraw() {
        console.log('---start draw---')
    }

    endDraw() {
        console.log('---end draw---')
    }

    drawing(context: PenContext) {

    }

    usePointer(event: MouseEvent, pointer: PointerType) {
        event.preventDefault();
        if (this.paper) {
            this.paper.pointer = pointer;
            this.useCursor();
        }
    }

    useCursor() {
        if (this.paper && this.paper.pointer === PointerType.pointer) {
            this.container.classList.add('pointer');
        } else {
            this.container.classList.remove('pointer');
        }
    }

    trackBy = (index: number, node: Element) => {
        return node.key;
    }
}

export interface PenContext {
    isReadying: boolean;
    isDrawing: boolean;
    points: Point[];
    rc: RoughSVG;
    svg?: SVGGElement;
};

export interface PenElement {
    points: Point[];
    lineSvg: SVGGElement;
    rectSvg?: SVGGElement;
}

export interface Page {
    selection: Selection,
    elements: PenElement[],
}

export const Page = {
    setSelection(page: Page, selection: Selection) {
        page.selection = selection;
    }
}