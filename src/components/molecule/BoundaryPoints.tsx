import useStore from "../../store";
import { Sphere } from "@react-three/drei";
import { useContext, useRef } from "react";
import { TransformContext } from "../atom/TranformProvider";

type BoundaryPointProps = {
    objId: string;
    index: number;
    position: [number, number, number];
    setOrbitEnabled: (enabled: boolean) => void;
};

export default function BoundaryPoint({ objId, index, position, setOrbitEnabled }: BoundaryPointProps) {
    const updatePoint = useStore((state) => state.updatePoint);

    const meshRef = useRef(null);

    const transformContext = useContext(TransformContext);

    const handleChange = () => {
        if (meshRef.current) {
            const newPos = meshRef.current.position;
            updatePoint(objId, index, [newPos.x, newPos.y, newPos.z]);
        }
    };

    function handleSelection() {
        transformContext.setRef(meshRef.current);
    }

    return (
        <>
            <Sphere
                ref={meshRef}
                name={"boundaryPoint"+index}
                args={[0.05, 12, 12]}
                position={position}
                onClick={handleSelection}
                onUpdate={handleChange}
            >
                <meshStandardMaterial color={"red"} />
            </Sphere>
        </>
    );
};