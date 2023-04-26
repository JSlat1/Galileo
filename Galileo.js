var camera, scene, renderer, geometry, material, mesh;
// Set Boolean Settings
let viewAbove = true;
let directlyHorizontal = false;
let showOrbit = true;
let centerJupiter = true;
var showLines = false;

let orbitLineWidth = 0.5;

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

starsTexture = "https://drive.google.com/file/d/1ccCSE8ohmzU6gC8sHAMlXhBF0fApPb3i/view?usp=sharing";
sunTexture = "https://drive.google.com/file/d/1UCpHpkybe4NGSMDR_l6J08kWoRvOIPR3/view?usp=share_link";
earthTexture = "https://drive.google.com/file/d/1pS8fPD4924WU_cwW3P6vqwbMWWvfhX4x/view?usp=share_link";
moonTexture = "https://drive.google.com/file/d/1mQLOt6tK5aPWF__wzP2BB5AD-fB2o04-/view?usp=share_link";
jupiterTexture = "https://drive.google.com/file/d/1gLUSaVw51wv-Ep9_mvLX-d-5ZE35dClV/view?usp=share_link";
ganymedeTexture = "https://drive.google.com/file/d/1tqcFgCfmvbDtV1An57bbbcI1N5KmW84j/view?usp=share_link";
ioTexture = "https://drive.google.com/file/d/1PGRhegxOlTvsvr4kiU_GfRc1L_o8jRg7/view?usp=share_link";
europaTexture = "https://drive.google.com/file/d/1G31qvrN-i6HK7dBOnjG6dJWxXvg4gw9p/view?usp=share_link";
callistoTexture = "https://drive.google.com/file/d/1FbRGgV6lMT8ND6hWdrLCVl1O5sFPGhYx/view?usp=share_link";

//var orbitButton = document.getElementById("showOrbit");
//orbitButton.addEventListener("click", onButtonClick(), false);
var gl;
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


//init();
//animate();

function drawObjects() {
  // Draw Earth
  earthGeo = new THREE.SphereGeometry(earthSize, 50, 50);
  earthMat = new THREE.MeshPhongMaterial({ color: 0x00ffff });
  earth = new THREE.Mesh(earthGeo, earthMat);
  earth.position.x = earthDist;
  earth.position.y = 0;
  scene.add(earth);

  // Draw Sun
  sunGeo = new THREE.SphereGeometry(sunSize, 50, 50);
  sunMat = new THREE.MeshPhongMaterial({
    color: 0xffd700,
    emissive: 0xffd700,
    emissiveIntensity: 0.75,
    shininess: 10
  });
  sun = new THREE.Mesh(sunGeo, sunMat);
  scene.add(sun);

  // Draw Moon
  moonGeo = new THREE.SphereGeometry(moonSize, 50, 50);
  moonMat = new THREE.MeshPhongMaterial({ color: 0xc0c0c0 });
  moon = new THREE.Mesh(moonGeo, moonMat);
  scene.add(moon);

  // Draw Jupiter
  jupGeo = new THREE.SphereGeometry(jupSize, 50, 50);
  jupMat = new THREE.MeshPhongMaterial({ color: 0xd2691e });
  jupiter = new THREE.Mesh(jupGeo, jupMat);
  scene.add(jupiter);

  // Draw Io
  ioGeo = new THREE.SphereGeometry(ioSize, 50, 50);
  ioMat = new THREE.MeshPhongMaterial({ color: 0xffcc00 });
  io = new THREE.Mesh(ioGeo, ioMat);
  scene.add(io);

  // Draw Ganymede
  ganyGeo = new THREE.SphereGeometry(ganySize, 50, 50);
  ganyMat = new THREE.MeshPhongMaterial({ color: 0xcc9933 });
  ganymede = new THREE.Mesh(ganyGeo, ganyMat);
  scene.add(ganymede);

  // Draw Europa
  euroGeo = new THREE.SphereGeometry(euroSize, 50, 50);
  euroMat = new THREE.MeshPhongMaterial({ color: 0xffdab9 });
  europa = new THREE.Mesh(euroGeo, euroMat);
  scene.add(europa);

  // Draw Callisto
  calGeo = new THREE.SphereGeometry(calSize, 50, 50);
  calMat = new THREE.MeshPhongMaterial({ color: 0xbc8f8f });
  callisto = new THREE.Mesh(calGeo, calMat);
  scene.add(callisto);

  if (showOrbit) {
    drawOrbits();
  }
}

