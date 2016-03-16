/**
 * UBC CPSC 314, January 2016
 * Project 3 Template
 */

var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 10000);
camera.position.set(10, 15, 40);
camera.lookAt(scene.position);
scene.add(camera);

// SETUP ORBIT CONTROL OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;

// ADAPT TO WINDOW RESIZE
function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

// FLOOR WITH CHECKERBOARD 
var floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4, 4);

var floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide});
var floorGeometry = new THREE.PlaneBufferGeometry(30, 30);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
floor.rotation.x = Math.PI / 2;
scene.add(floor);

// LIGHTING UNIFORMS
var lightColor = new THREE.Color(1, 1, 1);
var ambientColor = new THREE.Color(0.4, 0.4, 0.4);
var lightPosition = new THREE.Vector3(70, 100, 70);

var litColor = new THREE.Color(0.3, 0.4, 0.6);
var unLitColor = new THREE.Color(0.15, 0.2, 0.3);
var outlineColor = new THREE.Color(0.04, 0.1, 0.15);

var litArmadilloColor = new THREE.Color(0.15, 0.6, 0.3);
var unLitArmadilloColor = new THREE.Color(0.04, 0.3, 0.15);

var kAmbient = 0.4;
var kDiffuse = 0.8;
var kSpecular = 0.8;
var shininess = 10.0;
var toneBalance = 0.5;

// MATERIALS
var gouraudMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightColor: {type: 'c', value: lightColor},
        ambientColor: {type: 'c', value: ambientColor},
        lightPosition: {type: 'v3', value: lightPosition},
    },
});

var phongMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightColor: {type: 'c', value: lightColor},
        ambientColor: {type: 'c', value: ambientColor},
        lightPosition: {type: 'v3', value: lightPosition},
    },
});

var blinnphongMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightColor: {type: 'c', value: lightColor},
        ambientColor: {type: 'c', value: ambientColor},
        lightPosition: {type: 'v3', value: lightPosition},
    },
});

var coolwarmMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightColor: {type: 'c', value: lightColor},
        ambientColor: {type: 'c', value: ambientColor},
        lightPosition: {type: 'v3', value: lightPosition},
    },
});

shaderFiles = [
    'glsl/gouraud.vs.glsl',
    'glsl/gouraud.fs.glsl',
    'glsl/phong.vs.glsl',
    'glsl/phong.fs.glsl',
    'glsl/blinnphong.vs.glsl',
    'glsl/blinnphong.fs.glsl',
    'glsl/coolwarm.vs.glsl',
    'glsl/coolwarm.fs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
    gouraudMaterial.vertexShader = shaders['glsl/gouraud.vs.glsl'];
    gouraudMaterial.fragmentShader = shaders['glsl/gouraud.fs.glsl'];
    gouraudMaterial.needsUpdate = true;
    gouraudMaterial.wireframe = true;

    phongMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
    phongMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];
    phongMaterial.needsUpdate = true;

    blinnphongMaterial.vertexShader = shaders['glsl/blinnphong.vs.glsl'];
    blinnphongMaterial.fragmentShader = shaders['glsl/blinnphong.fs.glsl'];
    blinnphongMaterial.needsUpdate = true;

    coolwarmMaterial.vertexShader = shaders['glsl/coolwarm.vs.glsl'];
    coolwarmMaterial.fragmentShader = shaders['glsl/coolwarm.fs.glsl'];
    coolwarmMaterial.needsUpdate = true;
})

// LOAD ARMADILLO
var armadillo
function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
    var onProgress = function (query) {
        if (query.lengthComputable) {
            var percentComplete = query.loaded / query.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function () {
        console.log('Failed to load ' + file);
    };

    var loader = new THREE.OBJLoader()
    loader.load(file, function (object) {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
        });

        object.position.set(xOff, yOff, zOff);
        object.rotation.x = xRot;
        object.rotation.y = yRot;
        object.rotation.z = zRot;
        object.scale.set(scale, scale, scale);
        object.parent = floor;
        scene.add(object);
        armadillo = object;

    }, onProgress, onError);
}

loadOBJ('obj/armadillo.obj', gouraudMaterial, 3, 0, 3, -2, 0, Math.PI, 0);

// CREATE SPHERES
var sphere = new THREE.SphereGeometry(1, 32, 32);
var gem_gouraud = new THREE.Mesh(sphere, gouraudMaterial); // tip: make different materials for each sphere
gem_gouraud.position.set(-3, 1, -1);
scene.add(gem_gouraud);
gem_gouraud.parent = floor;

var gem_phong = new THREE.Mesh(sphere, phongMaterial);
gem_phong.position.set(-1, 1, -1);
scene.add(gem_phong);
gem_phong.parent = floor;

var gem_phong_blinn = new THREE.Mesh(sphere, blinnphongMaterial);
gem_phong_blinn.position.set(1, 1, -1);
scene.add(gem_phong_blinn);
gem_phong_blinn.parent = floor;

var gem_toon = new THREE.Mesh(sphere, coolwarmMaterial);
gem_toon.position.set(3, 1, -1);
scene.add(gem_toon);
gem_toon.parent = floor;

// SETUP UPDATE CALL-BACK
var keyboard = new THREEx.KeyboardState();
var render = function () {
    // tip: change armadillo shading here according to keyboard

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

keyboard.domElement.addEventListener('keydown', onKeyDown);

function onKeyDown(event) {
    if (keyboard.eventMatches(event, "1")) {
        for (var i in armadillo.children) {
            armadillo.children[i].material = gouraudMaterial;
        }
    } else if (keyboard.eventMatches(event, "2")) {
        for (var i in armadillo.children) {
            armadillo.children[i].material = phongMaterial;
        }
    } else if (keyboard.eventMatches(event, "3")) {
        for (var i in armadillo.children) {
            armadillo.children[i].material = blinnphongMaterial;
        }
    } else if (keyboard.eventMatches(event, "4")) {
        for (var i in armadillo.children) {
            armadillo.children[i].material = coolwarmMaterial;
        }
    }
}

render();
