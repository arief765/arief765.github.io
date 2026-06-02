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

/* =========================
   FILE UPLOAD PHP
========================= */

const ACCESS_CODE = 'QA2026';

const uploadInput =
  document.getElementById('file-upload');

const fileName =
  document.getElementById('file-name');

const progressBar =
  document.getElementById('progress-bar');

const passwordInput =
  document.getElementById('upload-password');

uploadInput.addEventListener(
  'change',
  () => {

    if(
      passwordInput.value.trim() !==
      ACCESS_CODE
    ){

      fileName.innerHTML =
        '❌ Access Code salah';

      uploadInput.value = '';

      return;
    }

    const file =
      uploadInput.files[0];

    if(!file) return;

    fileName.innerHTML =
      '⏳ Uploading 0%';

    progressBar.style.width =
      '0%';

    const formData =
      new FormData();

    formData.append(
      'file',
      file
    );

    const xhr =
      new XMLHttpRequest();

    xhr.open(
      'POST',
      'https://panjitrans.net/uploads/upload.php',
      true
    );

    /* PROGRESS REAL */

    xhr.upload.addEventListener(
      'progress',
      (e) => {

        if(e.lengthComputable){

          const percent =
            Math.round(
              (e.loaded / e.total) * 100
            );

          progressBar.style.width =
            percent + '%';

          fileName.innerHTML =
            `⏳ Uploading ${percent}%`;

        }

      }
    );

    /* SUCCESS */

    xhr.onload = () => {

      if(xhr.status === 200){

        try{

          const result =
            JSON.parse(
              xhr.responseText
            );

          if(result.success){

            progressBar.style.width =
              '100%';

            fileName.innerHTML =
              `✅ Upload berhasil<br>
              ${file.name}`;

          }else{

            progressBar.style.width =
              '0%';

            fileName.innerHTML =
              `❌ ${result.message}`;

          }

        }catch(err){

          progressBar.style.width =
            '0%';

          fileName.innerHTML =
            '❌ Response tidak valid';

        }

      }else{

        progressBar.style.width =
          '0%';

        fileName.innerHTML =
          '❌ Upload gagal';

      }

    };

    /* ERROR */

    xhr.onerror = () => {

      progressBar.style.width =
        '0%';

      fileName.innerHTML =
        '❌ Koneksi gagal';

    };

    xhr.send(formData);

  }
);