function drawOrbits() {
  // Draw Earth Orbit
  eOrbitGeo = new THREE.TorusGeometry(earthDist, orbitLineWidth, 50, 100);
  eOrbitMat = new THREE.MeshBasicMaterial({ color: "white" });
  eOrbit = new THREE.Mesh(eOrbitGeo, eOrbitMat);
  scene.add(eOrbit);
  eOrbit.rotation.x = Math.PI / 2;

  // Draw Moon Orbit
  mOrbitGeo = new THREE.TorusGeometry(moonDist, orbitLineWidth, 50, 100);
  mOrbitMat = new THREE.MeshBasicMaterial({ color: "white" });
  mOrbit = new THREE.Mesh(mOrbitGeo, mOrbitMat);
  mOrbit.position.z = -earthDist;
  scene.add(mOrbit);
  mOrbit.rotation.x = Math.PI / 2;

  // Draw Jupiter Orbit
  jOrbitGeo = new THREE.TorusGeometry(jupDist, orbitLineWidth, 50, 100);
  jOrbitMat = new THREE.MeshBasicMaterial({ color: "white" });
  jOrbit = new THREE.Mesh(jOrbitGeo, jOrbitMat);
  scene.add(jOrbit);
  jOrbit.rotation.x = Math.PI / 2;

  // Draw Io Orbit
  ioOrbitGeo = new THREE.TorusGeometry(ioDist, orbitLineWidth, 50, 100);
  ioOrbitMat = new THREE.MeshBasicMaterial({ color: "white" });
  ioOrbit = new THREE.Mesh(ioOrbitGeo, ioOrbitMat);
  ioOrbit.position.z = -jupDist;
  scene.add(ioOrbit);
  ioOrbit.rotation.x = Math.PI / 2;

  // Draw Europa Orbit
  euroOrbitGeo = new THREE.TorusGeometry(euroDist, orbitLineWidth, 50, 100);
  euroOrbitMat = new THREE.MeshBasicMaterial({ color: "white" });
  euroOrbit = new THREE.Mesh(euroOrbitGeo, euroOrbitMat);
  euroOrbit.position.z = -jupDist;
  scene.add(euroOrbit);
  euroOrbit.rotation.x = Math.PI / 2;

  // Draw Ganymede Orbit
  ganyOrbitGeo = new THREE.TorusGeometry(ganyDist, orbitLineWidth, 50, 100);
  ganyOrbitMat = new THREE.MeshBasicMaterial({ color: "white" });
  ganyOrbit = new THREE.Mesh(ganyOrbitGeo, ganyOrbitMat);
  ganyOrbit.position.z = -jupDist;
  scene.add(ganyOrbit);
  ganyOrbit.rotation.x = Math.PI / 2;

  // Draw Callisto Orbit
  calOrbitGeo = new THREE.TorusGeometry(calDist, orbitLineWidth, 50, 100);
  calOrbitMat = new THREE.MeshBasicMaterial({ color: "white" });
  calOrbit = new THREE.Mesh(calOrbitGeo, calOrbitMat);
  calOrbit.position.z = -jupDist;
  scene.add(calOrbit);
  calOrbit.rotation.x = Math.PI / 2;
}

function drawLines() {
  points1 = [];
  points1.push(new THREE.Vector3(0, 0, 0));
  points1.push(new THREE.Vector3(earth.position.x, earth.position.y, 0));
  const line1Geo = new THREE.BufferGeometry().setFromPoints(points1);
  const line1Mat = new THREE.LineBasicMaterial({
    color: 0x7cfc00,
    linewidth: 50
  });
  line1 = new THREE.Line(line1Geo, line1Mat);
  scene.add(line1);

  points2 = [];
  points2.push(new THREE.Vector3(0, 0, 0));
  points2.push(new THREE.Vector3(jupiter.position.x, jupiter.position.y, 0));
  const line2Geo = new THREE.BufferGeometry().setFromPoints(points2);
  const line2Mat = new THREE.LineBasicMaterial({
    color: 0x7cfc00,
    linewidth: 50
  });
  line2 = new THREE.Line(line2Geo, line2Mat);
  scene.add(line2);

  points3 = [];
  points3.push(new THREE.Vector3(earth.position.x, earth.position.y, 0));
  points3.push(new THREE.Vector3(jupiter.position.x, jupiter.position.y, 0));
  const line3Geo = new THREE.BufferGeometry().setFromPoints(points3);
  const line3Mat = new THREE.LineBasicMaterial({
    color: 0x7cfc00,
    linewidth: 50
  });
  line3 = new THREE.Line(line3Geo, line3Mat);
  scene.add(line3);
}

function removeObject(given) {
  scene.remove(given);
  given.material.dispose();
  given.geometry.dispose();
}

function removeLines() {
  removeObject(line1);
  removeObject(line2);
  removeObject(line3);
}

function removeOrbits() {
  removeObject(eOrbit);
  removeObject(jOrbit);
  removeObject(mOrbit);
  removeObject(ioOrbit);
  removeObject(ganyOrbit);
  removeObject(euroOrbit);
  removeObject(calOrbit);
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

// Initialize Scene
function init() {
    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x6a6a6a);

    camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        10000
    );
    renderer = new THREE.WebGLRenderer({canvas: artifactCanvas});
    renderer.setSize(window.innerWidth, window.innerHeight);

    drawObjects();

    if (viewAbove) {
        camera.position.y = 850;
        camera.rotation.x = -Math.PI / 2;
        light2 = new THREE.PointLight("white", 0.7);
        light2.position.set(0, 1000, 0);
        scene.add(light2);
    } else if (directlyHorizontal) {
        camera.position.z = 700;
        light2 = new THREE.PointLight("white", 0.7);
        light2.position.set(0, 0, 500);
        scene.add(light2);
    } else {
        camera.position.y = 50;
        camera.position.z = 700;
        light2 = new THREE.PointLight("white", 0.7);
        light2.position.set(0, 0, 500);
        scene.add(light2);
    }
    scene.add(camera);

    light1 = new THREE.PointLight("white");
    light1.position.set(0, 0, 0);
    scene.add(light1);

    if (showLines) {
        drawLines();
    }

    //document.body.appendChild(renderer.domElement);
}

