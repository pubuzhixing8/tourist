import { PlaitMindmap } from 'mindmap/interfaces/mindmap';

export const mockMindmapData: PlaitMindmap = {
    type: 'mindmap',
    id: 'c909a4ed-c9ba-4812-b353-93bf18027f88',
    value: {
        children: [{ text: '0' }]
    },
    children: [
        {
            id: 'c909a4ed-c9ba-4812-b353-93bf18027f32',
            value: {
                children: [{ text: '2' }]
            },
            children: [],
            width: 64,
            height: 22
        },
        {
            id: 'c909a4ed-c9ba-4812-b353-93bf18027f33',
            value: {
                children: [{ text: '3' }]
            },
            children: [
                {
                    id: 'c909a4ed-c9ba-4812-b353-93bf18027f34',
                    value: {
                        children: [{ text: '4' }]
                    },
                    children: [
                    ],
                    width: 96,
                    height: 22
                },
                {
                    id: 'c909a4ed-c9ba-4812-b353-93bf18027f34',
                    value: {
                        children: [{ text: '5' }]
                    },
                    children: [],
                    width: 96,
                    height: 22
                },
                {
                    id: 'c909a4ed-c9ba-4812-b353-93bf18027f34',
                    value: {
                        children: [{ text: '6' }]
                    },
                    children: [],
                    width: 96,
                    height: 22
                }
            ],
            width: 64,
            height: 22
        }
    ],
    width: 64,
    height: 22,
    isRoot: true,
    points: [[360, 280]]
};
