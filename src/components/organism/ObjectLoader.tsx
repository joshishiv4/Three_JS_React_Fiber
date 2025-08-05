import { useRef, useEffect, useState } from "react";
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
    const orbitRef:any = useRef(null);
    const cameraRef:any = useRef(null);

    const [activeMesh, setActiveMesh] = useState(objects[0]?.id);

    const transformContext:any = useRef(null);

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
            <header>
                <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
                    <label style={{marginRight: "5px"}}>Add Points to: </label>
                    <select onChange={(e) => {setActiveMesh(e.target.value); transformContext.current.resetControl();}}>
                        {
                            objects.map((obj) => (
                                <option key={obj.id} value={obj.id}>{obj.id}</option>
                            ))
                        }
                    </select>
                </div>
                <button onClick={() => addPoint(activeMesh)} style={{ position: "absolute", top: 10, left: 285, zIndex: 10 }}>
                    Add Point
                </button>
                <button onClick={() => {resetObjects(); transformContext.current.resetControl()}} style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}>
                    Reset All
                </button>
            </header>
            <Canvas frameloop="demand" camera={{ position: [4,4,5], fov: 50, near: 0.1, far: 100, aspect: window.innerWidth / window.innerHeight }}>
                <SetCameraRef />
                <gridHelper args={[10, 10]} />
                <axesHelper args={[5]} />
                <ambientLight />
                <OrbitControls ref={orbitRef} makeDefault/>
                <TransformProvider ref={transformContext}>
                    <Object3DComponent objId={activeMesh} />
                </TransformProvider>
            </Canvas>
        </>
    );
};

export default ObjectRenderer;