import * as THREE from "three";
import BoundaryPoint from "./BoundaryPoints";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import { useEffect, useRef, useState } from "react";
import useStore from "../../store";
import { Html } from "@react-three/drei";

type Object3DComponentProps = {
  objId: string;
};
export default function Object3DComponent({ objId }:Object3DComponentProps) {
  const [geometry, setGeometry] = useState(null);
  const [obj, setObj] = useState(null);
  const objects = useStore((state) => state.objects);

  const meshRef = useRef(null);

  useEffect(() => {
    const tmp = objects.find((o) => o.id === objId);
    setObj(null);

    // Subscribe to changes in objects state
    useStore.subscribe((state) => {
      const obj = state.objects.find((o) => o.id === objId);
      setObj(obj);
    });

    const geometry = new ConvexGeometry(tmp.boundary?.map((p: Array<number>) => new THREE.Vector3(p[0], p[1], p[2])));
    if(meshRef.current) {
      meshRef.current.geometry.dispose();
      meshRef.current.geometry = geometry;
    }
    setTimeout(() => {
      setGeometry(geometry);
      setObj(() => tmp);
    }, 0);
  }, [objId])

  useEffect(() => {
    console.log("OBJ UPDATED");
  }, [obj])

  return (
    <>
    {
      obj &&
      <>
        <mesh geometry={geometry} position={obj.position} ref={meshRef}>
          <Html>
            {new Date().getTime()}
          </Html>
          <meshStandardMaterial color={obj.color} transparent opacity={0.6} side={THREE.DoubleSide} />
          {
            obj.boundary &&
            obj.boundary?.map((point:Number, index: Number) => (
              <BoundaryPoint key={obj.id+point} objId={obj.id} index={index} position={point}/>
            ))
          }
        </mesh>
        <mesh geometry={geometry} position={obj.position}>
          <meshStandardMaterial wireframe={true} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      </>
    }
    </>
  );
};