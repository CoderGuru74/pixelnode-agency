/**
 * PixelNode Agency - Master Script
 */

window.onload = function() {
    
    // --- 1. MOBILE MENU & SIDEBAR LOGIC ---
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('menu-overlay');
    const menuLinks = document.querySelectorAll('#mobile-menu a');

    // FORCED RESET: Ensure menu is hidden off-screen every time a new page loads
    if (mobileMenu) mobileMenu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = 'auto';

    const toggleMenu = () => {
        if (!mobileMenu || !overlay) return;
        mobileMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Prevent background scrolling when menu is open
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    };

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    // AUTO-CLOSE: When any link is clicked, close the menu immediately
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // --- 2. 3D TORUS ENGINE (MOBILE OPTIMIZED) ---
    const container = document.getElementById('canvas-container');
    if (container) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
        const material = new THREE.MeshNormalMaterial({ wireframe: true, transparent: true, opacity: 0.4 });
        const shape = new THREE.Mesh(geometry, material);

        if(window.innerWidth < 768) {
            shape.scale.set(0.6, 0.6, 0.6); 
            shape.position.set(0, 5, 0);
        } else {
            shape.position.x = 20;
        }

        scene.add(shape);
        camera.position.z = 40;

        function animate3D() {
            requestAnimationFrame(animate3D);
            shape.rotation.x += 0.003;
            shape.rotation.y += 0.004;
            renderer.render(scene, camera);
        }
        animate3D();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // --- 3. TESTIMONIAL SWIPER ---
    const swiperTestimonial = document.querySelector('.testimonial-swiper');
    if (swiperTestimonial && typeof Swiper !== 'undefined') {
        new Swiper('.testimonial-swiper', {
            effect: 'cards',
            grabCursor: true,
            loop: true,
            autoplay: { delay: 4000, disableOnInteraction: false },
        });
    }

    // --- 4. CONTACT FORM (EMAILJS) ---
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('button');

    if (contactForm) {
        emailjs.init("qXaVHzfPPW5hguL47"); 

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            submitBtn.innerText = 'SENDING NODE...';
            submitBtn.disabled = true;

            emailjs.sendForm('service_8uqw275', 'template_uk0c9ey', this)
                .then(() => {
                    submitBtn.innerText = 'SUCCESS!';
                    submitBtn.style.backgroundColor = '#a855f7';
                    alert('Node Request Sent Successfully!');
                    contactForm.reset();
                    setTimeout(() => {
                        submitBtn.innerText = 'SEND NODE REQUEST';
                        submitBtn.disabled = false;
                        submitBtn.style.backgroundColor = '#ffffff';
                    }, 5000);
                }, (err) => {
                    submitBtn.innerText = 'FAILED';
                    submitBtn.disabled = false;
                    alert('Error: ' + JSON.stringify(err));
                });
        });
    }
};