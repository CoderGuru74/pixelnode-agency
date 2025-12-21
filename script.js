/**
 * PixelNode Agency - Master Script
 * Handles 3D Background Engine & Interactive Components
 */

window.onload = function() {
    
    // --- 1. HOME PAGE: 3D TORUS ENGINE ---
    // This only runs if 'canvas-container' is present in the HTML (Home Page)
    const container = document.getElementById('canvas-container');
    
    if (container) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Transparent renderer to work with our CSS background
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Geometry: The iconic Torus Knot for PixelNode
        const geometry = new THREE.TorusKnotGeometry(12, 3.5, 150, 20);
        const material = new THREE.MeshNormalMaterial({ 
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        const shape = new THREE.Mesh(geometry, material);

        // Position: Align to the right side on desktop for the Hero layout
        shape.position.x = (window.innerWidth > 768) ? 18 : 0;
        scene.add(shape);
        
        camera.position.z = 40;

        // Animation Loop for 3D
        function animate3D() {
            requestAnimationFrame(animate3D);
            
            // Kinetic Rotation
            shape.rotation.x += 0.004;
            shape.rotation.y += 0.006;
            
            // Subtle "Floating" effect
            shape.position.y = Math.sin(Date.now() * 0.0008) * 2.5;
            
            renderer.render(scene, camera);
        }
        animate3D();

        // Responsive Resize Handler
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            
            // Re-adjust position based on new screen size
            shape.position.x = (window.innerWidth > 768) ? 18 : 0;
        });
        
        console.log("3D Node Engine: Online");
    }


    // --- 2. SERVICES PAGE: STACKED TESTIMONIAL CARDS ---
    // This only runs if the swiper element exists (Services Page)
    const swiperTestimonial = document.querySelector('.testimonial-swiper');
    
    if (swiperTestimonial && typeof Swiper !== 'undefined') {
        new Swiper('.testimonial-swiper', {
            effect: 'cards',
            grabCursor: true,
            perSlideOffset: 12, // Visual gap between stacked cards
            perSlideRotate: 3,  // Professional rotation angle
            rotate: true,
            slideShadows: true,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
        });
        console.log("Testimonial Stack: Initialized");
    }


    // --- 3. GLOBAL: SMOOTH SCROLL & INTERACTION ---
    // Prevents link jumping for a smoother agency feel
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
};