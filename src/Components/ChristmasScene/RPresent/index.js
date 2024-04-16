import React, { useState } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { random } from "lodash";

export function PresentPink(props) {
  const { nodes, materials } = useGLTF("./3D/prenda.gltf");

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Giftbox01.geometry}
        material={materials.Pink01}
        position={[0.001, 1.058, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Giftbox02.geometry}
        material={materials.Pink02}
        position={[0.001, 1.307, 0]}
        rotation={[0, Math.PI / 2, 0]}
        scale={1.026}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Giftbox03.geometry}
        material={materials.Pink02}
        position={[0.009, 2.189, 0]}
        rotation={[0, -Math.PI / 4, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Giftbox04.geometry}
        material={materials.Pink03}
        position={[0.009, 2.189, 0]}
        rotation={[-0.051, 0, 0]}
        scale={[0.183, 0.403, 0.363]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Giftbox05.geometry}
        material={materials.Pink01}
        position={[0.009, 2.189, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Giftbox06.geometry}
        material={materials.Yellow01}
        position={[0.003, 2.377, 0.007]}
        scale={0.168}
      />
    </group>
  );
}

const RPresent = ({ index, startImpulse, saveRef, children, ...props }) => {
  const [ref, setRef] = useState(null);
  const [visible, setVisible] = useState(false);

  const onRefChange = (ref) => {
    setRef(ref);
  };

  useFrame((state, delta) => {
    if (state.clock.elapsedTime > index * 0.1) {
      setVisible(true);
    }
  });

  useEffect(() => {
    if (ref) {
      ref?.applyImpulse({ x: random(5, 10), y: random(10, 10), z: 0 }, true);
      ref?.applyTorqueImpulse(
        { x: random(-10, 100), y: random(-100, 100), z: random(-30, 30) },
        true
      );
      saveRef(ref);
    }
  }, [ref]);

  if (!visible) return <></>;

  return (
    <RigidBody type="dynamic" {...props} ref={onRefChange}>
      {/* <axesHelper size={10} /> */}
      {children}
    </RigidBody>
  );
};

export const RPresentPink = (props) => {
  return (
    <RPresent {...props}>
      <PresentPink />
    </RPresent>
  );
};
