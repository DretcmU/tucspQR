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

screen.visible=false;

scene.add(screen);

let hitTestSource=null;
let hitTestRequested=false;


renderer.setAnimationLoop((timestamp, frame) => {

    if (frame) {

        const session = renderer.xr.getSession();
        const referenceSpace = renderer.xr.getReferenceSpace();

        if (!hitTestRequested) {

            session
                .requestReferenceSpace('viewer')
                .then((viewerSpace) => {

                    session
                        .requestHitTestSource({
                            space: viewerSpace
                        })
                        .then((source) => {

                            hitTestSource = source;

                        });

                });

            hitTestRequested = true;
        }

        if (hitTestSource) {

            const hits =
                frame.getHitTestResults(
                    hitTestSource
                );

            if (hits.length) {

                const hit = hits[0];

                const pose =
                    hit.getPose(
                        referenceSpace
                    );

                screen.visible = true;

                screen.position.set(
                    pose.transform.position.x,
                    pose.transform.position.y + 0.8,
                    pose.transform.position.z
                );

                screen.lookAt(
                    camera.position
                );

                video.play();

                const social =
                    document.getElementById("social");

                if (social)
                    social.style.display = "flex";
            }
        }
    }

    renderer.render(
        scene,
        camera
    );

});