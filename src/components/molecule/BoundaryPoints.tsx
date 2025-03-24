import useStore from "../../store";
import { Html, Sphere } from "@react-three/drei";
import { useContext, useRef, memo, useState, useCallback, useEffect, Fragment, useMemo } from "react";
import { TransformContext } from "../atom/TranformProvider";
import * as THREE from "three";

type BoundaryPointProps = {
    objId: string;
    index: number;
    boundary: Array<number>;
};

const BoundaryPoint = memo(({ objId, boundary }: BoundaryPointProps) => {
    const updatePoint = useStore((state) => state.updatePoint);
    const meshRef = useRef([]);
    const transformContext = useContext(TransformContext);
    const active = useRef(null);

    // Handle drag or position update only for the specific clicked element
    const handleDrag = (position) => {
        if (meshRef.current) {
            updatePoint(objId, active.current, position);
        }
    };

    // Handle selection to avoid unnecessary re-renders
    const handleSelection = useCallback((index) => {
        const ref = meshRef.current[index];
        active.current = index;
        if (ref) {
            transformContext?.setRef(ref);
            transformContext?.updateCallBack(handleDrag);
        }
    }, [transformContext]);

    const sphereObj = (position, index) => {
        return (
            <Sphere
                ref={(ref) => (meshRef.current[index] = ref)}
                key={objId+'boundaryPoint'+index}
                name={"boundaryPoint" + index}
                args={[0.05, 12, 12]}
                position={position}
                onClick={() => handleSelection(index)}
            >
                <Html>
                    <div style={{pointerEvents: "none"}}>
                        <label style={{ whiteSpace: "nowrap" }}>{"Point " + index}</label>
                        <br />
                        <label style={{ whiteSpace: "nowrap" }}>({position[0].toFixed(1)}, {position[1].toFixed(1)}, {position[2].toFixed(1)})</label>
                    </div>
                </Html>
                <meshStandardMaterial color={"red"} />
            </Sphere>
        )
    }

    return (
        <>
            {
                boundary?.map((position, index) => (
                    sphereObj(position, index)
                ))
            }
        </>
    );
});

export default BoundaryPoint;