// Go To Animation Loop
function animate() {
  requestAnimationFrame(animate);
  render();
}

function updatePlanets() {
  sun.position.x = 0;
  sun.position.y = 0;

  earth.position.x = earthDist * Math.cos(t - Math.PI / 2) + 0;
  earth.position.z = earthDist * Math.sin(t - Math.PI / 2) + 0;

  moon.position.x = moonDist * Math.cos(t * 12) + earth.position.x;
  moon.position.z = moonDist * Math.sin(t * 12) + earth.position.z;

  jupiter.position.x = jupDist * Math.cos(t / 12 - Math.PI / 2) + 0;
  jupiter.position.z = jupDist * Math.sin(t / 12 - Math.PI / 2) + 0;

  io.position.x = ioDist * Math.cos(t * 12) + jupiter.position.x;
  io.position.z = ioDist * Math.sin(t * 12) + jupiter.position.z;

  ganymede.position.x = ganyDist * Math.cos((t * 12) / 4) + jupiter.position.x;
  ganymede.position.z = ganyDist * Math.sin((t * 12) / 4) + jupiter.position.z;

  callisto.position.x = calDist * Math.cos((t * 12) / 9.4) + jupiter.position.x;
  callisto.position.z = calDist * Math.sin((t * 12) / 9.4) + jupiter.position.z;

  europa.position.x = euroDist * Math.cos((t * 12) / 2) + jupiter.position.x;
  europa.position.z = euroDist * Math.sin((t * 12) / 2) + jupiter.position.z;
}

function checkLineInput() {
  if (showLines) {
    if (!document.getElementById("lineInput").checked) {
      showLines = document.getElementById("lineInput").checked;
      removeLines();
    }
  } else {
    if (document.getElementById("lineInput").checked) {
      showLines = document.getElementById("lineInput").checked;
      drawLines();
    }
  }
}

function checkOrbitInput() {
  if (showOrbit) {
    if (document.getElementById("orbitInput").checked) {
      showOrbit = false;
      removeOrbits();
    }
  } else {
    if (!document.getElementById("orbitInput").checked) {
      showOrbit = true;
      drawOrbits();
    }
  }
}

function setJupiterCenter() {
  viewAbove = true;
  centerJupiter = true;
  directlyHorizontal = false;
  fixCamera();
}

function setMovingJupiter(){
  viewAbove = true;
  centerJupiter = false;
  directlyHorizontal = false;
  fixCamera();
}

function setHorizontalView(){
  viewAbove = false;
  centerJupiter = false;
  directlyHorizontal = true;
  fixCamera();
}

function setAboveView(){
  viewAbove = true;
  centerJupiter = false;
  directlyHorizontal = false;
  fixCamera();
}

// Animation Loop Function
var t = 0;
function render() {
  checkLineInput();
  checkOrbitInput();

  updatePlanets();

  if (showLines) {
    line1.geometry.attributes.position.array[3] = earth.position.x;
    line1.geometry.attributes.position.array[5] = earth.position.z;
    line1.geometry.attributes.position.needsUpdate = true;

    line2.geometry.attributes.position.array[3] = jupiter.position.x;
    line2.geometry.attributes.position.array[5] = jupiter.position.z;
    line2.geometry.attributes.position.needsUpdate = true;

    line3.geometry.attributes.position.array[0] = earth.position.x;
    line3.geometry.attributes.position.array[2] = earth.position.z;
    line3.geometry.attributes.position.array[3] = jupiter.position.x;
    line3.geometry.attributes.position.array[5] = jupiter.position.z;
    line3.geometry.attributes.position.needsUpdate = true;
  }

  if (showOrbit) {
    mOrbit.position.x = earth.position.x;
    mOrbit.position.z = earth.position.z;
    ioOrbit.position.x = jupiter.position.x;
    ioOrbit.position.z = jupiter.position.z;
    ganyOrbit.position.x = jupiter.position.x;
    ganyOrbit.position.z = jupiter.position.z;
    euroOrbit.position.x = jupiter.position.x;
    euroOrbit.position.z = jupiter.position.z;
    calOrbit.position.x = jupiter.position.x;
    calOrbit.position.z = jupiter.position.z;
  }

  if (centerJupiter) {
    camera.rotation.z = camera.rotation.z - 0.0000833333;
  }

  renderer.render(scene, camera);
  t += 0.001;
}
