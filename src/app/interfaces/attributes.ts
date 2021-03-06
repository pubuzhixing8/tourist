export class Attributes {
    stroke: string = '#0000';
    strokeWidth: number = 1;
    edgeMode: EdgeMode | undefined = EdgeMode.sharp;
}

export enum EdgeMode {
    sharp = 'sharp',
    round = 'round'
}
