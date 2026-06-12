import * as THREE from 'three';

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
        antialias:true,
        alpha:true
    });

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.xr.enabled = true;

document.body.appendChild(
    renderer.domElement
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

video.src="/video.mp4";
video.loop=true;
video.muted=true;
video.play();

const texture =
    new THREE.VideoTexture(video);

const plane =
    new THREE.Mesh(
        new THREE.PlaneGeometry(2,1.1),
        new THREE.MeshBasicMaterial({
            map:texture
        })
    );

plane.position.set(0,1,-3);

scene.add(plane);

renderer.setAnimationLoop(() =>
{
    renderer.render(
        scene,
        camera
    );
});