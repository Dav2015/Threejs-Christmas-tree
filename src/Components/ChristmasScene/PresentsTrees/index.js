import { useFrame, useThree } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { useState } from "react";
import { RPresent, RPresentPink, RPresentWhite } from "../RPresent";
import _, { findIndex, isEqual, max, min, random, round, times } from "lodash";
import * as THREE from "three";
import { damp, lerp } from "three/src/math/MathUtils";
import { Html, OrbitControls, Sparkles, Text, Text3D } from "@react-three/drei";
import { useRef } from "react";
import { useEffect } from "react";
import { Fragment } from "react";

const animationStates = [
  "init",
  "presentShowUp",
  "waitPresentsToStop",
  "cameraRotate",
  "buildTreeAndCameraRotate",
  "cameraRotateSlow",
];

const floor = 0.5;
const levelIncrement = 2.1;
const lookAtPosition = new THREE.Vector3(0, 5, 0);
const treeFinalPositions = [
  { x: 4, y: 0.5, z: 0 },
  { x: 0, y: 0.5, z: 4 },
  { x: -4, y: 0.5, z: 0 },
  { x: 0, y: 0.5, z: -4 },
  { x: -2, y: 0.5, z: -2 },
  { x: 2, y: 0.5, z: 2 },
  { x: 2, y: 0.5, z: -2 },
  { x: -2, y: 0.5, z: 2 },

  { x: 2, y: floor + levelIncrement * 1, z: 0 },
  { x: 0, y: floor + levelIncrement * 1, z: 2 },
  { x: 2, y: floor + levelIncrement * 1, z: 2 },
  { x: -2, y: floor + levelIncrement * 1, z: -2 },
  { x: -2, y: floor + levelIncrement * 1, z: 0 },
  { x: 0, y: floor + levelIncrement * 1, z: -2 },

  { x: 1, y: floor + levelIncrement * 2, z: 0 },
  { x: 0, y: floor + levelIncrement * 2, z: 1 },
  { x: 1, y: floor + levelIncrement * 2, z: 1 },
  { x: -1, y: floor + levelIncrement * 2, z: -1 },
  { x: 0, y: floor + levelIncrement * 3, z: 0 },
];

const createTreeAnimation = (presents, delta) => {
  presents.map((present, index) => {
    present.setEnabled(false);
    const currentPosition = present.translation();
    const finalPosition = treeFinalPositions[index];
    const nextPosition = {
      x: lerp(currentPosition.x, finalPosition.x, 0.1),
      y: lerp(currentPosition.y, finalPosition.y, 0.1),
      z: lerp(currentPosition.z, finalPosition.z, 0.1),
    };

    const currentRotation = present.rotation();
    const nextRotation = {
      x: lerp(currentRotation.x, 0, 0.1),
      y: lerp(currentRotation.y, 0, 0.1),
      z: lerp(currentRotation.z, 0, 0.1),
      w: lerp(currentRotation.w, 1, 0.1),
    };

    present.setRotation(nextRotation);
    present.setTranslation(nextPosition);
  });
};

const cameraRotate = ({ camera, time, frequency, phaseShift = 0 }) => {
  const localAngle = 2 * Math.PI * time * frequency + phaseShift;
  camera.position.x = 20 * Math.sin(localAngle);
  camera.position.z = 20 * Math.cos(localAngle);
  camera.lookAt(lookAtPosition);
};

const floatBoxes = ({ presents, time }) => {
  presents.map((present, index) => {
    present.addForce({ x: 0, y: 4, z: 0 });
  });
};

export const PresentsTree = () => {
  const PRESENTS_AMMOUNT = treeFinalPositions.length;
  const [refs, setRefs] = useState([]);
  const [stateAnimation, setStateAnimation] = useState("init");
  const groupPresentRef = useRef(null);
  const [frameProps, setFrameProps] = useState({
    frequency: 1,
    cameraMaxVelocity: 2,
    phaseShift: 1,
    aceleration: 0.5,
    time: 0,
    timeStamp: 0,
  });

  const saveRefHandler = (ref) => setRefs((refs) => [...refs, ref]);

  useFrame(({ camera, scene }, delta) => {
    camera.lookAt(lookAtPosition);
    switch (stateAnimation) {
      case "init":
        camera.position.set(20, 10, 0);
        setStateAnimation("presentShowUp");
        break;
      case "presentShowUp":
        if (refs.length === PRESENTS_AMMOUNT) {
          setStateAnimation("waitPresentsToStop");
        }
        break;
      case "waitPresentsToStop":
        setTimeout(() => {
          setStateAnimation("cameraRotate");
        }, 1000);
        break;
      case "cameraRotate":
        setFrameProps((props) => ({
          ...props,
          time: frameProps.time + delta,
          frequency: min([
            frameProps.aceleration * frameProps.time,
            frameProps.cameraMaxVelocity,
          ]),
        }));
        cameraRotate({
          camera,
          time: frameProps.time,
          frequency: frameProps.frequency,
        });
        floatBoxes({ presents: refs, time: frameProps.time });
        setTimeout(() => {
          setStateAnimation("buildTreeAndCameraRotate");
        }, 2000);
        break;
      case "buildTreeAndCameraRotate":
        setFrameProps((props) => ({
          ...props,
          time: frameProps.time + delta,
          frequency: min([
            frameProps.aceleration * frameProps.time,
            frameProps.cameraMaxVelocity,
          ]),
          timeStamp: frameProps.time,
        }));
        cameraRotate({
          camera,
          time: frameProps.time,
          frequency: frameProps.frequency,
        });
        createTreeAnimation(refs);
        setTimeout(() => {
          setStateAnimation("cameraRotateSlow");
        }, 1000);
        break;
      case "cameraRotateSlow":
        setFrameProps((props) => ({
          ...props,
          time: frameProps.time + delta,
          frequency: max([frameProps.frequency - frameProps.aceleration, 0.5]),
        }));
        cameraRotate({
          camera,
          time: frameProps.time,
          frequency: frameProps.frequency,
          phaseShift: frameProps.phaseShift,
        });
        setTimeout(() => {
          orbitRef.current.enableRotate = true;
          orbitRef.current.autoRotate = true;
          setStateAnimation("showText");
        }, 1000);
        break;
      case "showText":
        setStateAnimation("finish");
        break;
    }
  });

  const orbitRef = useRef();
  const textRef = useRef();

  return (
    <>
      <Physics>
        <OrbitControls
          ref={orbitRef}
          autoRotateSpeed={-4}
          scale={false}
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          enableDamping={true}
        />
        <group ref={groupPresentRef}>
          {times(PRESENTS_AMMOUNT, (num) => {
            return (
              <Fragment key={"present-" + num}>
                <RPresentPink
                  index={num}
                  key={"present-" + num}
                  position-x={random(-10, 0)}
                  position-y={5}
                  position-z={random(-5, 5)}
                  saveRef={saveRefHandler}
                />
              </Fragment>
            );
          })}
        </group>
        <RigidBody type="fixed">
          <mesh receiveShadow position-y={0} rotation-x={-Math.PI * 0.5}>
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial
              opacity={0}
              transparent={true}
              side={THREE.DoubleSide}
            />
          </mesh>
        </RigidBody>
      </Physics>
    </>
  );
};
