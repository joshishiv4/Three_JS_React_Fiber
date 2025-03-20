import { TransformControls } from "@react-three/drei";
import { createContext, useEffect, useRef, useState } from "react";

export const TransformContext = createContext(null);

export const TransformProvider = ({ children }) => {
    const [active, setActive] = useState(false);
    const [onTransformUpdate, setOnTransformUpdate] = useState(null);
    const meshRef = useRef(null);
    const controlRef = useRef(null); // Ref for TransformControls

    function toggleActive() {
        setActive((prev) => !prev);
    }

    function setRef(ref) {
        meshRef.current = ref;
    }

    let handleChange = null;

    return (
        <TransformContext.Provider value={{ setRef, toggleActive, handleChange }}>
            {active && meshRef.current && (
                <TransformControls
                    ref={(control) => (controlRef.current = control)} // Use ref-setter function
                    object={meshRef.current} // Pass the actual mesh, not the ref object
                    translationSnap={0.1}
                    onChange={handleChange}
                />
            )}
            {children}
        </TransformContext.Provider>
    );
};
