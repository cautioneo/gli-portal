document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navbar) {
        navToggle.addEventListener('click', () => {
            navbar.classList.toggle('nav-open');
            if (navLinks) navLinks.classList.toggle('open');
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

    // --- Animations au Défilement (AOS-like) ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optionnel: arrêter d'observer une fois révélé
                // revealObserver.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Logic for the "Testeur de Solvabilité" Lead Magnet Tool
    const form = document.getElementById('scoring-form');
    if (form) {
        const resultBox = document.getElementById('result-box');
        const scoreDisplay = document.getElementById('score-display');
        const resultTitle = document.getElementById('result-title');
        const resultDesc = document.getElementById('result-desc');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Reset state
            resultBox.classList.remove('hidden');
            scoreDisplay.innerHTML = '<span class="text-xs">Calcul...</span>';
            scoreDisplay.className = 'score-circular';
            resultTitle.innerText = "Analyse algorithmique en cours...";
            resultDesc.innerText = "";

            const loyer = parseFloat(document.getElementById('loyer').value);
            const revenus = parseFloat(document.getElementById('revenus').value);
            const statut = document.getElementById('statut').value;

            setTimeout(() => {
                let score, riskLevel, message, colorClass;
                const ratio = revenus / loyer;

                if (ratio >= 3 && statut === 'cdi-confirme') {
                    score = "A"; riskLevel = "Faible"; colorClass = "score-green";
                    message = "Profil théoriquement solide. Cependant, 20% des faux dossiers se cachent derrière d'excellents CDI. Pouvez-vous vérifier l'authenticité de ses fiches de paie ?";
                } else if (ratio >= 2.5 && (statut === 'cdi-confirme' || statut === 'independant')) {
                    score = "B"; riskLevel = "Modéré"; colorClass = "score-orange";
                    message = "Profil acceptable mais limite. Le risque d'impayé est présent en cas de coup dur. Sans garant très solide, la prudence est de mise.";
                } else {
                    score = "C"; riskLevel = "Élevé"; colorClass = "score-red";
                    message = "Le taux d'effort est trop important ou le statut trop précaire. Un impayé sur ce profil pourrait vous coûter des milliers d'euros.";
                }

                scoreDisplay.innerText = score;
                scoreDisplay.classList.add(colorClass);
                resultTitle.innerText = `Niveau de risque estimé : ${riskLevel}`;
                resultDesc.innerText = message;
            }, 1200);
        });
    }

    // 3. Logic for "Calculateur de Rentabilité"
    // Gestion du Simulateur de Rentabilité
    const slPrix = document.getElementById('prix-achat');
    const slLoyer = document.getElementById('loyer-mensuel');
    const slCharges = document.getElementById('charges-annuelles');
    const dispPrix = document.getElementById('val-display-prix');
    const dispLoyer = document.getElementById('val-display-loyer');
    const dispCharges = document.getElementById('val-display-charges');
    const valBrut = document.getElementById('val-renta-brute');
    const valNet = document.getElementById('val-renta-nette');

    if (slPrix && slLoyer && slCharges && dispPrix && dispLoyer && dispCharges && valBrut && valNet) {
        const updateRenta = () => {
            const prix = parseFloat(slPrix.value);
            const loyer = parseFloat(slLoyer.value);
            const charges = parseFloat(slCharges.value);

            // Update display values with formatting
            dispPrix.textContent = prix.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' €';
            dispLoyer.textContent = loyer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' €';
            dispCharges.textContent = charges.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' €';

            if (prix > 0) {
                const rentaBrute = ((loyer * 12) / prix) * 100;
                const rentaNette = (((loyer * 12) - charges) / prix) * 100;

                valBrut.textContent = rentaBrute.toFixed(2) + '%';
                valNet.textContent = rentaNette.toFixed(2) + '%';
            }
        };

        // Listen for input events on all sliders
        slPrix.addEventListener('input', updateRenta);
        slLoyer.addEventListener('input', updateRenta);
        slCharges.addEventListener('input', updateRenta);

        // Run initially
        updateRenta();
    }

    // Gestion de l'Estimateur GLI
    if (document.getElementById('gli-form')) {
        document.getElementById('gli-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const loyer = parseFloat(document.getElementById('loyer-cc').value);
            const statut = document.getElementById('statut-locataire').value;
            
            let taux = 0.0275; // Taux de base Cautioneo
            if (statut === 'oui') taux = 0.025; // Tarif préférentiel

            const prime = loyer * taux;
            const resGli = document.getElementById('result-gli');

            if (resGli) {
                resGli.classList.remove('hidden');
                document.getElementById('val-prime').textContent = Math.round(prime);
                document.getElementById('desc-prime').textContent = `Basé sur un taux de ${(taux * 100).toFixed(2)}% du loyer charges comprises.`;
            }
        });
    }

    // Gestion du Simulateur de Risque Impayé
    if (document.getElementById('risk-form')) {
        document.getElementById('risk-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const loyer = parseFloat(document.getElementById('risk-loyer').value);
            const resRisk = document.getElementById('risk-result');

            if (loyer > 0 && resRisk) {
                const loyersPerdus = loyer * 18;
                const frais = 3500;
                const degradations = 2000;
                const fraisCaches = 1000; // 400 serrurier + 600 garde meuble
                const vacanceLocative = loyer * 2; // 2 mois pour travaux
                const total = loyersPerdus + frais + degradations + fraisCaches + vacanceLocative;
                const coutGli = loyer * 0.025; // Environ 2.5%

                document.getElementById('val-risk-total').textContent = Math.round(total).toLocaleString('fr-FR') + ' €';
                document.getElementById('val-risk-loyers').textContent = Math.round(loyersPerdus).toLocaleString('fr-FR') + ' €';
                document.getElementById('val-cost-gli').textContent = Math.round(coutGli) + ' €';
                
                if (document.getElementById('detail-loyer')) document.getElementById('detail-loyer').textContent = Math.round(loyer).toLocaleString('fr-FR') + ' €';
                if (document.getElementById('val-risk-vacance')) document.getElementById('val-risk-vacance').textContent = Math.round(vacanceLocative).toLocaleString('fr-FR') + ' €';
                if (document.getElementById('detail-total')) document.getElementById('detail-total').textContent = Math.round(total).toLocaleString('fr-FR') + ' €';
                
                resRisk.classList.remove('hidden');
            }
        });
    }

    // Gestion de la Modale de Capture
    const modalOverlay = document.getElementById('lead-modal');

    function openModal(e) {
        if (e) e.preventDefault();
        if (modalOverlay) {
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // 4. Gestion des Formulaires (Lead & Newsletter)
    // --- Simulation d'envoi vers un service tiers (Zapier/API) ---
    async function simulateFormSubmit(formData, btn) {
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = "Transmission...";

        try {
            // Simulation d'un appel réseau (2 secondes)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log("Données envoyées :", Object.fromEntries(formData));
            return true;
        } catch (error) {
            console.error("Erreur d'envoi :", error);
            return false;
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    }

    // Gestion de TOUS les formulaires Newsletter (Footer et autres)
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const btn = form.querySelector('button');
            
            const success = await simulateFormSubmit(formData, btn);
            if (success) {
                form.innerHTML = '<div class="text-success font-600">✓ Inscription validée ! Bienvenue.</div>';
            }
        });
    });

    // Gestion des formulaires de capture (Lead Modal)
    const leadForms = document.querySelectorAll('.lead-form, #lead-form');
    leadForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const btn = form.querySelector('button[type="submit"]');
            
            const success = await simulateFormSubmit(formData, btn);
            if (success) {
                alert("Demande reçue ! Un expert Cautioneo vous contactera sous 24h.");
                closeModal();
                form.reset();
            }
        });
    });

    window.openModal = openModal;
    window.closeModal = closeModal;


    // 5. Logique Interactive des Checklists
    const checklistItems = document.querySelectorAll('.checklist-item');
    checklistItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const checkDiv = item.querySelector('.checklist-check');

        item.addEventListener('click', () => {
            if (checkbox) {
                // Mode avec input checkbox
                checkbox.checked = !checkbox.checked;
                item.classList.toggle('checked', checkbox.checked);
            } else if (checkDiv) {
                // Mode avec div visuel (checklist-bailleur.html)
                item.classList.toggle('checked');
                checkDiv.innerHTML = item.classList.contains('checked') ? '✓' : '';
            }
        });
    });

    // 6. FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('active');
            // Fermer tous les autres
            document.querySelectorAll('.faq-item.active').forEach(openItem => {
                openItem.classList.remove('active');
            });
            // Ouvrir celui cliqué si pas déjà ouvert
            if (!isOpen) item.classList.add('active');
        });
    });

    // 7. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 7. Back to Top Button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Retour en haut');
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Générateur PDF Interactif (Mise en demeure) ---
    const demeureModal = document.getElementById('demeure-modal');

    function openDemeureModal(e) {
        if (e) e.preventDefault();
        if (demeureModal) {
            demeureModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeDemeureModal(e) {
        if (e) e.preventDefault();
        if (demeureModal) {
            demeureModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (demeureModal) {
        demeureModal.addEventListener('click', function(e) {
            if (e.target === demeureModal) closeDemeureModal();
        });
    }

    window.openDemeureModal = openDemeureModal;
    window.closeDemeureModal = closeDemeureModal;

    const demeureForm = document.getElementById('demeure-form');
    if (demeureForm) {
        demeureForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get values
            const ownerName = document.getElementById('pdf-owner-name') ? document.getElementById('pdf-owner-name').value : 'Votre nom et prénom';
            const ownerAddress = document.getElementById('pdf-owner-address') ? document.getElementById('pdf-owner-address').value : 'Adresse';
            const tenantName = document.getElementById('pdf-tenant-name').value;
            const address = document.getElementById('pdf-property-address').value;
            const debt = document.getElementById('pdf-debt-amount').value;
            const month = document.getElementById('pdf-debt-month').value;
            const paymentDay = document.getElementById('pdf-payment-day') ? document.getElementById('pdf-payment-day').value : '...';
            const dateStr = new Date().toLocaleDateString('fr-FR');
            
            // Generate PDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0); 
            doc.setFont("helvetica", "normal");
            
            // Top Left: Owner
            doc.text(ownerName, 20, 30);
            doc.text(ownerAddress, 20, 36);
            
            // Top Right: Tenant
            doc.text(tenantName, 130, 45);
            doc.text(address, 130, 51);
            
            // Lieu et date
            doc.setFont("helvetica", "italic");
            doc.text(`Fait à ........................, le ${dateStr}`, 130, 65);
            
            // LRAR
            doc.setFont("helvetica", "normal");
            doc.text("Lettre recommandée avec accusé de réception n°........................", 20, 85);
            
            // Objet
            doc.setFont("helvetica", "bold");
            doc.text("Objet : Mise en demeure de régler sous huitaine", 20, 100);
            
            // Corps du texte
            doc.setFont("helvetica", "normal");
            
            let pos = 120;
            doc.text(`Madame, Monsieur,`, 20, pos);
            pos += 10;
            
            const p1 = doc.splitTextToSize(`Comme prévu au contrat de bail, vous vous êtes engagé à me régler le loyer le ${paymentDay} de chaque mois.`, 170);
            doc.text(p1, 20, pos);
            pos += 6 * p1.length + 4;
            
            const p2 = doc.splitTextToSize(`Malgré plusieurs relances et mon dernier courrier en date du ...................., je reste à ce jour sans nouvelle de votre part.`, 170);
            doc.text(p2, 20, pos);
            pos += 6 * p2.length + 4;
            
            const p3 = doc.splitTextToSize(`Je vous informe que vous me devez toujours la somme de ${debt} euros correspondant aux loyers des mois de ${month}.`, 170);
            doc.text(p3, 20, pos);
            pos += 6 * p3.length + 4;
            
            const p4 = doc.splitTextToSize(`Par la présente, je vous mets en demeure de payer la somme de ${debt} euros avant le .................... (laisser au moins 8 jours à compter de l'envoi de la lettre).`, 170);
            doc.text(p4, 20, pos);
            pos += 6 * p4.length + 4;
            
            const p5 = doc.splitTextToSize(`Si la situation n'est pas rétablie à cette date, je serai dans l'obligation de remettre l'affaire devant la juridiction compétente pour faire valoir la clause résolutoire inscrite dans votre bail. Vous encourez une rupture de bail et donc l'expulsion.`, 170);
            doc.text(p5, 20, pos);
            pos += 6 * p5.length + 4;
            
            const p6 = doc.splitTextToSize(`Dans cette attente, je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération distinguée.`, 170);
            doc.text(p6, 20, pos);
            pos += 15;
            
            doc.setFont("helvetica", "italic");
            doc.text("Signature", 150, pos);
            
            // Save PDF
            doc.save(`Mise_En_Demeure_${tenantName.replace(/\s+/g, '_')}.pdf`);
            
            // UI Feedback
            const btn = demeureForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Téléchargé avec succès !';
            btn.classList.add('bg-success');
            
            setTimeout(() => {
                closeDemeureModal();
                btn.innerHTML = originalText;
                btn.classList.remove('bg-success');
                demeureForm.reset();
            }, 3000);
        });
    }


    // === Exit-Intent Popup Logic ===
    const exitModalHtml = `
    <div class="exit-modal-overlay" id="exit-modal">
        <div class="exit-modal">
            <button class="exit-modal-close" aria-label="Fermer">&times;</button>
            <div class="exit-modal-icon"><i class="fas fa-shield-alt"></i></div>
            <h2>Sécurisez vos loyers</h2>
            <p>Ne prenez pas le risque d'un impayé locatif. Obtenez votre accord de Garantie Loyers Impayés (GLI) Cautioneo 100% en ligne et sécurisez vos revenus fonciers.</p>
            <div class="exit-modal-stats">
                <div class="exit-stat"><strong>0 €</strong><span>Franchise</span></div>
                <div class="exit-stat"><strong>96 000 €</strong><span>Plafond</span></div>
                <div class="exit-stat"><strong>4.6/5</strong><span>Avis Vérifiés</span></div>
            </div>
            <a href="https://caut.io/Ffr6hkV" target="_blank" class="btn btn-accent btn-large" style="display: block; text-decoration: none; margin-bottom: 15px; text-align: center;" rel="noopener">Simuler ma prime en 2 min</a>
            <button class="exit-modal-cancel">Continuer ma lecture</button>
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
        const actionBtn = exitModal.querySelector('.btn-large');

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

});
