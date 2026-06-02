// =========================
// HAMBURGER MENU
// =========================

const toggle =
  document.getElementById('menu-toggle');

const navLinks =
  document.getElementById('nav-links');

toggle.addEventListener('click', () => {

  navLinks.classList.toggle('active');

});

// =========================
// CLOSE MENU AFTER CLICK
// =========================

const navItems =
  document.querySelectorAll('.nav-links a');

navItems.forEach(item => {

  item.addEventListener('click', () => {

    navLinks.classList.remove('active');

  });

});

// =========================
// NAVBAR SCROLL EFFECT
// =========================

const navbar =
  document.querySelector('.navbar');

window.addEventListener('scroll', () => {

  if(window.scrollY > 20){

    navbar.classList.add('scrolled');

  } else {

    navbar.classList.remove('scrolled');

  }

});

// =========================
// SCROLL REVEAL ANIMATION
// =========================

const revealElements =
  document.querySelectorAll(
    '.card, .hero-content, .section-title, .stat-card'
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

// =========================
// ACTIVE NAVBAR LINK
// =========================

const sections =
  document.querySelectorAll('section');

const navAnchor =
  document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {

  let current = '';

  sections.forEach(section => {

    const sectionTop =
      section.offsetTop - 150;

    const sectionHeight =
      section.clientHeight;

    if(pageYOffset >= sectionTop){

      current = section.getAttribute('id');

    }

  });

  navAnchor.forEach(a => {

    a.classList.remove('active-link');

    if(
      a.getAttribute('href') ===
      `#${current}`
    ){

      a.classList.add('active-link');

    }

  });

});

// =========================
// SMOOTH HERO IMAGE EFFECT
// =========================

const profileImg =
  document.querySelector('.profile-img');

window.addEventListener('mousemove', (e) => {

  const x =
    (window.innerWidth / 2 - e.pageX) / 40;

  const y =
    (window.innerHeight / 2 - e.pageY) / 40;

  profileImg.style.transform =
    `translate(${x}px, ${y}px)`;

});

// =========================
// PRELOADER FADE
// =========================

window.addEventListener('load', () => {

  document.body.classList.add('loaded');

});

// =========================
// FILE UPLOAD NAME
// =========================
const uploadInput =
  document.getElementById('file-upload');

const fileName =
  document.getElementById('file-name');

uploadInput.addEventListener(
  'change',
  async () => {

    const file =
      uploadInput.files[0];

    if(!file) return;

    fileName.textContent =
      'Uploading...';

    const reader =
      new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {

      try {

        const base64 =
          reader.result.split(',')[1];

        const response =
          await fetch(
            'https://script.google.com/macros/s/AKfycbwSXLsfwKzSaH8ZldheRJcnvds74KLsvyFE3iUqxn36bpO6T30wYYs2f_ZHoHsrjdT0LA/exec',
            {
              method:'POST',
              headers:{
                'Content-Type':'application/json'
              },
              body:JSON.stringify({
                file:base64,
                fileName:file.name,
                mimeType:file.type
              })
            }
          );

        const result =
          await response.json();

        if(result.success){

          fileName.innerHTML =
            `✅ Uploaded:
            <a href="${result.url}"
               target="_blank">
               View File
            </a>`;

        } else {

          fileName.textContent =
            '❌ Upload gagal: ' +
            result.error;

        }

      } catch(err){

        console.error(err);

        fileName.textContent =
          '❌ Error Upload';

      }

    };

});

