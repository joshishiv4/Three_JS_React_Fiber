import useStore from "../../store";
import { Sphere, TransformControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useState } from "react";

export default function BoundaryPoint({ objId, index, position, setOrbitEnabled }) {
    const updatePoint = useStore((state) => state.updatePoint);

    const meshRef = useRef(null);
    const transformRef = useRef(null);
    const { camera } = useThree();

    const [active, setActive] = useState(false);

    const handleChange = () => {
        if (meshRef.current) {
            const newPos = meshRef.current.position;
            updatePoint(objId, index, [newPos.x, newPos.y, newPos.z]);
        }
    };

    function handleSelection(e) {
        e.stopPropagation();

        setActive((prev) => {
            return !prev
        });
    }

    return (
        <>
            {active &&
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
            }
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