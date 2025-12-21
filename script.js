window.onload = function() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Torus Knot Geometry (Visible & Professional)
    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    const shape = new THREE.Mesh(geometry, material);

    shape.position.x = (window.innerWidth > 768) ? 15 : 0;
    scene.add(shape);
    camera.position.z = 35;

    function animate() {
        requestAnimationFrame(animate);
        shape.rotation.x += 0.005;
        shape.rotation.y += 0.005;
        shape.position.y = Math.sin(Date.now() * 0.001) * 2;
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        shape.position.x = (window.innerWidth > 768) ? 15 : 0;
    });

    animate();
};