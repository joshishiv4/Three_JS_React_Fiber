import * as THREE from "three";
import BoundaryPoint from "./BoundaryPoints";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

type Object3DComponentProps = {
  obj: {
    id: string;
    boundary: Array<Array<number>>;
    position: [number, number, number];
    color: string;
  };
};
export default function Object3DComponent({ obj }:Object3DComponentProps) {
  const geometry = new ConvexGeometry(obj.boundary?.map((p: Array<number>) => new THREE.Vector3(p[0], p[1], p[2])));
  return (
    <>
      <mesh geometry={geometry} position={obj.position}>
        <meshStandardMaterial color={obj.color} transparent opacity={0.6} side={THREE.DoubleSide} />
        {obj.boundary?.map((point:Number, index: Number) => (
          <BoundaryPoint key={index} objId={obj.id} index={index} position={point}/>
        ))}
      </mesh>
      <mesh geometry={geometry} position={obj.position}>
        <meshStandardMaterial wireframe={true} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};