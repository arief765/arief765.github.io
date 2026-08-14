// ==========================================
// SUPABASE CONFIGURATION
// ==========================================

const SUPABASE_URL =
    "YOUR_SUPABASE_URL";

const SUPABASE_PUBLISHABLE_KEY =
    "YOUR_SUPABASE_PUBLISHABLE_KEY";


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
// AUTH STATE
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

        loginCard.style.display =
            "none";

        messageCard.style.display =
            "block";

        loggedUser.textContent =
            session.user.email;

        loadMessage();

    } else {

        loginCard.style.display =
            "block";

        messageCard.style.display =
            "none";

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
            await supabaseClient.auth
                .signInWithPassword({

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

        await supabaseClient.auth.signOut();

        messageText.value = "";

    }
);


// ==========================================
// LOAD MESSAGE
// ==========================================

async function loadMessage() {

    showMessageStatus(
        "Loading..."
    );


    const {
        data,
        error
    } =
        await supabaseClient
            .from("personal_messages")
            .select("*")
            .order(
                "updated_at",
                {
                    ascending: false
                }
            )
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
// REFRESH
// ==========================================

async function refreshMessage() {

    await loadMessage();

    showMessageStatus(
        "Message berhasil diperbarui."
    );

}


// ==========================================
// SAVE
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


        const {
            data: {
                user
            }
        } =
            await supabaseClient.auth
                .getUser();


        if (!user) {

            showMessageStatus(
                "Session tidak ditemukan."
            );

            saveMessageBtn.disabled = false;

            return;

        }


        const {
            data: existing,
            error: findError
        } =
            await supabaseClient
                .from("personal_messages")
                .select("id")
                .eq(
                    "user_id",
                    user.id
                )
                .limit(1);


        if (findError) {

            showMessageStatus(
                findError.message
            );

            saveMessageBtn.disabled = false;

            return;

        }


        let error;


        // UPDATE

        if (
            existing &&
            existing.length > 0
        ) {

            const result =
                await supabaseClient
                    .from("personal_messages")
                    .update({

                        message: message,

                        updated_at:
                            new Date()
                                .toISOString()

                    })
                    .eq(
                        "id",
                        existing[0].id
                    );

            error =
                result.error;

        }


        // INSERT

        else {

            const result =
                await supabaseClient
                    .from("personal_messages")
                    .insert({

                        user_id:
                            user.id,

                        message:
                            message

                    });

            error =
                result.error;

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
// DELETE
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


        const {
            data: {
                user
            }
        } =
            await supabaseClient.auth
                .getUser();


        if (!user) {

            showMessageStatus(
                "Session tidak ditemukan."
            );

            return;

        }


        deleteMessageBtn.disabled =
            true;


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


        deleteMessageBtn.disabled =
            false;


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
