import React, { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Object3DComponent from "../molecule/Object3DComponent";

// Store
import useStore from "../../store";

// Main App Component
const ObjectRenderer = () => {
    const objects = useStore((state) => state.objects);
    const addPoint = useStore((state) => state.addPoint);
    const resetObjects = useStore((state) => state.resetObjects);
    const orbitRef = useRef(null);
    const cameraRef = useRef(null);
    const [orbitEnabled, setOrbitEnabled] = React.useState(true);

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
            <button onClick={() => addPoint("obj1")} style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
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
                <OrbitControls ref={orbitRef} enabled={orbitEnabled} makeDefault/>

                {objects.map((obj) => (
                    <Object3DComponent key={obj.id} obj={obj} setOrbitEnabled={setOrbitEnabled} />
                ))}
            </Canvas>
        </>
    );
};

export default ObjectRenderer;