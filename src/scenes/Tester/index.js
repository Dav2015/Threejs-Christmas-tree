import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Fragment, Suspense, useState } from "react";
import { PresentsTree } from "../ChristmasScene/PresentsTrees";
import { PresentPink, RPresentPink } from "../ChristmasScene/RPresent";
import { random } from "lodash";
import { Vector3 } from "three";

export const Tester = () => {
  const [ref, setRef] = useState(null);

  return (
    <div
      style={{
        top: 0,
        left: 0,
        width: "90vw",
        height: "100vh",
        position: "fixed",
        zIndex: 100000,
      }}
    >
      <Canvas
        performance={"demand"}
        color="red"
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          position: [10, 7, 0],
        }}
      >
        <axesHelper args={[4]} />
        <OrbitControls />
        <Environment preset="sunset" />
        <Suspense>
          <Fragment>
            <PresentPink
              key={"present"}
              position-x={0}
              position-y={0}
              position-z={0}
              saveRef={(ref) => setRef(ref)}
            ></PresentPink>
            <points scale={[2, 2, 2]} position={[0, 1.5, 0]}>
              <sphereGeometry></sphereGeometry>
              <pointsMaterial  size={0.03} color={"red"} />
            </points>
          </Fragment>
        </Suspense>
      </Canvas>
    </div>
  );
};
