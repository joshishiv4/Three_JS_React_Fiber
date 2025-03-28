import React, { useRef, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Object3DComponent from "../molecule/Object3DComponent";

// Store
import useStore from "../../store";
import { TransformProvider } from "../atom/TranformProvider";

// Main App Component
const ObjectRenderer = () => {
    const objects = useStore((state) => state.objects);
    const addPoint = useStore((state) => state.addPoint);
    const resetObjects = useStore((state) => state.resetObjects);
    const orbitRef = useRef(null);
    const cameraRef = useRef(null);

    const [activeMesh, setActiveMesh] = useState(objects[0]?.id);

    useEffect(() => {
        const handleResize = () => {
            if (cameraRef.current) {
                cameraRef.current.aspect = window.innerWidth / window.innerHeight;
                cameraRef.current.updateProjectionMatrix();
            }
            orbitRef.current?.update();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const SetCameraRef = () => {
        const { camera } = useThree();
        cameraRef.current = camera;
        return null;
    };

    return (
        <>
            <select style={{ position: "absolute", top: 10, left: 260, zIndex: 10 }} onChange={(e) => setActiveMesh(e.target.value)}>
                {
                    objects.map((obj) => (
                        <option key={obj.id} value={obj.id}>{obj.id}</option>
                    ))
                }
            </select>
            <button onClick={() => addPoint(activeMesh)} style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
                Add Point
            </button>
            <button onClick={() => resetObjects()} style={{ position: "absolute", top: 10, left: 135, zIndex: 10 }}>
                Reset All
            </button>
            <Canvas camera={{ position: [4, 3, 4], fov: 50, near: 0.1, far: 100, aspect: window.innerWidth / window.innerHeight }}>
                <SetCameraRef />
                <gridHelper args={[10, 10]} />
                <axesHelper args={[5]} />
                <ambientLight />
                <OrbitControls ref={orbitRef} makeDefault/>
                <TransformProvider>
                    {objects.map((obj) => (
                        <Object3DComponent key={obj.id} obj={obj} />
                    ))}
                </TransformProvider>

            </Canvas>
        </>
    );
};

export default ObjectRenderer;