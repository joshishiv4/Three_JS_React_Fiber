import { TransformControls } from "@react-three/drei";
import { createContext, useRef, useState, ReactNode, useEffect, useContext, forwardRef, useImperativeHandle, useCallback } from "react";
import { Object3D } from "three";

export const TransformContext = createContext<{
    setRef: (ref: Object3D | null) => void;
    resetControl: () => void;
    handleTransformEnd: () => void;
} | null>(null);

interface TransformProviderProps {
    children: ReactNode;
}

export const TransformProvider = forwardRef(({ children }: TransformProviderProps, ref) => {
    const meshRef = useRef<Object3D | null>(null);
    const controlRef = useRef(null);

    const [active, setActive] = useState(false);

    useImperativeHandle(ref, () => ({
        resetControl: () => resetControl(),
    }));

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
            resetControl();
        }
    }

    useEffect(() => {
        console.log("controlRef: ", controlRef.current);
    }, [active])

    const handleTransformEnd = useCallback(() => {
        if (controlRef.current?.object) {
            console.log("Transform finished: ", controlRef.current.object.position.toArray());
        }
    }, []);


    function resetControl() {
        if(meshRef.current)
            meshRef.current.material.color.set("red");

        setActive(false);
        meshRef.current = null;
    }

    return (
        <TransformContext.Provider value={{ setRef, resetControl, handleTransformEnd }}>
            {active && meshRef.current && (
                <TransformControls
                    ref={controlRef}
                    object={meshRef.current}
                    translationSnap={0.1}
                    onMouseUp={handleTransformEnd}
                />
            )}
            {children}
        </TransformContext.Provider>
    );
});

export const useTransform = () => {
  const context = useContext(TransformContext);
  if (!context) {
    throw new Error("useTransform must be used within a TransformProvider");
  }
  return context;
}