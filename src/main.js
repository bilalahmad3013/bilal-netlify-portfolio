import * as THREE from 'three';
import { TweenMax, Power1 } from 'gsap';

let renderer, scene, camera;
let width, height, cx, cy, wWidth, wHeight;

const conf = {
  color: '#a64a44',
  objectWidth: 12,
  objectThickness: 3,
  ambientColor: 'white',
  light1Color: 'white',
  shadow: true,
  perspective: 75,
  cameraZ: 75,
};

let objects = [];
let geometry, material;
let textMesh;
let nx, ny;

init();

function init() {
  const canvas = document.getElementById('reveal-effect');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(conf.perspective, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = conf.cameraZ;

  scene = new THREE.Scene();
  geometry = new THREE.BoxGeometry(conf.objectWidth, conf.objectWidth, conf.objectThickness);

  window.addEventListener('resize', onResize);
  window.addEventListener('load', initScene);

  animate();
}

function initScene() {
  onResize();
  resetScene();
  initLights();
  initObjects();
  initIcons(); 
}

function resetScene() {
  scene.clear();
  objects = [];
}

function initLights() {
  const ambientLight = new THREE.AmbientLight(conf.ambientColor, 0.8);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(conf.light1Color, 1.2, 200);
  pointLight.position.set(0, 0, 100);
  scene.add(pointLight);
}

function initObjects() {
  nx = Math.round(wWidth / conf.objectWidth) + 1;
  ny = Math.round(wHeight / conf.objectWidth) + 1;

  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      material = new THREE.MeshLambertMaterial({ color: conf.color, transparent: true, opacity: 1 });
      const mesh = new THREE.Mesh(geometry, material);

      const x = -wWidth / 2 + i * conf.objectWidth;
      const y = -wHeight / 2 + j * conf.objectWidth;
      mesh.position.set(x, y, 0);

      objects.push(mesh);
      scene.add(mesh);
    }
  }
}

function initIcons() {
  const icons = [
    { src: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Ruby_On_Rails_Logo.svg' },   
    { src: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Ruby_logo.svg' },        
    { src: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png' }    
  ];

  const loader = new THREE.TextureLoader();
  const angleStep = (2 * Math.PI) / icons.length;  
  const planes = [];

  icons.forEach((icon, index) => {
    loader.load(icon.src, (texture) => {
      const geometry = new THREE.PlaneGeometry(4, 4);
      const material = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        emissive: new THREE.Color(0x333333),
        emissiveIntensity: 1,
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(0, 0, 10);
      plane.renderOrder = 999 + index;
      material.depthTest = false;
      scene.add(plane);
      
      planes.push(plane);

      const delay = THREE.MathUtils.randFloat(0.5, 1);      
      TweenMax.to(plane.position, 2, { 
        x: Math.cos(angleStep * index) * 15, 
        y: Math.sin(angleStep * index) * 15, 
        z: 50,
        delay, 
        ease: Power1.easeOut
      });      
      TweenMax.to(plane.material, 2, { opacity: 1, delay, ease: Power1.easeOut });      
      TweenMax.to(plane.material, 2, { opacity: 0, delay: delay + 1, ease: Power1.easeOut });
    });
  });

  startAnim();
}

setTimeout(() => {
  let box = document.getElementById('main-box');
  box.style.display = 'flex';

  setTimeout(() => {
    box.style.opacity = '1';
    if (window.innerWidth < 1250) {
      box.style.flexDirection = 'column';
    } else {
      box.style.flexDirection = 'row';
    }
  }, 50);
}, 1500);

window.addEventListener('resize', () => {
  let box = document.getElementById('main-box');  
  if (window.innerWidth < 1250) {
    box.style.flexDirection = 'column';
  } else {
    box.style.flexDirection = 'row';
  }
});


function startAnim() {
  objects.forEach((mesh) => {
    mesh.rotation.set(0, 0, 0);
    mesh.material.opacity = 1;
    mesh.position.z = 0;

    const delay = THREE.MathUtils.randFloat(1, 0);
    const rx = THREE.MathUtils.randFloatSpread(2 * Math.PI);
    const ry = THREE.MathUtils.randFloatSpread(2 * Math.PI);
    const rz = THREE.MathUtils.randFloatSpread(2 * Math.PI);

    TweenMax.to(mesh.rotation, 2, { x: rx, y: ry, z: rz, delay });
    TweenMax.to(mesh.position, 2, { z: 80, delay: delay + 0.5, ease: Power1.easeOut });
    TweenMax.to(mesh.material, 2, { opacity: 0, delay: delay + 0.5 });
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function onResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  cx = width / 2;
  cy = height / 2;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);

  const size = getRendererSize();
  wWidth = size[0];
  wHeight = size[1];
}

function getRendererSize() {
  const cam = new THREE.PerspectiveCamera(conf.perspective, camera.aspect);
  const vFOV = (cam.fov * Math.PI) / 180;
  const height = 2 * Math.tan(vFOV / 2) * Math.abs(conf.cameraZ);
  const width = height * cam.aspect;
  return [width, height];
}

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");


select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {   
    let selectedValue = this.innerText.toLowerCase();   
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {     
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {      
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}
