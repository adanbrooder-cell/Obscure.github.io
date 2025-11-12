document.addEventListener('DOMContentLoaded', function() {
    const obscureTitle = document.getElementById('obscure-title');
    
    if (obscureTitle) {
        const letters = obscureTitle.querySelectorAll('.letter');
        
        obscureTitle.addEventListener('mousemove', function(e) {
            const rect = obscureTitle.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            
            letters.forEach((letter, index) => {
                const letterRect = letter.getBoundingClientRect();
                const letterCenter = letterRect.left - rect.left + letterRect.width / 2;
                const distance = Math.abs(mouseX - letterCenter);
                const maxDistance = 150;
                
                if (distance < maxDistance) {
                    const opacity = 1 - (distance / maxDistance) * 0.7;
                    const glowIntensity = (1 - distance / maxDistance) * 15;
                    letter.style.opacity = opacity;
                    letter.style.textShadow = `0 0 ${glowIntensity}px rgba(176, 157, 255, ${opacity}), 
                                               0 0 ${glowIntensity * 1.5}px rgba(107, 63, 160, ${opacity * 0.7})`;
                } else {
                    letter.style.opacity = 1;
                    letter.style.textShadow = '0 0 20px var(--glow-color), 0 0 40px var(--accent-purple), 0 0 60px rgba(107, 63, 160, 0.5)';
                }
            });
        });
        
        obscureTitle.addEventListener('mouseleave', function() {
            letters.forEach(letter => {
                letter.style.opacity = 1;
                letter.style.textShadow = '0 0 20px var(--glow-color), 0 0 40px var(--accent-purple), 0 0 60px rgba(107, 63, 160, 0.5)';
            });
        });
    }



    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputs = this.querySelectorAll('input, textarea');
            let allFilled = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    allFilled = false;
                }
            });
            
            if (allFilled) {
                alert('¡Gracias por tu mensaje! Me pondré en contacto pronto.');
                this.reset();
            } else {
                alert('Por favor, rellena todos los campos.');
            }
        });
    }

    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 0 40px rgba(107, 63, 160, 0.2)';
        } else {
            navbar.style.boxShadow = '0 0 30px rgba(107, 63, 160, 0.1)';
        }
    });

    const gallery = document.querySelector('.gallery-carousel');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (gallery && prevBtn && nextBtn) {
        let currentIndex = 0;
        const galleryItems = document.querySelectorAll('.gallery-carousel .gallery-item');
        let autoScrollInterval;
        
        function showItem(index) {
            galleryItems.forEach((item, i) => {
                if (i === index) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
        
        function autoScroll() {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            showItem(currentIndex);
        }
        
        showItem(0);
        autoScrollInterval = setInterval(autoScroll, 5000);
        
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            clearInterval(autoScrollInterval);
            
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            showItem(currentIndex);
            
            autoScrollInterval = setInterval(autoScroll, 5000);
        });
        
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            clearInterval(autoScrollInterval);
            
            currentIndex = (currentIndex + 1) % galleryItems.length;
            showItem(currentIndex);
            
            autoScrollInterval = setInterval(autoScroll, 5000);
        });

        const dropdownItems = document.querySelectorAll('.dropdown-item');
        const navDropdownContent = document.querySelector('.nav-dropdown-content');
        
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const category = this.dataset.category;
                console.log('Dropdown clicked, category:', category);
                
                if (category === 'all') {
                    currentIndex = 0;
                } else {
                    let found = false;
                    for (let i = 0; i < galleryItems.length; i++) {
                        if (galleryItems[i].dataset.category === category) {
                            currentIndex = i;
                            found = true;
                            console.log('Found item at index:', i);
                            break;
                        }
                    }
                    if (!found) {
                        console.log('Category not found:', category);
                    }
                }
                
                showItem(currentIndex);
                clearInterval(autoScrollInterval);
                autoScrollInterval = setInterval(autoScroll, 5000);
                
                if (navDropdownContent) {
                    navDropdownContent.style.display = 'none';
                }
            });
        });
    }

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    if (lightbox && lightboxImg && lightboxClose) {
        galleryItems.forEach(img => {
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                lightboxImg.src = this.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        lightboxClose.addEventListener('click', function() {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    const navItem = document.querySelector('.nav-item:has(.nav-dropdown)');
    const navDropdownContent = document.querySelector('.nav-dropdown-content');
    let dropdownTimeout;

    if (navItem && navDropdownContent) {
        navItem.addEventListener('mouseenter', function() {
            clearTimeout(dropdownTimeout);
            navDropdownContent.style.display = 'block';
        });

        navItem.addEventListener('mouseleave', function() {
            dropdownTimeout = setTimeout(function() {
                navDropdownContent.style.display = 'none';
            }, 1000);
        });
    }

    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        revealObserver.observe(section);
    });
});
