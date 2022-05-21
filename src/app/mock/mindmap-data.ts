import { MindmapElement } from "mindmap/interfaces/element";
import { PlaitMindmap } from "mindmap/interfaces/mindmap";

const mindmapElement: MindmapElement = {
    id: 'c909a4ed-c9ba-4812-b353-93bf18027f88',
    value: {
        children: [{ text: '脑图调研' }]
    },
    children: [
        {
            id: 'c909a4ed-c9ba-4812-b353-93bf18027f31',
            value: {
                children: [{ text: '富文本' }]
            },
            children: [{
                id: 'c909a4ed-c9ba-4812-b353-93bf18027f33',
                value: {
                    children: [{ text: '布局算法' }]
                },
                children: [],
                width: 64,
                height: 22
            },
            {
                id: 'c909a4ed-c9ba-4812-b353-93bf18027f34',
                value: {
                    children: [{ text: '知名脑图产品' }]
                },
                children: [],
                width: 96,
                height: 22
            },],
            width: 48,
            height: 22
        },
        {
            id: 'c909a4ed-c9ba-4812-b353-93bf18027f32',
            value: {
                children: [{ text: '绘图技术' }]
            },
            children: [],
            width: 64,
            height: 22
        },
        {
            id: 'c909a4ed-c9ba-4812-b353-93bf18027f33',
            value: {
                children: [{ text: '布局算法' }]
            },
            children: [],
            width: 64,
            height: 22
        },
        {
            id: 'c909a4ed-c9ba-4812-b353-93bf18027f34',
            value: {
                children: [{ text: '知名脑图产品' }]
            },
            children: [{
                id: 'c909a4ed-c9ba-4812-b353-93bf18027f33',
                value: {
                    children: [{ text: '布局算法' }]
                },
                children: [],
                width: 64,
                height: 22
            },
            {
                id: 'c909a4ed-c9ba-4812-b353-93bf18027f34',
                value: {
                    children: [{ text: '知名脑图产品' }]
                },
                children: [],
                width: 96,
                height: 22
            },],
            width: 96,
            height: 22
        }
    ],
    width: 64,
    height: 22
};

export const mockMindmapData: PlaitMindmap = {
    root: mindmapElement,
    points: [[500, 500]]
}