import React, {useRef, useState, Suspense} from "react";
import * as THREE from "three";
import {Canvas, useFrame, useLoader} from "react-three-fiber";

import carbon_fiber from "./mesh-eye.jpg";

function TextMesh(props) {
    const [hovered, setHover] = useState(false);
    const mesh = useRef();

    // actions to perform in current frame
    useFrame(() => {
        mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
        mesh.current.geometry.center();
    });

    //
    // create carbon fiber texture
    const cf_texture = useLoader(THREE.TextureLoader, carbon_fiber);
    cf_texture.wrapS = THREE.RepeatWrapping;
    cf_texture.wrapT = THREE.RepeatWrapping;
    cf_texture.repeat.set(1, 1);

    const textOptions = {
      size: 5,
      height: hovered ? 0 : 1
    };

    const getTexture = () => {
      const textureMap = {
        carbonFiber: cf_texture
      };

      return textureMap[props.texture];
    };

    return (
        // <mesh rotation={[0, 0, 0]}>
        //     {...props}
        //     ref={mesh}
        //     <sphereGeometry attach="geometry" args={[1, 16, 16]}/>
        //     <meshStandardMaterial
        //         attach="material"
        //         color="blue"
        //     />
        // </mesh>
        <mesh
          {...props}
          ref={mesh}
          onPointerOver={(e) => setHover(true)}
          onPointerOut={(e) => setHover(false)}
          rotation={[0, 0, 0]}

        >
          <sphereGeometry attach="geometry" args={[1, 32, 32]}/>
          <meshStandardMaterial
                attach="material"
                color="blue"
            />
          {/*<textGeometry attach="geometry" args={[1, 16, 16]} />*/}
          <meshStandardMaterial attach="material" args={[{ map: getTexture() }]} />
        </mesh>
    );
}

export default function Mesh() {
    const textures = ["carbonFiber"];
    const [selected, setSelected] = useState(textures[0]);

    // const switchTexture = () => {
    //   const index = textures.indexOf(selected);
    //   if (index < textures.length - 1) {
    //     setSelected(textures[index + 1]);
    //     return;
    //   }
    //
    //   setSelected(textures[0]);
    //   return;
    // };

    const canvasStyle = {
        width: "800",
        height: "800"
    };


    return (
        <div style={{height: 800, width: 800}}>
            <Canvas
                style={canvasStyle}
                camera={{position: [0, 0, 10]}}
                onCreated={({gl}) => gl.setClearColor("#ad8b8b")}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={1}/>
                    <TextMesh position={[0, 0, 0]} texture={selected}/>
                </Suspense>
            </Canvas>
            {/*<button style={buttonStyle} onClick={switchTexture}>*/}
            {/*  switch texture*/}
            {/*</button>*/}
        </div>
    );
}
