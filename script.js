/**
 * PixelNode Agency - Master Script
 * Updated: Mobile-Optimized Scroll Indicator + Wave Grid + EmailJS + Modal Repair
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
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
        container.appendChild(renderer.domElement);

        const gridCount = window.innerWidth < 768 ? 30 : 50; 
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

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) / 100;
            mouseY = (e.clientY - window.innerHeight / 2) / 100;
        });

        function animate(time) {
            requestAnimationFrame(animate);
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
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = Math.round((scrollTop / docHeight) * 100);
        
        if (scrollValue) {
            scrollValue.innerText = Math.min(Math.max(scrolled, 0), 100);
        }
    });

    // --- 4. MODAL & NAVIGATION LOGIC (REPAIRED) ---
    const modal = document.getElementById('contact-modal');
    const openBtns = document.querySelectorAll('.open-form');
    const closeBtnX = document.getElementById('close-modal-x');

    // Function to show modal
    const showModal = (e) => {
        if(e) e.preventDefault();
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('modal-active');
                document.body.style.overflow = 'hidden'; // Lock scroll
            }, 10);
        }
    };

    // Function to hide modal
    const hideModal = () => {
        if(modal) {
            modal.classList.remove('modal-active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Unlock scroll
            }, 500);
        }
    };

    openBtns.forEach(btn => btn.addEventListener('click', showModal));

    if (closeBtnX) {
        closeBtnX.onclick = (e) => {
            e.stopPropagation();
            hideModal();
        };
    }

    // Close on background click
    window.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });

    // --- 5. EMAILJS ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm && typeof emailjs !== 'undefined') {
        emailjs.init("qXaVHzfPPW5hguL47");
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = document.getElementById('button');
            const originalText = btn.innerText;
            btn.innerText = "SENDING NODE...";
            
            emailjs.sendForm('service_8uqw275', 'template_uk0c9ey', this)
                .then(() => {
                    btn.innerText = "SUCCESS!";
                    setTimeout(() => {
                        hideModal();
                        btn.innerText = originalText;
                        this.reset();
                    }, 2000);
                }, (error) => {
                    btn.innerText = "ERROR!";
                    console.log('EmailJS Error:', error);
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