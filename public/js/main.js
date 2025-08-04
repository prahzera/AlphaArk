/**
 * ALPHA ARK - JavaScript principal
 * Funcionalidades interactivas para el sitio web
 */

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar animaciones
  initAnimations();
  
  // Funcionalidad para copiar IPs al portapapeles
  initCopyButtons();
  
  // Efecto parallax para el fondo
  initParallaxEffect();
  
  // Resaltar navegación activa
  highlightActiveNavigation();
  
  // Inicializar acordeones si existen
  initAccordions();
  
  // Inicializar tabs si existen
  initTabs();
  
  // Inicializar filtros si existen
  initFilters();
  
  // Inicializar ordenamiento de tablas si existen
  initTableSorting();
});

/**
 * Inicializa las animaciones de entrada
 */
function initAnimations() {
  // Animaciones de entrada con retardo secuencial
  const animateElements = document.querySelectorAll('.animate-fade-in, .animate-slide-left, .animate-slide-right, .animate-slide-up');
  
  animateElements.forEach((element, index) => {
    // Si el elemento tiene una clase de retardo personalizada, la respetamos
    if (!element.classList.contains('delay-100') && 
        !element.classList.contains('delay-200') && 
        !element.classList.contains('delay-300') && 
        !element.classList.contains('delay-400') && 
        !element.classList.contains('delay-500')) {
      // Aplicar retardo secuencial automático
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 100 * index);
    }
  });
  
  // Contador animado para estadísticas si existen
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    animateCounters(statNumbers);
  }
}

/**
 * Anima contadores numéricos
 */
function animateCounters(elements) {
  elements.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    if (!target) return;
    
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
    
    // Iniciar animación cuando el elemento está en el viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(counter);
  });
}

/**
 * Inicializa los botones de copiar al portapapeles
 */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const ipElement = this.previousElementSibling;
      const ipText = ipElement.textContent;
      
      navigator.clipboard.writeText(ipText).then(() => {
        // Cambiar texto del botón temporalmente
        const originalText = this.textContent;
        this.textContent = '¡Copiado!';
        this.classList.add('copy-success');
        
        setTimeout(() => {
          this.textContent = originalText;
          this.classList.remove('copy-success');
        }, 2000);
      }).catch(err => {
        console.error('Error al copiar: ', err);
      });
    });
  });
}

/**
 * Inicializa el efecto parallax para el fondo
 */
function initParallaxEffect() {
  window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    document.body.style.backgroundPositionY = -scrollPosition * 0.15 + 'px';
  });
}

/**
 * Resalta la navegación activa
 */
function highlightActiveNavigation() {
  const currentLocation = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-tabs a');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentLocation === linkPath || 
        (linkPath === '/' && currentLocation === '/') || 
        (linkPath !== '/' && currentLocation.startsWith(linkPath))) {
      link.classList.add('active');
    }
  });
}

/**
 * Inicializa los acordeones
 */
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  });
}

/**
 * Inicializa los tabs
 */
function initTabs() {
  const tabButtons = document.querySelectorAll('.leaderboard-tab');
  
  if (tabButtons.length === 0) return;
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remover clase activa de todos los botones
      tabButtons.forEach(btn => btn.classList.remove('active'));
      
      // Añadir clase activa al botón clickeado
      this.classList.add('active');
      
      // Mostrar la sección correspondiente
      const targetId = this.getAttribute('data-target');
      const sections = document.querySelectorAll('.leaderboard-section');
      
      sections.forEach(section => {
        section.classList.remove('active');
      });
      
      document.getElementById(targetId).classList.add('active');
    });
  });
}

/**
 * Inicializa los filtros
 */
function initFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  if (filterButtons.length === 0) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Actualizar botones activos
      if (filter === 'all') {
        filterButtons.forEach(btn => {
          if (btn.getAttribute('data-filter') === 'all') {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      } else {
        const allButton = document.querySelector('.filter-btn[data-filter="all"]');
        if (allButton) allButton.classList.remove('active');
        
        this.classList.toggle('active');
      }
      
      // Aplicar filtros
      applyFilters();
    });
  });
}

/**
 * Aplica los filtros seleccionados
 */
function applyFilters() {
  const activeFilters = Array.from(document.querySelectorAll('.filter-btn.active'))
    .map(button => button.getAttribute('data-filter'));
  
  // Si "todos" está seleccionado o no hay filtros activos, mostrar todo
  const showAll = activeFilters.includes('all') || activeFilters.length === 0;
  
  // Elementos a filtrar (pueden ser servidores o productos de tienda)
  const items = document.querySelectorAll('.server-card, .store-item');
  
  items.forEach(item => {
    const itemCategory = item.getAttribute('data-category');
    const shouldShow = showAll || activeFilters.includes(itemCategory);
    
    if (shouldShow) {
      item.style.display = '';
      // Añadir animación de aparición
      item.classList.add('animate-fade-in');
      setTimeout(() => {
        item.classList.remove('animate-fade-in');
      }, 500);
    } else {
      item.style.display = 'none';
    }
  });
}

/**
 * Inicializa el ordenamiento de tablas
 */
function initTableSorting() {
  const tables = document.querySelectorAll('.leaderboard-table');
  
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    
    headers.forEach((header, index) => {
      header.addEventListener('click', function() {
        sortTable(table, index, this);
      });
    });
  });
}

/**
 * Ordena una tabla por columna
 */
function sortTable(table, columnIndex, header) {
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  const isAsc = !header.classList.contains('sort-asc');
  
  // Limpiar clases de ordenamiento
  table.querySelectorAll('th').forEach(th => {
    th.classList.remove('sort-asc', 'sort-desc');
  });
  
  // Establecer clase de ordenamiento actual
  if (isAsc) {
    header.classList.add('sort-asc');
  } else {
    header.classList.add('sort-desc');
  }
  
  // Ordenar filas
  rows.sort((a, b) => {
    const cellA = a.cells[columnIndex].textContent.trim();
    const cellB = b.cells[columnIndex].textContent.trim();
    
    // Intentar ordenar como números si es posible
    const numA = parseFloat(cellA);
    const numB = parseFloat(cellB);
    
    if (!isNaN(numA) && !isNaN(numB)) {
      return isAsc ? numA - numB : numB - numA;
    }
    
    // Ordenar como texto
    return isAsc 
      ? cellA.localeCompare(cellB, 'es')
      : cellB.localeCompare(cellA, 'es');
  });
  
  // Reconstruir la tabla
  const tbody = table.querySelector('tbody');
  rows.forEach(row => tbody.appendChild(row));
  
  // Añadir animación a las filas
  rows.forEach((row, index) => {
    row.style.opacity = '0';
    setTimeout(() => {
      row.style.opacity = '1';
    }, 50 * index);
  });
}