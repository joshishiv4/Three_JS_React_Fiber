import useStore from "../../store";
import { Sphere, TransformControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useContext, useEffect, useRef, useState } from "react";
import { TransformContext } from "../atom/TranformProvider";

export default function BoundaryPoint({ objId, index, position, setOrbitEnabled }) {
    const updatePoint = useStore((state) => state.updatePoint);

    const meshRef = useRef(null);
    // const transformRef = useRef(null);
    // const { camera } = useThree();

    const transformContext = useContext(TransformContext);

    const [active, setActive] = useState(false);

    function handleSelection(e) {
        e.stopPropagation();

        transformContext.setRef(meshRef.current);
        transformContext.toggleActive();
        setActive((prev) => 
            !prev
        );
    }

    return (
        <>
            {/* {active &&
                <TransformControls
                    ref={transformRef}
                    object={active ? meshRef.current : null}
                    translationSnap={0.2}
                    mode="translate"
                    enabled={active}
                    visible={active}
                    camera={camera}
                    onChange={handleChange}
                />
            } */}
            <Sphere
                ref={meshRef}
                name={"boundaryPoint"+index}
                args={[0.05, 12, 12]}
                position={position}
                onClick={handleSelection}
            >
                <meshStandardMaterial color={!active ? "red" : "white"} />
            </Sphere>
        </>
    );
};