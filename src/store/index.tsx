import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the Object3DData type
type Object3DData = {
    id: string;
    boundary: Array<Array<number>>;
    color: string;
    position: Array<number>;
}

// Define the store type
type Store = {
    objects: Array<Object3DData>;
    addPoint: (id: string) => void;
    updatePoint: (id: string, index: number, point: Point) => void;
    updatePosition: (id: string, index: number, point: Point) => void;
}

const defaultObjects = [
    {
        id: "obj1",
        "boundary": [
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ],
        color: "blue",
        // position: [-2, 1, -1]
        position: [0,1,0]
    },
    // {
    //     id: "pyramid",
    //     boundary: [
    //         [0, 1, 0],  // Top Vertex
    //         [-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]
    //     ],
    //     color: "red",
    //     position: [2, 1, 0]
    // },
    // {
    //     id: "hexagonal_prism",
    //     boundary: [
    //         [1, 0, -1], [0.5, 1, -1], [-0.5, 1, -1], [-1, 0, -1], [-0.5, -1, -1], [0.5, -1, -1],
    //         [1, 0, 1], [0.5, 1, 1], [-0.5, 1, 1], [-1, 0, 1], [-0.5, -1, 1], [0.5, -1, 1]
    //     ],
    //     color: "green",
    //     position: [0, 1, 2]
    // }
]

// Create the Zustand store
const store = ((set) => ({
    objects: defaultObjects,
    addPoint: (id) =>
        set((state) => ({
            objects: state.objects.map((obj) =>
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
    updatePoint: (id, index, point) =>
        set((state) => ({
            objects: state.objects.map((obj) =>
                obj.id === id
                    ? {
                        ...obj,
                        boundary: obj.boundary.map((p, i) => (i === index ? point : p)),
                    }
                    : obj
            ),
        })),
    updatePosition: (id, point) =>
        set((state) => ({
            objects: state.objects.map((obj) =>
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