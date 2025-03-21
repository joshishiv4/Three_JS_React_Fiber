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
  setOrbitEnabled: (enabled: boolean) => void;
};
export default function Object3DComponent({ obj, setOrbitEnabled }:Object3DComponentProps) {
  const geometry = new ConvexGeometry(obj.boundary?.map((p: Array<number>) => new THREE.Vector3(p[0], p[1], p[2])));
  return (
    <>
      <mesh geometry={geometry} position={obj.position}>
        <meshStandardMaterial color={obj.color} side={THREE.DoubleSide} />
        {obj.boundary?.map((point:Number, index: Number) => (
          <BoundaryPoint key={index} objId={obj.id} index={index} position={point} setOrbitEnabled={setOrbitEnabled} />
        ))}
      </mesh>
      <mesh geometry={geometry} position={obj.position}>
        <meshStandardMaterial wireframe={true} clone={"white"} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};