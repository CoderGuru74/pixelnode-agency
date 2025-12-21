/**
 * PixelNode Agency - Master Script
 * Includes: 3D Torus, Swiper Stacked Cards, and EmailJS Integration
 */

window.onload = function() {
    
    // --- 1. HOME PAGE: 3D TORUS ENGINE ---
    const container = document.getElementById('canvas-container');
    
    if (container) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // High-Quality Dynamic Torus Knot
        const geometry = new THREE.TorusKnotGeometry(12, 3, 200, 32);
        const material = new THREE.MeshNormalMaterial({ 
            wireframe: true,
            transparent: true,
            opacity: 0.5 
        });
        const shape = new THREE.Mesh(geometry, material);

        // Position for Desktop
        shape.position.x = (window.innerWidth > 768) ? 20 : 0;
        scene.add(shape);
        
        camera.position.z = 45;

        function animate3D() {
            requestAnimationFrame(animate3D);
            shape.rotation.x += 0.003;
            shape.rotation.y += 0.004;
            shape.position.y = Math.sin(Date.now() * 0.0007) * 4;
            renderer.render(scene, camera);
        }
        animate3D();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            shape.position.x = (window.innerWidth > 768) ? 20 : 0;
        });
    }

    // --- 2. SERVICES PAGE: STACKED CARDS ---
    const swiperTestimonial = document.querySelector('.testimonial-swiper');
    if (swiperTestimonial && typeof Swiper !== 'undefined') {
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

    // --- 3. CONTACT PAGE: EMAILJS INTEGRATION ---
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('button');

    if (contactForm) {
        // Initialize EmailJS with your Public Key
        // TO GET THIS: Go to EmailJS Dashboard > Account > API Keys
        emailjs.init("qXaVHzfPPW5hguL47"); 

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Visual feedback: Start Sending
            submitBtn.innerText = 'SENDING NODE...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Your Specific IDs
            const serviceID = 'service_8uqw275';
            const templateID = 'template_uk0c9ey';

            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    // Visual feedback: Success
                    submitBtn.innerText = 'SUCCESS!';
                    submitBtn.style.backgroundColor = '#a855f7'; // PixelNode Purple
                    submitBtn.style.color = '#ffffff';
                    
                    alert('Node Request Sent Successfully! We will contact you at pixelnodeofficial@gmail.com');
                    
                    contactForm.reset(); // Clear form fields

                    // Reset button back to normal after 5 seconds
                    setTimeout(() => {
                        submitBtn.innerText = 'SEND NODE REQUEST';
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.style.backgroundColor = '#ffffff';
                        submitBtn.style.color = '#000000';
                    }, 5000);

                }, (err) => {
                    // Visual feedback: Error
                    submitBtn.innerText = 'FAILED TO SEND';
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.backgroundColor = '#ff4444'; // Red for error
                    
                    alert('Error: ' + JSON.stringify(err));
                    console.error('EmailJS Error:', err);
                });
        });
    }
};