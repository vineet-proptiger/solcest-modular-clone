document.addEventListener('DOMContentLoaded', () => {

    

    const components = [
        'header', 'hero', 'overview', 'highlights', 'pricing', 'floor-plan',
        'amenities', 'gallery', 'location', 'about-us', 'faq', 'footer', 'sidebar',
        'modal', 'mobile-cta'
    ];

    const loadPromises = components.map(comp => {
        const placeholder = document.querySelector(`[data-replace="${comp}"]`);
        if (!placeholder) return Promise.resolve();

        return fetch(`components/${comp}.html`)
            .then(res => res.text())
            .then(html => {
                placeholder.outerHTML = html;
            })
            .catch(err => console.error(err));
    });

    Promise.all(loadPromises).then(() => {
        console.log("All components loaded. Initializing scripts...");
        
        // 1. Slider Logic
        let slides = document.querySelectorAll('.hero-left img');
        if (slides.length > 0) {
            let i = 0;
            setInterval(() => {
                slides.forEach(s => s.classList.remove('active'));
                i = (i + 1) % slides.length;
                if(slides[i]) slides[i].classList.add('active');
            }, 4000);
        }

        // 2. Mobile Menu
        const hamburger = document.getElementById('hamburger');
        const menu = document.getElementById('menu');
        if (hamburger && menu) {
            hamburger.onclick = () => {
                menu.classList.toggle('show');
            };
            
            // Close mobile menu when clicking any menu link
            document.querySelectorAll('#menu a').forEach(link => {
                link.addEventListener('click', () => {
                    if (menu.classList.contains('show')) {
                        menu.classList.remove('show');
                    }
                });
            });
        }

        // 3. Form Validation (Bootstrap)
        const forms = document.querySelectorAll('.needs-validation');
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });

        // 4. Global Variables are now in config.js

        // Dispatch a custom event in case form-integration.js needs to know DOM is ready
        
        // 5. Load Bootstrap JS dynamically AFTER DOM is injected
        const bsScript = document.createElement('script');
        bsScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
        bsScript.onload = () => {
            console.log('Bootstrap JS loaded successfully.');
            // Initialize any tabs manually if needed, but event delegation usually handles it.
            // If it still fails, we can trigger tab instantiation here.
            
            // Actually, event delegation handles tabs and modals as long as the script runs.
        };
        document.body.appendChild(bsScript);

        
        // 6. Fix Location Tabs (Because injected <script> tags are ignored by browsers)
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.location-tabs .nav-link');
            if (btn) {
                document.querySelectorAll('.location-tabs .nav-link').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(tab => tab.classList.remove('active'));
                btn.classList.add('active');
                const targetId = btn.getAttribute('data-tab');
                const targetPane = document.getElementById(targetId);
                if (targetPane) targetPane.classList.add('active');
            }
        });

        // 7. Fix Modals (Bootstrap 5 dynamically loaded might miss event delegation if loaded weirdly, so we bind click explicitly)
        document.addEventListener('click', (e) => {
            const toggle = e.target.closest('[data-bs-toggle="modal"]');
            if (toggle) {
                e.preventDefault();
                const targetSelector = toggle.getAttribute('data-bs-target');
                const modalEl = document.querySelector(targetSelector);
                if (modalEl && window.bootstrap) {
                    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                    modal.show();
                } else if (modalEl) {
                    // Fallback if bootstrap JS object is not attached yet
                    modalEl.classList.add('show');
                    modalEl.style.display = 'block';
                    document.body.classList.add('modal-open');
                }
            }
            
            const dismiss = e.target.closest('[data-bs-dismiss="modal"]');
            if (dismiss) {
                const modalEl = dismiss.closest('.modal');
                if (modalEl && window.bootstrap) {
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    if(modal) modal.hide();
                } else if (modalEl) {
                    modalEl.classList.remove('show');
                    modalEl.style.display = 'none';
                    document.body.classList.remove('modal-open');
                }
            }
        });

        
        // 8. Fix FAQ Accordion
        document.addEventListener('click', (e) => {
            const faqBtn = e.target.closest('.faq-question');
            if (faqBtn) {
                const item = faqBtn.parentElement;
                document.querySelectorAll('.faq-item').forEach(faq => {
                    if (faq !== item) faq.classList.remove('active');
                });
                item.classList.toggle('active');
            }
        });

        
        // Initialize AOS (Animate On Scroll) AFTER all components are loaded
        
        // Dynamically add data-aos to key elements for Animate On Scroll
        const animateTags = ['h2', '.faq-item', 'tr', '.plan-card', '.amenity-card', '.highlight-list li', '.about-section p', '.developer-card', '.gallery-item'];
        animateTags.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, index) => {
                if(!el.hasAttribute('data-aos')) {
                    el.setAttribute('data-aos', 'fade-up');
                    el.setAttribute('data-aos-delay', (index % 4) * 100); // Staggered delay
                }
            });
        });

        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: false,
                mirror: true,
                offset: 50,
                easing: 'ease-out-cubic'
            });
            // Refresh AOS just in case images/fonts load later
            setTimeout(() => AOS.refresh(), 500);
            setTimeout(() => AOS.refresh(), 2000);
        }

        
        // ---------------------------------------------------------
        // DYNAMICALLY INJECT CONFIG VARIABLES INTO UI
        // ---------------------------------------------------------
        document.querySelectorAll('a[href^="tel:"]').forEach(el => {
            el.href = 'tel:+' + window.WHATSAPP_NO;
            el.innerHTML = el.innerHTML.replace(/\+?91\s*9513550974|\+?91\s*919596286287/g, '+91 ' + window.WHATSAPP_NO);
        });

        document.querySelectorAll('a[href^="https://wa.me"]').forEach(el => {
            el.href = window.WHATSAPP_URL;
        });

        
        
        // Dynamic form_name
        document.querySelectorAll('[name="form_name"]').forEach(el => {
            if (!el.value) el.value = window.PROJECT_NAME || 'Lead Form';
        });

        // Dynamic RERA
        const reraEl = document.getElementById('dynamic-rera');
        if (reraEl && typeof window.RERA_NO !== 'undefined') {
            reraEl.innerText = window.RERA_NO;
        }

        document.dispatchEvent(new Event('componentsLoaded'));
    });
});

window.scrollAmenities = function(dir) { const scrollBox = document.getElementById('amenitiesScroll'); if(scrollBox) scrollBox.scrollLeft += dir * 280; };

window.scrollGallery = function(dir) { const scrollBox = document.getElementById('galleryTrack'); if(scrollBox) scrollBox.scrollLeft += dir * 300; };
