import { Operation } from './operation';

export { Element } from './element';

export interface Paper {
    elements: Element[];
    operations: Operation[];
    undos: Operation[][];
    redos: Operation[][];
    onChange: () => void;
}