/**
 * PixelNode Agency - Master Script
 * Updated: Mobile-Optimized Scroll Indicator + Wave Grid + EmailJS
 */

window.onload = function() {
    
    // --- 1. NODE PRE-LOADER ---
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.visibility = 'hidden', 400);
            document.body.style.overflow = 'auto';
        }, 1000);
    }

    // --- 2. 3D WAVE GRID ENGINE ---
    const container = document.getElementById('canvas-container');
    if (container && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance cap for mobile
        container.appendChild(renderer.domElement);

        // WAVE GRID GEOMETRY
        const gridCount = window.innerWidth < 768 ? 30 : 50; // Fewer points on mobile for speed
        const spacing = 4;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(gridCount * gridCount * 3);

        for (let i = 0; i < gridCount; i++) {
            for (let j = 0; j < gridCount; j++) {
                positions[(i * gridCount + j) * 3] = (i - gridCount / 2) * spacing;
                positions[(i * gridCount + j) * 3 + 1] = 0;
                positions[(i * gridCount + j) * 3 + 2] = (j - gridCount / 2) * spacing;
            }
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ 
            color: 0xa855f7, 
            size: 0.15, 
            transparent: true, 
            opacity: 0.6 
        });
        const grid = new THREE.Points(geometry, material);
        grid.position.y = -15;
        scene.add(grid);

        camera.position.z = 60;

        // Interaction Variables
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) / 100;
            mouseY = (e.clientY - window.innerHeight / 2) / 100;
        });

        function animate(time) {
            requestAnimationFrame(animate);
            
            // 1. Animate Wave Grid
            const posAttr = grid.geometry.attributes.position;
            for (let i = 0; i < gridCount; i++) {
                for (let j = 0; j < gridCount; j++) {
                    const idx = (i * gridCount + j) * 3 + 1;
                    const x = posAttr.array[idx - 1];
                    const z = posAttr.array[idx + 1];
                    const dist = Math.sqrt(x*x + z*z);
                    posAttr.array[idx] = Math.sin(dist * 0.1 - time * 0.002) * 2;
                }
            }
            grid.geometry.attributes.position.needsUpdate = true;

            // 2. Camera Movement
            camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
            camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }
        animate(0);

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // --- 3. SCROLL PERCENTAGE INDICATOR (Node_Sync) ---
    const scrollValue = document.getElementById('scroll-value');
    const scrollIndicator = document.getElementById('scroll-percentage');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        
        const scrollPercent = Math.round((scrollTop / (docHeight - winHeight)) * 100);
        
        if (scrollValue) {
            const finalValue = Math.min(Math.max(scrollPercent, 0), 100);
            scrollValue.innerText = finalValue;
        }

        // Auto-hide indicator at very top on mobile to keep nav clean
        if (window.innerWidth < 768 && scrollIndicator) {
            if (scrollTop < 50) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.transition = 'opacity 0.3s ease';
            }
        }
    });

    // --- 4. SCROLL & MODAL LOGIC ---
    const openBtns = document.querySelectorAll('.open-form');
    const modal = document.getElementById('contact-modal');
    
    openBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            if(modal) {
                modal.classList.remove('opacity-0', 'pointer-events-none');
                modal.classList.add('opacity-100', 'pointer-events-auto');
                document.body.style.overflow = 'hidden';
            }
        }
    });

    const closeModalBtn = document.getElementById('close-modal');
    if (closeModalBtn) {
        closeModalBtn.onclick = () => {
            modal.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = 'auto';
        };
    }

    // --- 5. EMAILJS ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm && typeof emailjs !== 'undefined') {
        emailjs.init("qXaVHzfPPW5hguL47");
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = document.getElementById('button');
            btn.innerText = "SENDING NODE...";
            emailjs.sendForm('service_8uqw275', 'template_uk0c9ey', this)
                .then(() => {
                    btn.innerText = "SUCCESS!";
                    setTimeout(() => {
                        modal.classList.add('opacity-0', 'pointer-events-none');
                        document.body.style.overflow = 'auto';
                        btn.innerText = "Initiate Handshake";
                    }, 2000);
                });
        });
    }

    // --- 6. SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== "#") {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80, 
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
};