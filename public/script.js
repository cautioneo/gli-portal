document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 2. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // 3. Simple Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // 4. Mobile Menu Toggle (Robust class-based implementation)
    const navToggle = document.querySelector('.nav-toggle');
    
    if (navToggle && navbar) {
        navToggle.addEventListener('click', () => {
            navbar.classList.toggle('nav-open');
            const icon = navToggle.querySelector('i');
            if (icon) {
                if (navbar.classList.contains('nav-open')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

        // 5. Exit-Intent Popup Logic
    const exitModalHtml = `
            <div id="exitModalOverlay" class="exit-modal-overlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 999999; padding: 16px;">
                <div class="exit-modal-card" style="background: #ffffff; border-radius: 16px; padding: 28px 24px; max-width: 480px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); position: relative; text-align: center;">
                    <button id="closeExitModal" style="position: absolute; top: 12px; right: 12px; background: none; border: none; font-size: 20px; color: #64748B; cursor: pointer; padding: 4px 8px;">✕</button>
                    <div style="font-size: 2rem; margin-bottom: 8px;">👋</div>
                    <h3 style="font-size: 1.25rem; font-weight: 700; color: #0F172A; margin: 0 0 8px 0;">Déjà prêt à partir ?</h3>
                    <p style="font-size: 0.9rem; color: #475569; margin: 0 0 20px 0; line-height: 1.5;">Ne laissez pas un dossier incomplet ruiner vos chances de louer. Obtenez votre accord de garant Cautioneo en <strong>48h (7h avec l'Option Express)</strong> et rassurez immédiatement les bailleurs.</p>
                    <div style="display: flex; gap: 12px; justify-content: space-around; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px; margin-bottom: 20px;">
                        <div style="text-align: center;"><strong style="display: block; font-size: 1.1rem; color: #4F46E5;">48h</strong><span style="display: block; font-size: 0.75rem; color: #64748B; margin-top: 2px;">Réponse (7h Express)</span></div>
                        <div style="text-align: center;"><strong style="display: block; font-size: 1.1rem; color: #4F46E5;">98%</strong><span style="display: block; font-size: 0.75rem; color: #64748B; margin-top: 2px;">Bailleurs rassurés</span></div>
                        <div style="text-align: center;"><strong style="display: block; font-size: 1.1rem; color: #4F46E5;">4.6/5</strong><span style="display: block; font-size: 0.75rem; color: #64748B; margin-top: 2px;">Avis Vérifiés</span></div>
                    </div>
                    <a href="https://www.cautioneo.com/r/?referral_id=1b7fa16f-a353-4ff5-b28a-7b6886318826&kind=lessor&returnUrl=https%3A%2F%2Fpro.cautioneo.com%2Fpbi%2Fstart%2F" target="_blank" rel="noopener" style="display: block; width: 100%; background: #4F46E5; color: #ffffff; font-weight: 600; padding: 12px 20px; border-radius: 10px; text-decoration: none; font-size: 0.95rem; text-align: center; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3);">Tester mon éligibilité gratuitement</a>
                    <button id="dismissExitModal" style="background: none; border: none; color: #94A3B8; font-size: 0.8rem; margin-top: 12px; cursor: pointer; text-decoration: underline;">Continuer ma lecture</button>
                </div>
            </div>
            `;

    // Inject exit intent modal into body if it doesn't exist
    if (!document.getElementById('exit-modal')) {
        const div = document.createElement('div');
        div.innerHTML = exitModalHtml;
        document.body.appendChild(div.firstElementChild);
    }

    const exitModal = document.getElementById('exit-modal');
    if (exitModal) {
        const closeBtn = exitModal.querySelector('.exit-modal-close');
        const cancelBtn = exitModal.querySelector('.exit-modal-cancel');
        const actionBtn = exitModal.querySelector('.btn-primary');

        const storageKey = 'exit_popup_dismissed_30d';
        const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

        const trackCro = (eventName) => {
            let stats = { impressions: 0, dismissals: 0, conversions: 0 };
            try {
                const stored = localStorage.getItem('cro_stats');
                if (stored) stats = JSON.parse(stored);
            } catch (e) {}
            if (eventName === 'exit_intent_popup_impression' || eventName === 'impression') stats.impressions++;
            if (eventName === 'exit_intent_popup_dismiss' || eventName === 'dismiss') stats.dismissals++;
            if (eventName === 'exit_intent_popup_conversion' || eventName === 'conversion') stats.conversions++;
            localStorage.setItem('cro_stats', JSON.stringify(stats));
            console.log(`[CRO Tracking] Event: ${eventName}`, stats);

            // GTM tracking
            if (typeof window !== 'undefined') {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: eventName,
                    popup_stats: stats
                });
            }
        };

        window.getCroStats = () => {
            try {
                return JSON.parse(localStorage.getItem('cro_stats')) || { impressions: 0, dismissals: 0, conversions: 0 };
            } catch (e) {
                return { impressions: 0, dismissals: 0, conversions: 0 };
            }
        };

        const hasBeenShownRecently = () => {
            const dismissedTime = localStorage.getItem(storageKey);
            if (!dismissedTime) return false;
            return (Date.now() - parseInt(dismissedTime, 10)) < thirtyDaysMs;
        };

        const showModal = () => {
            if (hasBeenShownRecently()) return;
            exitModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            trackCro('exit_intent_popup_impression');
        };

        const hideModal = () => {
            exitModal.classList.remove('active');
            document.body.style.overflow = '';
            localStorage.setItem(storageKey, Date.now().toString());
        };

        closeBtn.addEventListener('click', () => {
            trackCro('exit_intent_popup_dismiss');
            hideModal();
        });
        cancelBtn.addEventListener('click', () => {
            trackCro('exit_intent_popup_dismiss');
            hideModal();
        });
        actionBtn.addEventListener('click', () => {
            trackCro('exit_intent_popup_conversion');
            hideModal();
        });

        // Close on clicking backdrop
        exitModal.addEventListener('click', (e) => {
            if (e.target === exitModal) {
                trackCro('exit_intent_popup_dismiss');
                hideModal();
            }
        });

        // Trigger desktop: mouse leaving viewport from top
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY < 20) {
                showModal();
            }
        });

        // Trigger mobile: 15s timer AND (scroll depth 75% or scroll up quickly)
        let mobileTriggered = false;
        let mobileTimerElapsed = false;

        setTimeout(() => {
            mobileTimerElapsed = true;
            checkMobileTrigger();
        }, 15000);

        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
            const isScrollUp = window.scrollY < lastScrollY - 20;
            lastScrollY = window.scrollY;

            if (scrollPercent >= 0.75 || (isScrollUp && window.scrollY > 300)) {
                checkMobileTrigger();
            }
        });

        const checkMobileTrigger = () => {
            if (mobileTriggered || !mobileTimerElapsed) return;
            const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 768);
            if (isMobile) {
                mobileTriggered = true;
                showModal();
            }
        };
    }


