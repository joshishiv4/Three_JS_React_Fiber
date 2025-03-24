import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import * as THREE from 'three';
import { ConvexGeometry } from 'three/examples/jsm/Addons.js';

// Define the Object3DData type
type Object3DData = {
    id: string;
    boundary: Array<Point>;
    color: string;
    position: Point;
};

type Point = [number, number, number];

// Define the store type
type Store = {
    objects: Array<Object3DData>;
    addPoint: (id: string) => void;
    updatePoint: (id: string, index: number, point: Point) => void;
    updatePosition: (id: string, point: Point) => void;
    resetObjects: () => void;
};

const defaultObjects: Array<Object3DData> = [
    {
        id: "cube",
        boundary: [
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ],
        color: "blue",
        position: [0,1,0]
        // position: [-2, 1, -1]
    },
    {
        id: "pyramid",
        boundary: [
            [0, 1, 0],
            [-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]
        ],
        color: "pink",
        position: [0,1,0]
        // position: [2, 1, 0]
    },
    {
        id: "hexagonal_prism",
        boundary: [
            [1, 0, -1], [0.5, 1, -1], [-0.5, 1, -1], [-1, 0, -1], [-0.5, -1, -1], [0.5, -1, -1],
            [1, 0, 1], [0.5, 1, 1], [-0.5, 1, 1], [-1, 0, 1], [-0.5, -1, 1], [0.5, -1, 1]
        ],
        color: "green",
        position: [0,1,0]
        // position: [0, 1, 2]
    }
];

// Create the Zustand store
const store = ((set:any) => ({
    objects: defaultObjects,
    addPoint: (id: string) =>
        set((state: Store) => {
            // FIND EDGES OF THE ACTIVE GEOMETRY
            const points = state.objects.find((o) => o.id === id)?.boundary.map((point) => new THREE.Vector3(...point));
            const edgesGeometry = new THREE.EdgesGeometry(new ConvexGeometry(points));
            const edgeVertices = edgesGeometry.getAttribute('position').array;
            const edges = [];
            for (let i = 0; i < edgeVertices.length; i += 6) {
                const v1 = new THREE.Vector3(edgeVertices[i], edgeVertices[i + 1], edgeVertices[i + 2]);
                const v2 = new THREE.Vector3(edgeVertices[i + 3], edgeVertices[i + 4], edgeVertices[i + 5]);
                edges.push([v1, v2]);
            }

            // ADD A RANDOM POINT ON A RANDOM EDGE
            const randomEdge = edges[Math.floor(Math.random() * edges.length)];
            const randomPoint = randomEdge[0].clone().lerp(randomEdge[1], Math.random());

            return {
                objects: state.objects.map((obj: Object3DData) =>
                    obj.id === id
                        ? {
                            ...obj,
                            boundary: [
                                ...obj.boundary,
                                randomPoint.toArray(),
                            ],
                        }
                        : obj
                ),
            }
        }),
    updatePoint: (id: string, index: number, point: Point) =>
        set((state: Store) => {
            return {
                objects: state.objects.map((obj: Object3DData) =>
                    obj.id === id
                        ? {
                            ...obj,
                            boundary: obj.boundary.map((p, i) => (i === index ? point : p)),
                        }
                        : obj
                ),
            }
        }),
    updatePosition: (id: string, point: Point) =>
        set((state: Store) => ({
            objects: state.objects.map((obj: Object3DData) =>
                obj.id === id
                    ? {
                        ...obj,
                        position: point
                    }
                    : obj
            ),
        })),
    resetObjects: () => 
        set(() => (
            { objects: defaultObjects }
        ))
}));

const useStore = create<Store>()(
    persist(
        store,
        {
            name: "object3d-store"
        }
    )
);

export default useStore;