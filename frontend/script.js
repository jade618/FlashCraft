 // Navegação ativa simples baseada em scroll (opcional para melhora UX)
    document.addEventListener('DOMContentLoaded', () => {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.nav-link');

      function activateNavLinkOnScroll() {
        let scrollPos = window.scrollY + window.innerHeight / 3;

        sections.forEach(section => {
          if (scrollPos > section.offsetTop) {
            const id = section.getAttribute('id');
            navLinks.forEach(link => {
              link.classList.remove('active');
              if (link.getAttribute('href') === '#' + id) {
                link.classList.add('active');
              }
            });
          }
        });
      }

      window.addEventListener('scroll', activateNavLinkOnScroll);
      activateNavLinkOnScroll();
    });