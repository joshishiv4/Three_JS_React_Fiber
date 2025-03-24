import * as THREE from "three";
import BoundaryPoint from "./BoundaryPoints";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import { useEffect, useMemo, useRef, useState } from "react";
import useStore from "../../store";
import { Html } from "@react-three/drei";

type Object3DComponentProps = {
  objId: string;
};
export default function Object3DComponent({ objId }:Object3DComponentProps) {
  // const [obj, setObj] = useState(null);
  const obj = useStore((state) => state.objects.find((o) => o.id === objId));

  const meshRef = useRef(null);
  const meshEdgeRef = useRef(null);

  const geometry = useMemo(() => {
    if(obj) {
      const points = obj.boundary.map((point) => new THREE.Vector3(...point));
      return new ConvexGeometry(points);
    }
    return null;
  }, [obj]);

  useEffect(() => {
    if(meshRef.current) {
      meshRef.current.geometry.dispose();
      meshRef.current.geometry = geometry;
    }
    if(meshEdgeRef.current) {
      meshEdgeRef.current.geometry.dispose();
      meshEdgeRef.current.geometry = geometry;
    }
  }, [geometry])

  return (
    <>
    {
      obj &&
      <>
        <mesh position={obj.position} ref={meshRef}>
          <meshStandardMaterial color={obj.color} transparent opacity={0.6} side={THREE.DoubleSide} />
          <BoundaryPoint objId={obj.id} boundary={obj.boundary}/>
        </mesh>
        <mesh position={obj.position} ref={meshEdgeRef}>
          <meshStandardMaterial wireframe={true} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      </>
    }
    </>
  );
};