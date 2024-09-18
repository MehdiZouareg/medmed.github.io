// Initialisation de la scène, caméra et rendu
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0cfc3); // Ajouter un fond bleu ciel

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas3d"),
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio); // Adapter à la résolution de l'écran
renderer.setSize(window.innerWidth, window.innerHeight);

// Ajouter une lumière ambiante
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Lumière douce
scene.add(ambientLight);

// Ajouter une lumière directionnelle (comme le soleil)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Lumière blanche forte
directionalLight.position.set(10, 10, 10); // Position de la lumière
scene.add(directionalLight);

// Créer une texture damier programmatique
const size = 64; // Taille de la texture
const data = new Uint8Array(4 * size * size);
for (let i = 0; i < size * size; i++) {
  const stride = i * 4;
  const x = i % size;
  const y = Math.floor(i / size);
  const isWhite =
    (x % 64 < 32 && y % 64 < 32) || (x % 64 >= 32 && y % 64 >= 32);
  const color = isWhite ? 255 : 0; // Damier noir et blanc

  data[stride] = data[stride + 1] = data[stride + 2] = color; // Couleur R, G, B
  data[stride + 3] = 255; // Alpha
}

const damierTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
damierTexture.wrapS = damierTexture.wrapT = THREE.RepeatWrapping;
damierTexture.repeat.set(10, 10); // Répéter le damier sur 10x10 unités

// Appliquer la texture damier à un matériau
const damierMaterial = new THREE.MeshBasicMaterial({
  map: damierTexture,
  side: THREE.DoubleSide,
});

// Créer un sol avec la texture damier
const geometry = new THREE.PlaneGeometry(100, 100);
const plane = new THREE.Mesh(geometry, damierMaterial);
plane.rotation.x = Math.PI / 2; // Faire pivoter le plan pour qu'il soit à plat
scene.add(plane);

// Position initiale de la caméra
camera.position.set(0, 20, 10);

// Charger le buste d'Hélios
const mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath("helios/");
mtlLoader.load("heliosbust.mtl", (materials) => {
  materials.preload();
  const objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath("helios/");
  objLoader.load("heliosbust.obj", (object) => {
    object.scale.set(0.75, 0.75, 0.75); // Adapter la taille si besoin
    object.position.set(0, 1, 0); // Ajuster la position si nécessaire
    scene.add(object);
  });
});

// Rail de la caméra (exemple simple)
let scrollY = window.scrollY;
const maxScroll = document.body.scrollHeight - window.innerHeight;

// Rail de la caméra (déplacement sur l'axe Z en fonction du scroll)
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY; // Position verticale du scroll
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const t = scrollY / maxScroll; // Ratio de défilement

  console.log("scrollY:", scrollY, "maxScroll:", maxScroll, "t:", t); // Pour déboguer le scroll
});

// Animation pour faire tourner la caméra autour du buste
let angle = 0; // Angle initial de la caméra

function animate() {
  requestAnimationFrame(animate);

  // Déplacer la caméra autour de l'axe Y (rotation autour de l'objet)
  const radius = 25; // Distance entre la caméra et la statue
  angle += 0.001; // Vitesse de rotation
  camera.position.x = radius * Math.sin(angle); // Calcul de la position X
  camera.position.z = radius * Math.cos(angle); // Calcul de la position Z

  camera.lookAt(0, 15, 0); // Toujours regarder le centre de la statue

  renderer.render(scene, camera);
}

animate();
