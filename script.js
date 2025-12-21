window.onload = function() {
    
    // 1. HOME PAGE 3D (Only if container exists)
    const container = document.getElementById('canvas-container');
    if (container) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const geometry = new THREE.TorusKnotGeometry(12, 3, 150, 20);
        const material = new THREE.MeshNormalMaterial({ wireframe: true });
        const shape = new THREE.Mesh(geometry, material);

        shape.position.x = (window.innerWidth > 768) ? 18 : 0;
        scene.add(shape);
        camera.position.z = 40;

        function animate3D() {
            requestAnimationFrame(animate3D);
            shape.rotation.x += 0.004;
            shape.rotation.y += 0.006;
            shape.position.y = Math.sin(Date.now() * 0.0008) * 3;
            renderer.render(scene, camera);
        }
        animate3D();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            shape.position.x = (window.innerWidth > 768) ? 18 : 0;
        });
    }

    // 2. SERVICES PAGE TESTIMONIALS (Stacked Cards)
    const swiperTestimonial = document.querySelector('.testimonial-swiper');
    if (swiperTestimonial) {
        new Swiper('.testimonial-swiper', {
            effect: 'cards',
            grabCursor: true,
            perSlideOffset: 12,
            perSlideRotate: 4,
            rotate: true,
            slideShadows: true,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
        });
    }
};