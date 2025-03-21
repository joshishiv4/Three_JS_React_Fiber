import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
        position: [-2, 1, -1]
    },
    {
        id: "pyramid",
        boundary: [
            [0, 1, 0],
            [-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]
        ],
        color: "red",
        position: [2, 1, 0]
    },
    {
        id: "hexagonal_prism",
        boundary: [
            [1, 0, -1], [0.5, 1, -1], [-0.5, 1, -1], [-1, 0, -1], [-0.5, -1, -1], [0.5, -1, -1],
            [1, 0, 1], [0.5, 1, 1], [-0.5, 1, 1], [-1, 0, 1], [-0.5, -1, 1], [0.5, -1, 1]
        ],
        color: "green",
        position: [0, 1, 2]
    }
];

// Create the Zustand store
const store = ((set:any) => ({
    objects: defaultObjects,
    addPoint: (id: string) =>
        set((state: Store) => ({
            objects: state.objects.map((obj: Object3DData) =>
                obj.id === id
                    ? {
                        ...obj,
                        boundary: [
                            ...obj.boundary,
                            [Math.random() * 2 - 1, Math.random() * 2 - 1, 0],
                        ],
                    }
                    : obj
            ),
        })),
    updatePoint: (id: string, index: number, point: Point) =>
        set((state: Store) => ({
            objects: state.objects.map((obj: Object3DData) =>
                obj.id === id
                    ? {
                        ...obj,
                        boundary: obj.boundary.map((p, i) => (i === index ? point : p)),
                    }
                    : obj
            ),
        })),
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