import useStore from "../../store";
import { Html, Sphere } from "@react-three/drei";
import { useContext, useRef, memo, useState, useCallback, useEffect } from "react";
import { TransformContext } from "../atom/TranformProvider";
import * as THREE from "three";

type BoundaryPointProps = {
    objId: string;
    index: number;
    position: [number, number, number];
};

const BoundaryPoint = memo(({ objId, index, position }: BoundaryPointProps) => {
    const updatePoint = useStore((state) => state.updatePoint);
    const meshRef = useRef(null);
    const transformContext = useContext(TransformContext);
    const [localPosition, setLocalPosition] = useState(position);

    // Handle drag or position update only for the specific clicked element
    const handleDrag = () => {
        console.log("handleDrag");
        
        if (meshRef.current) {
            const newPos = meshRef.current.position.toArray();
            updatePoint(objId, index, newPos);
        }
    }

    // Handle selection to avoid unnecessary re-renders
    const handleSelection = useCallback(() => {
        transformContext.setRef(meshRef.current);
    }, [transformContext]);

    useEffect(() => {
        console.log("transformContext: ", transformContext);
    }, [transformContext?.handleTransformEnd])

    return (
        <Sphere
            ref={meshRef}
            name={"boundaryPoint" + index}
            args={[0.05, 12, 12]}
            position={localPosition}  // Use local state for position
            onClick={handleSelection}
            onPointerUp={handleDrag}  // Call update only when dragging stops
        >
            <Html>
                <label style={{ whiteSpace: "nowrap" }}>{"Point " + index}</label>
                <br />
                <label style={{ whiteSpace: "nowrap" }}>({localPosition[0]}, {localPosition[1]}, {localPosition[2]})</label>
            </Html>
            <meshStandardMaterial color={"red"} />
        </Sphere>
    );
});

export default BoundaryPoint;
