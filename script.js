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

// ==========================================
// SUPABASE CONFIGURATION
// ==========================================

const SUPABASE_URL =
    "https://wvllisghhvhjcnqzshrb.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_ecElDx9cB-VpaPPBMq4_PA_8lVfWHm-";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// ==========================================
// DOM
// ==========================================

const loginCard =
    document.getElementById("login-card");

const messageCard =
    document.getElementById("message-card");

const loginEmail =
    document.getElementById("login-email");

const loginPassword =
    document.getElementById("login-password");

const loginBtn =
    document.getElementById("login-btn");

const logoutBtn =
    document.getElementById("logout-btn");

const messageText =
    document.getElementById("message-text");

const saveMessageBtn =
    document.getElementById("save-message-btn");

const deleteMessageBtn =
    document.getElementById("delete-message-btn");

const loginStatus =
    document.getElementById("login-status");

const messageStatus =
    document.getElementById("message-status");

const loggedUser =
    document.getElementById("logged-user");


// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        const {
            data: {
                session
            }
        } =
            await supabaseClient.auth.getSession();

        updateUI(session);

    }
);


// ==========================================
// AUTH STATE CHANGE
// ==========================================

supabaseClient.auth.onAuthStateChange(
    function (_event, session) {

        updateUI(session);

    }
);


// ==========================================
// UPDATE UI
// ==========================================

function updateUI(session) {

    if (session) {

        loginCard.style.display = "none";

        messageCard.style.display = "block";

        loggedUser.textContent =
            session.user.email;

        loadMessage();

    } else {

        loginCard.style.display = "block";

        messageCard.style.display = "none";

        messageText.value = "";

    }

}


// ==========================================
// LOGIN
// ==========================================

loginBtn.addEventListener(
    "click",
    async function () {

        const email =
            loginEmail.value.trim();

        const password =
            loginPassword.value;

        if (!email || !password) {

            showLoginStatus(
                "Email dan password wajib diisi."
            );

            return;
        }

        loginBtn.disabled = true;

        showLoginStatus(
            "Sedang login..."
        );

        const {
            error
        } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

        loginBtn.disabled = false;

        if (error) {

            showLoginStatus(
                "Login gagal: " +
                error.message
            );

            return;
        }

        showLoginStatus(
            "Login berhasil."
        );

    }
);


// ==========================================
// LOGOUT
// ==========================================

logoutBtn.addEventListener(
    "click",
    async function () {

        const {
            error
        } =
            await supabaseClient.auth.signOut();

        if (error) {

            showMessageStatus(
                "Logout gagal: " +
                error.message
            );

            return;
        }

        messageText.value = "";

    }
);


// ==========================================
// LOAD MESSAGE
// ==========================================

async function loadMessage() {

    showMessageStatus(
        "Loading message..."
    );

    const {
        data,
        error
    } =
        await supabaseClient
            .from("personal_messages")
            .select("*")
            .order("updated_at", {
                ascending: false
            })
            .limit(1);

    if (error) {

        showMessageStatus(
            "Gagal mengambil message: " +
            error.message
        );

        return;
    }

    if (data && data.length > 0) {

        messageText.value =
            data[0].message;

    } else {

        messageText.value = "";

    }

    showMessageStatus("");

}


// ==========================================
// SAVE MESSAGE
// ==========================================

saveMessageBtn.addEventListener(
    "click",
    async function () {

        const message =
            messageText.value.trim();

        if (!message) {

            showMessageStatus(
                "Message tidak boleh kosong."
            );

            return;
        }

        saveMessageBtn.disabled = true;

        showMessageStatus(
            "Menyimpan message..."
        );

        const {
            data: {
                user
            }
        } =
            await supabaseClient.auth.getUser();

        if (!user) {

            showMessageStatus(
                "Session tidak ditemukan."
            );

            saveMessageBtn.disabled = false;

            return;
        }


        // Cari message existing

        const {
            data: existing,
            error: findError
        } =
            await supabaseClient
                .from("personal_messages")
                .select("id")
                .eq("user_id", user.id)
                .limit(1);


        if (findError) {

            showMessageStatus(
                "Gagal mengecek message: " +
                findError.message
            );

            saveMessageBtn.disabled = false;

            return;
        }


        let error;


        // UPDATE

        if (existing && existing.length > 0) {

            const result =
                await supabaseClient
                    .from("personal_messages")
                    .update({
                        message: message,
                        updated_at:
                            new Date().toISOString()
                    })
                    .eq(
                        "id",
                        existing[0].id
                    );

            error = result.error;

        }

        // INSERT

        else {

            const result =
                await supabaseClient
                    .from("personal_messages")
                    .insert({
                        user_id: user.id,
                        message: message
                    });

            error = result.error;

        }


        saveMessageBtn.disabled = false;


        if (error) {

            showMessageStatus(
                "Gagal menyimpan: " +
                error.message
            );

            return;
        }


        showMessageStatus(
            "Message berhasil disimpan."
        );

    }
);


// ==========================================
// DELETE MESSAGE
// ==========================================

deleteMessageBtn.addEventListener(
    "click",
    async function () {

        const confirmed =
            confirm(
                "Yakin ingin menghapus message?"
            );

        if (!confirmed) {
            return;
        }

        deleteMessageBtn.disabled = true;

        showMessageStatus(
            "Menghapus message..."
        );


        const {
            data: {
                user
            }
        } =
            await supabaseClient.auth.getUser();

        if (!user) {

            showMessageStatus(
                "Session tidak ditemukan."
            );

            deleteMessageBtn.disabled = false;

            return;
        }


        const {
            error
        } =
            await supabaseClient
                .from("personal_messages")
                .delete()
                .eq(
                    "user_id",
                    user.id
                );


        deleteMessageBtn.disabled = false;


        if (error) {

            showMessageStatus(
                "Gagal menghapus: " +
                error.message
            );

            return;
        }


        messageText.value = "";

        showMessageStatus(
            "Message berhasil dihapus."
        );

    }
);


// ==========================================
// STATUS
// ==========================================

function showLoginStatus(message) {

    loginStatus.textContent =
        message;

}


function showMessageStatus(message) {

    messageStatus.textContent =
        message;

}

// =========================
// FILE UPLOAD NAME
// =========================

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
  async () => {

    if(
      passwordInput.value !==
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
      '⏳ Uploading...';

    progressBar.style.width =
      '15%';

    const reader =
      new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {

      try {

        progressBar.style.width =
          '70%';

        const base64 =
          reader.result.split(',')[1];

        await fetch(
          'https://script.google.com/macros/s/AKfycbwSXLsfwKzSaH8ZldheRJcnvds74KLsvyFE3iUqxn36bpO6T30wYYs2f_ZHoHsrjdT0LA/exec',
          {
            method:'POST',
            mode:'no-cors',
            body:JSON.stringify({
              file:base64,
              fileName:file.name,
              mimeType:file.type
            })
          }
        );

        progressBar.style.width =
          '100%';

        fileName.innerHTML =
          `✅ Upload berhasil<br>${file.name}`;

      } catch(err){

        progressBar.style.width =
          '0%';

        fileName.innerHTML =
          '❌ Upload gagal';

      }

    };

});
