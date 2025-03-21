import { TransformControls } from "@react-three/drei";
import { createContext, useRef, useState, ReactNode } from "react";
import { Object3D } from "three";

export const TransformContext = createContext<{
    setRef: (ref: Object3D | null) => void;
} | null>(null);

interface TransformProviderProps {
    children: ReactNode;
}

export const TransformProvider = ({ children }: TransformProviderProps) => {
    const meshRef = useRef<Object3D | null>(null);
    const controlRef = useRef(null);

    const [active, setActive] = useState(false);

    function setRef(ref: Object3D | null) {
        const isCurrentObj = ref?.id === meshRef.current?.id;
        // RESET PREVIOUS ACTIVE OBJECT COLOR AND USER DATA
        if (meshRef.current) {
            meshRef.current.material.color.set("red");
        }

        if(!ref) return;

        // SET/RESET ACTIVE OBJECT COLOR
        if (!isCurrentObj) {
            ref.material.color.set("lightgreen");
            setActive(true);
            meshRef.current = ref;
        } else {
            ref.material.color.set("red");
            setActive(false);
            meshRef.current = null;
        }
    }

    return (
        <TransformContext.Provider value={{ setRef }}>
            {active && meshRef.current && (
                <TransformControls
                    ref={controlRef}
                    object={meshRef.current}
                    translationSnap={0.1}
                />
            )}
            {children}
        </TransformContext.Provider>
    );
};
