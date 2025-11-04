import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

let xMouseMove = 0;
let yMouseMove = 0;

const mouseMoveIntensity = 0.01;

const model = './assets/models/head.glb';
const hdri = './assets/images/hdr/environment.hdr';

document.addEventListener('mousemove', (event) => {
    xMouseMove = (event.clientX / window.innerWidth) * 2 - 1;
    yMouseMove = -(event.clientY / window.innerHeight) * 2 + 1;
});

export function setupThreeJS() {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const container = document.getElementById('threejs');
    container.appendChild(renderer.domElement);

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(hdri, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        scene.environment = texture;
        scene.environmentIntensity = 0.75;
    });

    const glbLoader = new GLTFLoader();
    glbLoader.load(
        model,
        gltf => {
            scene.add(gltf.scene);
            gltf.scene.position.set(0, 0, 0);
        },
        xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
        error => console.error('Error loading GLB:', error)
    );

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const animate = () => {
        requestAnimationFrame(animate);
        
        camera.rotation.y = xMouseMove * mouseMoveIntensity;
        camera.rotation.x = yMouseMove * mouseMoveIntensity;
        
        renderer.render(scene, camera);
    };
    animate();
}