// 6. Interactive Rent Simulator (4-solution comparison on Homepage)
    const rentSlider = document.getElementById('simulator-rent-slider');
    const profileEtudiant = document.getElementById('profile-etudiant');
    const profileGeneral = document.getElementById('profile-general');
    const rentDisplay = document.getElementById('simulator-rent-display');
    
    const priceCautioneo = document.getElementById('price-cautioneo');
    const priceSmartgarant = document.getElementById('price-smartgarant');
    const priceGarantme = document.getElementById('price-garantme');

    if (rentSlider && profileEtudiant && profileGeneral && rentDisplay) {
        let currentProfile = 'etudiant'; // default

        const updateValues = () => {
            const rent = parseInt(rentSlider.value, 10);
            rentDisplay.textContent = rent + ' €';

            // 1. Cautioneo: 3.75% (student) or 4.1% (general)
            const rateCautioneo = currentProfile === 'etudiant' ? 0.0375 : 0.041;
            const priceC = Math.round(rent * rateCautioneo);
            priceCautioneo.textContent = priceC + ' €';

            // 2. SmartGarant: 3% (student) or 3.3% (general)
            const rateSmartgarant = currentProfile === 'etudiant' ? 0.03 : 0.033;
            const priceS = Math.round(rent * rateSmartgarant);
            priceSmartgarant.textContent = priceS + ' €';

            // 3. GarantMe: range of 3.5% to 4.5% of rent
            let priceGMin = Math.round(rent * 0.035);
            let priceGMax = Math.round(rent * 0.045);
            // Minimum GarantMe fee is 25€
            if (priceGMin < 25) priceGMin = 25;
            if (priceGMax < 25) priceGMax = 25;
            
            if (priceGMin === priceGMax) {
                priceGarantme.textContent = priceGMin + ' €';
            } else {
                priceGarantme.textContent = priceGMin + ' - ' + priceGMax + ' €';
            }
        };

        rentSlider.addEventListener('input', updateValues);

        // Listen for change events on sliders to push dataLayer events
        const handleSliderChange = () => {
            if (typeof window !== 'undefined') {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: 'homepage_comparison_slider_change',
                    rent_value: parseInt(rentSlider.value, 10),
                    profile: currentProfile
                });
            }
        };
        rentSlider.addEventListener('change', handleSliderChange);

        profileEtudiant.addEventListener('click', () => {
            profileEtudiant.classList.add('active');
            profileGeneral.classList.remove('active');
            currentProfile = 'etudiant';
            updateValues();

            // GTM tracking
            if (typeof window !== 'undefined') {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: 'homepage_comparison_profile_change',
                    profile: 'etudiant'
                });
            }
        });

        profileGeneral.addEventListener('click', () => {
            profileGeneral.classList.add('active');
            profileEtudiant.classList.remove('active');
            currentProfile = 'general';
            updateValues();

            // GTM tracking
            if (typeof window !== 'undefined') {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: 'homepage_comparison_profile_change',
                    profile: 'general'
                });
            }
        });

        // Initialize values
        updateValues();
    }
});

