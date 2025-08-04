/**
 * ALPHA ARK - JavaScript Principal Mejorado
 * Funcionalidades interactivas y animaciones avanzadas
 */

document.addEventListener('DOMContentLoaded', () => {
    // ===== NAVEGACIÓN ACTIVA =====
    highlightActiveTab();
    
    // ===== ANIMACIONES DE CONTADORES =====
    initAnimatedCounters();
    
    // ===== EFECTOS DE INTERSECCIÓN =====
    initIntersectionObserver();
    
    // ===== FUNCIONALIDADES INTERACTIVAS =====
    initCopyButtons();
    initHoverEffects();
    initParallaxEffects();
    initSmoothScrolling();
    
    // ===== ANIMACIONES DE CARGA =====
    initPageAnimations();
    
    // ===== EFECTOS DE PARTÍCULAS =====
    initParticleEffects();
});

// ===== FUNCIONES PRINCIPALES =====

function highlightActiveTab() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-tabs a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 segundos
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // Observador para activar contadores cuando sean visibles
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function initIntersectionObserver() {
    const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-left, .animate-slide-right, .animate-slide-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.dataset.ip || this.textContent;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = this.innerHTML;
                const originalClass = this.className;
                
                // Efecto de éxito
                this.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
                this.classList.add('btn-success');
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.className = originalClass;
                }, 2000);
            }).catch(err => {
                console.error('Error al copiar:', err);
                // Fallback para navegadores antiguos
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            });
        });
    });
}

function initHoverEffects() {
    // Efectos de hover para tarjetas
    const cards = document.querySelectorAll('.card, .feature-card, .news-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Efectos de hover para botones
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function initParallaxEffects() {
    // Solo aplicar parallax en pantallas grandes
    if (window.innerWidth < 768) {
        return;
    }
    
    // Aplicar parallax a la imagen de fondo del body
    const body = document.body;
    let isParallaxActive = false;
    
    // Función para limpiar parallax
    const clearParallax = () => {
        body.style.backgroundPosition = 'center center';
        isParallaxActive = false;
    };
    
    // Limpiar al cargar la página
    clearParallax();
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const headerHeight = 120; // Altura del header fijo
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Solo aplicar parallax si hemos scrolleado más allá del header
        if (scrolled > headerHeight) {
            // Calcular la velocidad basada en el espacio disponible
            const maxScroll = documentHeight - windowHeight;
            const scrollProgress = Math.min(scrolled / maxScroll, 1);
            
            // Velocidad muy sutil (0.05 = 5% del scroll)
            const speed = 0.05;
            const maxOffset = windowHeight * speed; // Máximo desplazamiento
            const yPos = scrollProgress * maxOffset;
            
            // Aplicar el efecto parallax a la imagen de fondo (movimiento hacia arriba)
            body.style.backgroundPosition = `center ${-yPos}px`;
            isParallaxActive = true;
        } else {
            // Si estamos cerca del top, mantener posición normal
            if (isParallaxActive) {
                body.style.backgroundPosition = 'center center';
                isParallaxActive = false;
            }
        }
    }, 16)); // Throttle a 60fps
    
    // Limpiar al cambiar el tamaño de la ventana
    window.addEventListener('resize', clearParallax);
}

function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initPageAnimations() {
    // Animación de entrada de la página
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        document.body.style.transition = 'all 0.8s ease-out';
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    }, 100);
    
    // Animación del logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.opacity = '0';
        logo.style.transform = 'translateX(-50px)';
        
        setTimeout(() => {
            logo.style.transition = 'all 0.6s ease-out';
            logo.style.opacity = '1';
            logo.style.transform = 'translateX(0)';
        }, 300);
    }
    
    // Animación de la navegación
    const navTabs = document.querySelector('.nav-tabs');
    if (navTabs) {
        navTabs.style.opacity = '0';
        navTabs.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            navTabs.style.transition = 'all 0.6s ease-out';
            navTabs.style.opacity = '1';
            navTabs.style.transform = 'translateX(0)';
        }, 500);
    }
}

function initParticleEffects() {
    // Crear partículas de fondo para el hero
    const hero = document.querySelector('.hero');
    if (hero) {
        createParticles(hero, 20);
    }
    
    // Crear partículas para secciones especiales
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        createParticles(ctaSection, 15);
    }
}

function createParticles(container, count) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 0, 0, 0.6);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        container.appendChild(particle);
    }
}

// ===== FUNCIONES UTILITARIAS =====

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== EVENTOS DE WINDOW =====

window.addEventListener('resize', debounce(() => {
    // Reajustar elementos en resize
    const cards = document.querySelectorAll('.feature-card, .news-card');
    cards.forEach(card => {
        card.style.transform = 'translateY(0) scale(1)';
    });
}, 250));

window.addEventListener('scroll', throttle(() => {
    // Efectos de scroll
    const scrolled = window.pageYOffset;
    const header = document.querySelector('header');
    
    if (header) {
        if (scrolled > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}, 16));

// ===== ANIMACIONES CSS ADICIONALES =====

// Añadir estilos dinámicos para partículas y parallax
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.6;
        }
        50% { 
            transform: translateY(-20px) rotate(180deg); 
            opacity: 1;
        }
    }
    
    .particle {
        z-index: 1;
    }
    
    header.scrolled {
        background: rgba(0, 0, 0, 0.98) !important;
        backdrop-filter: blur(25px) !important;
    }
    
    .is-visible {
        opacity: 1 !important;
        transform: translateX(0) translateY(0) !important;
    }
    
    .btn-success {
        background: var(--success-color) !important;
        color: white !important;
    }
`;
document.head.appendChild(style);

// ===== FUNCIONES DE UTILIDAD PARA EL DESARROLLO =====

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Función para cargar contenido dinámicamente
function loadContent(url, targetElement) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            targetElement.innerHTML = html;
            // Reinicializar eventos después de cargar contenido
            initCopyButtons();
            initHoverEffects();
        })
        .catch(error => {
            console.error('Error cargando contenido:', error);
            showNotification('Error cargando contenido', 'error');
        });
}

// Exportar funciones para uso global
window.ALPHAARK = {
    showNotification,
    loadContent,
    initAnimatedCounters,
    initIntersectionObserver
};