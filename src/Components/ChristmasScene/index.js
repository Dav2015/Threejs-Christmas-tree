import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { PresentsTree } from "./PresentsTrees";

export const ChristmasScene = () => {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 100,
      }}
    >
      <Environment preset="sunset" />
      <Suspense>
        <PresentsTree />
      </Suspense>
    </Canvas>
  );
};
