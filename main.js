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
    object.position.set(0, 0, 0); // Ajuster la position si nécessaire
    scene.add(object);
  });
});

// Fonction d'interpolation linéaire
function lerp(x, y, a) {
  return (1 - a) * x + a * y;
}

angle = 0;

// Animation des scènes basées sur le défilement
const animationScripts = [
  {
    start: 0,
    end: 20,
    func: () => {
      camera.position.z = lerp(20, 10, scalePercent(0, 20));
      // Déplacer la caméra autour de l'axe Y (rotation autour de l'objet)
      const radius = lerp(25, 30, scalePercent(0, 20)); // Distance entre la caméra et la statue
      angle += 0.001; // Vitesse de rotation
      camera.position.x = radius * Math.sin(angle); // Calcul de la position X
      camera.position.z = radius * Math.cos(angle); // Calcul de la position Z
      camera.position.y = lerp(10, 1, scalePercent(0, 20));

      camera.lookAt(0, 10, 0); // Toujours regarder le centre de la statue
    },
  },
  {
    start: 20,
    end: 40,
    func: () => {
      angle = lerp(0, 1, scalePercent(20, 40));
      camera.rotation.y = 0;
      const radius = 15; // Distance entre la caméra et la statue
      camera.position.x = radius * Math.sin(angle); // Calcul de la position X // Calcul de la position X
      camera.position.y = lerp(1, 25, scalePercent(20, 40));
      camera.position.z = lerp(
        radius * Math.cos(angle),
        50,
        scalePercent(20, 40)
      ); // Calcul de la position Z

      camera.lookAt(-10, 15, 0); // Toujours regarder le centre de la statue
    },
  },
  {
    start: 40,
    end: 60,
    func: () => {
      angle = lerp(0, 1, scalePercent(20, 40));
      camera.rotation.y = 0;
      const radius = 15; // Distance entre la caméra et la statue
      camera.position.x = radius * Math.sin(angle); // Calcul de la position X // Calcul de la position X
      camera.position.y = lerp(1, 25, scalePercent(20, 40));
      camera.position.z = lerp(
        radius * Math.cos(angle),
        50,
        scalePercent(20, 40)
      ); // Calcul de la position Z

      camera.lookAt(-10, 15, 0); // Toujours regarder le centre de la statue
    },
  },
  {
    start: 60,
    end: 80,
    func: () => {
      angle = lerp(0, 1, scalePercent(20, 40));
      camera.rotation.y = 0;
      const radius = 15; // Distance entre la caméra et la statue
      camera.position.x = radius * Math.sin(angle); // Calcul de la position X // Calcul de la position X
      camera.position.y = lerp(1, 10, scalePercent(60, 80));
      camera.position.z = lerp(
        radius * Math.cos(angle),
        10,
        scalePercent(20, 40)
      ); // Calcul de la position Z

      camera.lookAt(-10, 15, 0); // Toujours regarder le centre de la statue
    },
  },
  {
    start: 80,
    end: 90,
    func: () => {
      angle = lerp(0, 1, scalePercent(20, 40));
      camera.rotation.y = 0;
      const radius = 15; // Distance entre la caméra et la statue
      camera.position.x = radius * Math.sin(angle); // Calcul de la position X // Calcul de la position X
      camera.position.y = lerp(1, 10, scalePercent(80, 90));
      camera.position.z = lerp(
        radius * Math.cos(angle),
        10,
        scalePercent(20, 40)
      ); // Calcul de la position Z

      camera.lookAt(0, 20, 0); // Toujours regarder le centre de la statue
    },
  },
  {
    start: 90,
    end: 120,
    func: () => {
      camera.rotation.y = 0;
      const radius = lerp(15, 10, scalePercent(90, 120)); // Distance entre la caméra et la statue
      camera.position.y = lerp(1, 10, scalePercent(90, 120));
      angle += 0.001; // Vitesse de rotation
      camera.position.x = radius * Math.sin(angle); // Calcul de la position X
      camera.position.z = radius * Math.cos(angle); // Calcul de la position Z

      camera.lookAt(0, 10, 0); // Toujours regarder le centre de la statue
    },
  },
];

// Calcul du pourcentage de défilement
function scalePercent(start, end) {
  return (scrollPercent - start) / (end - start);
}

let scrollPercent = 0;
document.body.onscroll = () => {
  scrollPercent =
    ((document.documentElement.scrollTop || document.body.scrollTop) /
      ((document.documentElement.scrollHeight || document.body.scrollHeight) -
        document.documentElement.clientHeight)) *
    100;
  document.getElementById("scrollProgress").innerText =
    "Scroll Progress : " + scrollPercent.toFixed(2);
};

function playScrollAnimations() {
  animationScripts.forEach((a) => {
    if (scrollPercent >= a.start && scrollPercent < a.end) {
      a.func();
    }
  });
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

let lastScrollTop = 0;

function scrollToScene(direction) {
  const scrollAmountVH = 200; // Chaque scène fait 100vh
  const scrollAmount = (scrollAmountVH / 100) * window.innerHeight; // Conversion en pixels

  const currentScroll = window.scrollY;
  let nextSceneScroll;

  // Calculer la prochaine scène en fonction du sens du défilement
  if (direction === "down") {
    nextSceneScroll = Math.ceil(currentScroll / scrollAmount) * scrollAmount; // Vers la scène suivante
  } else {
    nextSceneScroll = Math.floor(currentScroll / scrollAmount) * scrollAmount; // Vers la scène précédente
  }

  const scrollDuration = 1000; // Durée de l'animation en ms
  const startTime = Date.now();

  function scrollStep() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / scrollDuration, 1); // Limiter à 1

    // Calcul de la position avec easing
    const ease = easeInOutQuad(progress);
    const scrollPosition =
      currentScroll + (nextSceneScroll - currentScroll) * ease;

    window.scrollTo(0, scrollPosition);

    if (progress < 1) {
      requestAnimationFrame(scrollStep);
    }
  }

  requestAnimationFrame(scrollStep);
}

// Détecter le sens du scroll manuel de l'utilisateur
let isUserScrolling = false;
let autoScrollTimeout;

window.addEventListener("scroll", () => {
  isUserScrolling = true;

  clearTimeout(autoScrollTimeout);

  const currentScrollTop = window.scrollY;

  // Détecter si l'utilisateur scrolle vers le haut ou vers le bas
  let scrollDirection = currentScrollTop > lastScrollTop ? "down" : "up";
  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // Ne pas descendre en dessous de 0

  // Lancer l'auto-scroll après une pause du scroll manuel
  autoScrollTimeout = setTimeout(() => {
    isUserScrolling = false;
    scrollToScene(scrollDirection); // Scroll automatique vers la scène dans la bonne direction
  }, 750); // Temps d'attente après l'arrêt du scroll manuel
});

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

// Animation pour faire tourner la caméra autour du buste

function animate() {
  requestAnimationFrame(animate);

  playScrollAnimations();

  renderer.render(scene, camera);
}

animate();
