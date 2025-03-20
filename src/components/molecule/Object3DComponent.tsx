import * as THREE from "three";
import BoundaryPoint from "./BoundaryPoints";

// Boundary Point Component
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

export default function Object3DComponent({ obj, setOrbitEnabled }) {
  const geometry = new ConvexGeometry(obj.boundary?.map((p: Array<number>) => new THREE.Vector3(p[0], p[1], p[2])));

  return (
    <>
      <mesh geometry={geometry} position={obj.position}>
        <meshStandardMaterial color={obj.color} transparent opacity={0.3} side={THREE.DoubleSide} />
        {obj.boundary?.map((point: number, index: number) => (
          <BoundaryPoint key={index} objId={obj.id} index={index} position={point} setOrbitEnabled={setOrbitEnabled} />
        ))}
      </mesh>
      <mesh geometry={geometry} position={obj.position}>
        <meshStandardMaterial wireframe={true} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};