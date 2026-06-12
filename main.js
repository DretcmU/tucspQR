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

video.src = "/video.mp4";
video.loop = true;
video.muted = true;
video.playsInline = true;

await video.play();

const texture =
    new THREE.VideoTexture(video);

const plane =
    new THREE.Mesh(
        new THREE.PlaneGeometry(1.8,1),
        new THREE.MeshBasicMaterial({
            map:texture
        })
    );

plane.visible = false;

scene.add(plane);

let hitTestSource = null;
let hitTestSourceRequested = false;

renderer.setAnimationLoop((timestamp,frame)=>{

    if(frame){

        const referenceSpace =
            renderer.xr.getReferenceSpace();

        const session =
            renderer.xr.getSession();

        if(!hitTestSourceRequested){

            session.requestReferenceSpace(
                'viewer'
            ).then((viewerSpace)=>{

                session.requestHitTestSource({
                    space:viewerSpace
                }).then((source)=>{
                    hitTestSource=source;
                });

            });

            hitTestSourceRequested=true;

            session.addEventListener('end',()=>{

                hitTestSourceRequested=false;
                hitTestSource=null;

            });
        }

        if(hitTestSource){

            const hits =
                frame.getHitTestResults(
                    hitTestSource
                );

            if(hits.length){

                const hit = hits[0];

                const pose =
                    hit.getPose(
                        referenceSpace
                    );

                plane.visible=true;

                plane.position.set(
                    pose.transform.position.x,
                    pose.transform.position.y+0.7,
                    pose.transform.position.z
                );

                document
                    .getElementById('social')
                    .style.display='flex';
            }
        }
    }

    renderer.render(scene,camera);

});