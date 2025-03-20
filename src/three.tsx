// import React, { useRef } from "react";
// import { Canvas, useThree } from "@react-three/fiber";
// import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
// import { create } from "zustand";
// import * as THREE from "three";

// // Zustand Store
// type Point = [number, number, number];
// type Object3DData = {
//   id: string;
//   boundary: Point[];
//   color: string;
// };

// type Store = {
//   objects: Object3DData[];
//   addPoint: (id: string) => void;
//   updatePoint: (id: string, index: number, point: Point) => void;
// };

// const useStore = create<Store>((set) => ({
//   objects: [
//     {
//       id: "obj1",
//       boundary: [[-1, 1, 0], [1, 1, 0], [1, -1, 0], [-1, -1, 0]],
//       color: "blue",
//     },
//   ],
//   addPoint: (id) =>
//     set((state) => ({
//       objects: state.objects.map((obj) =>
//         obj.id === id
//           ? {
//               ...obj,
//               boundary: [
//                 ...obj.boundary,
//                 [Math.random() * 2 - 1, Math.random() * 2 - 1, 0],
//               ],
//             }
//           : obj
//       ),
//     })),
//   updatePoint: (id, index, point) =>
//     set((state) => ({
//       objects: state.objects.map((obj) =>
//         obj.id === id
//           ? {
//               ...obj,
//               boundary: obj.boundary.map((p, i) => (i === index ? point : p)),
//             }
//           : obj
//       ),
//     })),
// }));

// // Boundary Point Component
// const BoundaryPoint = ({ objId, index, position, setOrbitEnabled }) => {
//   const updatePoint = useStore((state) => state.updatePoint);
//   const { camera } = useThree();
//   const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
//   const raycaster = new THREE.Raycaster();

//   const onPointerDown = (event) => {
//     event.stopPropagation();
//     setOrbitEnabled(false);

//     const onMouseMove = (e) => {
//       const mouse = new THREE.Vector2(
//         (e.clientX / window.innerWidth) * 2 - 1,
//         -(e.clientY / window.innerHeight) * 2 + 1
//       );
//       raycaster.setFromCamera(mouse, camera);
//       const intersection = new THREE.Vector3();
//       if (raycaster.ray.intersectPlane(plane, intersection)) {
//         updatePoint(objId, index, [intersection.x, intersection.y, intersection.z]);
//       }
//     };

//     const onMouseUp = () => {
//       window.removeEventListener("mousemove", onMouseMove);
//       window.removeEventListener("mouseup", onMouseUp);
//       setOrbitEnabled(true);
//     };

//     window.addEventListener("mousemove", onMouseMove);
//     window.addEventListener("mouseup", onMouseUp);
//   };

//   return (
//     <Sphere args={[0.05, 16, 16]} position={position} onPointerDown={onPointerDown}>
//       <meshStandardMaterial color="red" />
//     </Sphere>
//   );
// };

// // Object Component
// const Object3DComponent = ({ obj, setOrbitEnabled }) => {
//   return (
//     <mesh position={[0, 0, -0.5]}>
//       <extrudeGeometry args={[
//         new THREE.Shape(obj.boundary.map(p => new THREE.Vector2(p[0], p[1]))),
//         { depth: 0.5, bevelEnabled: false }
//       ]} />
//       <meshStandardMaterial color={obj.color} transparent opacity={0.5} side={THREE.DoubleSide} />
//       {obj.boundary.map((point, index) => (
//         <BoundaryPoint key={index} objId={obj.id} index={index} position={point} setOrbitEnabled={setOrbitEnabled} />
//       ))}
//     </mesh>
//   );
// };

// // Main App Component
// const App = () => {
//   const objects = useStore((state) => state.objects);
//   const addPoint = useStore((state) => state.addPoint);
//   const orbitRef = useRef();
//   const [orbitEnabled, setOrbitEnabled] = React.useState(true);

//   return (
//     <>
//       <button onClick={() => addPoint("obj1")} style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
//         Add Point
//       </button>
//       <Canvas camera={{ position: [0, 0, 5] }}>
//         <ambientLight />
//         <OrbitControls ref={orbitRef} enabled={orbitEnabled} />
//         {objects.map((obj) => (
//           <Object3DComponent key={obj.id} obj={obj} setOrbitEnabled={setOrbitEnabled} />
//         ))}
//       </Canvas>
//     </>
//   );
// };

// export default App;