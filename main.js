import * as THREE from 'https://unpkg.com/three@0.181.1/build/three.module.js';
import { ARButton } from 'https://unpkg.com/three@0.181.1/examples/jsm/webxr/ARButton.js';

const scene = new THREE.Scene();

const camera =
new THREE.PerspectiveCamera(
70,
window.innerWidth/window.innerHeight,
0.01,
20
);

const renderer =
new THREE.WebGLRenderer({
alpha:true,
antialias:true
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

renderer.xr.enabled = true;

document.body.appendChild(
renderer.domElement
);


document.body.appendChild(
ARButton.createButton(renderer,{
requiredFeatures:['hit-test']
})
);

const light =
new THREE.HemisphereLight(
0xffffff,
0xbbbbff,
1
);

scene.add(light);

const video =
document.createElement("video");

video.src = "video.mp4";

video.loop = true;
video.muted = true;
video.playsInline = true;


const texture =
new THREE.VideoTexture(video);

const screen =
new THREE.Mesh(
new THREE.PlaneGeometry(
1.8,
1.0
),
new THREE.MeshBasicMaterial({
map:texture
})
);

screen.visible=true;

scene.add(screen);

let hitTestSource=null;
let hitTestRequested=false;


video.load();

video.addEventListener('loadeddata', () => {
    console.log("Video cargado");
});

screen.position.set(
    0,
    0,
    -2
);

renderer.setAnimationLoop((timestamp, frame) => {

    renderer.render(
        scene,
        camera
    );

});