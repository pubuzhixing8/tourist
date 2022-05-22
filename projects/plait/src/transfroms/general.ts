import { PlaitOperation } from "../interfaces/operation";
import { PlaitBoard } from "../interfaces/board";
import { createDraft, finishDraft, isDraft } from 'immer';
import { Viewport } from '../interfaces/viewport';
import { Selection } from '../interfaces/selection';

export interface GeneralTransforms {
    transform: (board: PlaitBoard, op: PlaitOperation) => void
}

const applyToDraft = (board: PlaitBoard, selection: Selection | null, viewport: Viewport, op: PlaitOperation) => {
    switch (op.type) {
        case 'set_viewport': {
            const { newProperties } = op;
            if (newProperties == null) {
                viewport = newProperties
            } else {
                if (viewport == null) {
                    if (!Viewport.isViewport(newProperties)) {
                        throw new Error(
                            `Cannot apply an incomplete "set_viewport" operation properties ${JSON.stringify(
                                newProperties
                            )} when there is no current viewport.`
                        )
                    }
                    viewport = { ...newProperties }
                }

                for (const key in newProperties) {
                    const value = newProperties[key];

                    if (value == null) {
                        delete viewport[key]
                    } else {
                        viewport[key] = value
                    }
                }
            }
            break;
        }
        case 'set_selection': {
            const { newProperties } = op;
            if (newProperties == null) {
                selection = newProperties
            } else {
                if (selection === null) {
                    selection = op.newProperties;
                } else {
                    selection.anchor = newProperties.anchor;
                    selection.focus = newProperties.focus;
                }
            }
            break;
        }
    }
    return { selection, viewport };
}

export const GeneralTransforms: GeneralTransforms = {
    /**
     * Transform the board by an operation.
     */
    transform(board: PlaitBoard, op: PlaitOperation): void {
        board.children = createDraft(board.children);
        let viewport = board.viewport && createDraft(board.viewport);
        let selection = board.selection && createDraft(board.selection);

        try {
            const state = applyToDraft(board, selection, viewport, op);
            viewport = state.viewport;
            selection = state.selection;
        } finally {
            board.children = finishDraft(board.children)

            if (selection) {
                board.selection = isDraft(selection)
                    ? (finishDraft(selection) as Selection)
                    : selection;
            } else {
                board.selection = null
            }
            board.viewport = isDraft(viewport)
                ? (finishDraft(viewport) as Viewport)
                : viewport;
        }
    },
}
