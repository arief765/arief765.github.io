// HAMBURGER MENU

const toggle =
  document.getElementById('menu-toggle');

const navLinks =
  document.getElementById('nav-links');

toggle.addEventListener('click', () => {

  navLinks.classList.toggle('active');

});

// CLOSE MENU AFTER CLICK MOBILE

const navItems =
  document.querySelectorAll('.nav-links a');

navItems.forEach(item => {

  item.addEventListener('click', () => {

    navLinks.classList.remove('active');

  });

});

// NAVBAR SHADOW ON SCROLL

const navbar =
  document.querySelector('.navbar');

window.addEventListener('scroll', () => {

  if(window.scrollY > 20){

    navbar.style.background =
      'rgba(15,23,42,0.95)';

    navbar.style.boxShadow =
      '0 8px 30px rgba(0,0,0,0.35)';

  } else {

    navbar.style.background =
      'rgba(15,23,42,0.75)';

    navbar.style.boxShadow =
      '0 4px 30px rgba(0,0,0,0.2)';

  }

});

// SIMPLE SCROLL REVEAL

const revealElements =
  document.querySelectorAll(
    '.card, .hero-content, .section-title'
  );

function revealOnScroll(){

  const triggerBottom =
    window.innerHeight * 0.85;

  revealElements.forEach(el => {

    const boxTop =
      el.getBoundingClientRect().top;

    if(boxTop < triggerBottom){

      el.style.opacity = '1';

      el.style.transform =
        'translateY(0)';

    }

  });

}

// INITIAL STYLE

revealElements.forEach(el => {

  el.style.opacity = '0';

  el.style.transform =
    'translateY(40px)';

  el.style.transition =
    'all 0.8s ease';

});

// RUN

window.addEventListener(
  'scroll',
  revealOnScroll
);

revealOnScroll();
