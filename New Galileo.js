import * as THREE from '../ThreeJS/three.js-master';
import {OrbitControls} from '../ThreeJS/three.js-master/examples/jsm/controls/OrbitControls';

// Texture Variables
var starsTexture = "https://drive.google.com/file/d/1ccCSE8ohmzU6gC8sHAMlXhBF0fApPb3i/view?usp=sharing";
var sunTexture = "https://drive.google.com/file/d/1UCpHpkybe4NGSMDR_l6J08kWoRvOIPR3/view?usp=share_link";
var earthTexture = "https://drive.google.com/file/d/1pS8fPD4924WU_cwW3P6vqwbMWWvfhX4x/view?usp=share_link";
var moonTexture = "https://drive.google.com/file/d/1mQLOt6tK5aPWF__wzP2BB5AD-fB2o04-/view?usp=share_link";
var jupiterTexture = "https://drive.google.com/file/d/1gLUSaVw51wv-Ep9_mvLX-d-5ZE35dClV/view?usp=share_link";
var ganymedeTexture = "https://drive.google.com/file/d/1tqcFgCfmvbDtV1An57bbbcI1N5KmW84j/view?usp=share_link";
var ioTexture = "https://drive.google.com/file/d/1PGRhegxOlTvsvr4kiU_GfRc1L_o8jRg7/view?usp=share_link";
var europaTexture = "https://drive.google.com/file/d/1G31qvrN-i6HK7dBOnjG6dJWxXvg4gw9p/view?usp=share_link";
var callistoTexture = "https://drive.google.com/file/d/1FbRGgV6lMT8ND6hWdrLCVl1O5sFPGhYx/view?usp=share_link";

// Settings Input Variables
let viewAbove = true;
let directlyHorizontal = false;
let showOrbit = true;
let centerJupiter = true;
var showLines = false;

// Set Size Variables
let jupSize = 11;
let earthSize = 8.5;
let sunSize = 35;
let moonSize = 3;
let ganySize = 3;
let euroSize = 3;
let calSize = 3;
let ioSize = 3;

// Set Distance Variables
distMultiplier = 4;
let jupDist = 240;
let earthDist = 80;
let moonDist = 15;
let ioDist = 4.2 * distMultiplier;
let euroDist = 6.7 * distMultiplier;
let ganyDist = (10.7 - 1) * distMultiplier;
let calDist = (18.8 - 4) * distMultiplier;

function start() {
    var canvas = document.getElementById("artifactCanvas");
    // Initialize the GL context
    gl = initWebGL(canvas);
    canvas.width = 673;
    canvas.height = 472;
    // Only continue if WebGL is available and working
    if (!gl) {
        return;
    }
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    // Near things obscure far things
    gl.depthFunc(gl.LEQUAL);
    // Clear the color as well as the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    init();
    animate();
}
var gl; //WebGL Instance Variable
function initWebGL(canvas) {
    gl = null;
    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    // If we don't have a GL context, give up now
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }
    return gl;
}

//Three JS Import Link: https://cdnjs.cloudflare.com/ajax/libs/three.js/84/three.min.js
//JQuery Import Link: https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
//Note: Ctrl + Shift + L for multi-typing

// Initialize Scene
function init() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        10000
    );

    const orbit = new OrbitControls(camera, renderer.domElement);

    fixCamera();
    orbit.update();

    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const cubeTextureLoader = new THREE.cubeTextureLoader();
    scene.background = cubeTextureLoader.load([
        starsTexture,
        starsTexture,
        starsTexture,
        starsTexture,
        starsTexture,
        starsTexture
    ]);

    const textureLoader = new THREE.TextureLoader();

    drawObjects();
}

function drawObjects() {
    // Draw Sun    
    const sunGeo = new THREE.SphereGeometry(sunSize, 30, 30);
    const sunMat = new THREE.MeshBasicMaterial({
        map: textureLoader.load(sunTexture)
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sun);

    // Draw Earth
    const earth = createPlanet(earthSize, earthTexture, earthDist, sun);
  
    // Draw Moon
    const moon = createPlanet(moonSize, moonTexture, moonDist, earth);
  
    // Draw Jupiter
    const jupiter = createPlanet(jupSize, jupiterTexture, jupDist, sun);
  
    // Draw Io
    const io = createPlanet(ioSize, ioTexture, ioDist, jupiter);
  
    // Draw Ganymede
    const ganymede = createPlanet(ganySize, ganymedeTexture, ganyDist, jupiter);
  
    // Draw Europa
    const europa = createPlanet(euroSize, europaTexture, euroDist, jupiter);
  
    // Draw Callisto
    const callisto = createPlanet(calSize, callistoTexture, calDist, jupiter);

    // Finish Later //
    if (showOrbit) {
      drawOrbits();
    }

    const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
    scene.add(pointLight);
}

function createPlanet(size, texture, position, parentObj){
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    parentObj.add(obj);
    mesh.position.x = position;
    return {mesh, obj}
}

function fixCamera() {
    if (viewAbove) {
    camera.position.set(0, 850, 0);
    camera.rotation.x = -Math.PI / 2;
    light2.position.set(0, 1000, 0);
  } else if (directlyHorizontal) {
    camera.position.set(0,0,700);
    camera.rotation.x = 0;
    light2.position.set(0, 0, 500);
  } else {
    camera.rotation.x = 0;
    camera.position.set(0, 50, 700);
    light2.position.set(0, 0, 500);
  }
}

function animate() {
    //Self-Rotation
    sun.rotateY(0.004);
    earth.mesh.rotateY(0.004)

}