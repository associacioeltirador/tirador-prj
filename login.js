// URL DEL BACKEND DE GOOGLE APPS SCRIPT
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbzwQKkdc9IxveNSbDg1HEe4D2no-t78kJFQwf-VX_OvMhgpKaYzQL2A4yj2tjENgHJ6VA/exec";

function validarEmailInput() {
    const userInput = document.getElementById('username');
    const emailError = document.getElementById('emailError');
    const emailValue = userInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {
        emailError.classList.add('hidden');
        userInput.classList.remove('border-rose-500', 'focus:ring-rose-500', 'focus:border-rose-500');
        userInput.classList.add('border-slate-300', 'focus:ring-emerald-600', 'focus:border-emerald-600');
        return false;
    }

    if (!emailRegex.test(emailValue)) {
        emailError.classList.remove('hidden');
        userInput.classList.remove('border-slate-300', 'focus:ring-emerald-600', 'focus:border-emerald-600');
        userInput.classList.add('border-rose-500', 'focus:ring-rose-500', 'focus:border-rose-500');
        return false;
    } else {
        emailError.classList.add('hidden');
        userInput.classList.remove('border-rose-500', 'focus:ring-rose-500', 'focus:border-rose-500');
        userInput.classList.add('border-slate-300', 'focus:ring-emerald-600', 'focus:border-emerald-600');
        return true;
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    if (!validarEmailInput()) {
        document.getElementById('username').focus();
        return;
    }

    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMsg');
    const btn = document.getElementById('submitBtn');

    errorDiv.classList.add('hidden');
    btn.disabled = true;
    btn.textContent = "Verificant...";

    try {
        
        const payload = JSON.stringify({action: "login",usuari: "user",password: "pass"});

        const response = await fetch(BACKEND_URL, {
            method: "POST",
            mode: "cors",
            redirect: "follow",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: payload
        });

        if (!response.ok) {
            throw new Error("HTTP error! Status: " + response.status);
        }

        const data = await response.json();

        btn.disabled = false;
        btn.textContent = "Iniciar Sessió";

        if (data.success) {
            sessionStorage.setItem('tirador_session_token', data.token);
            sessionStorage.setItem('tirador_user_email', data.soci.email);

            document.getElementById('loginSection').classList.add('hidden');
            document.getElementById('dashboardSection').classList.remove('hidden');
            document.getElementById('subtittle').textContent = "Panell de Control del Soci";

            document.getElementById('valNom').textContent = data.soci.nom;
            document.getElementById('valEmail').textContent = data.soci.email;
            document.getElementById('valTelefon').textContent = data.soci.telefon;
            document.getElementById('valEstat').textContent = data.soci.estat;
        } else {
            errorDiv.textContent = data.message;
            errorDiv.classList.remove('hidden');
        }

    } catch (error) {
        console.error("Error detallat de connexió:", error);
        btn.disabled = false;
        btn.textContent = "Iniciar Sessió";
        errorDiv.textContent = "Error de connexió amb el servidor.";
        errorDiv.classList.remove('hidden');
    }
}

function logout() {
    sessionStorage.removeItem('tirador_session_token');
    sessionStorage.removeItem('tirador_user_email');

    document.getElementById('dashboardSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('subtittle').textContent = "Portal de Socis - Accés Privat";
    document.getElementById('loginForm').reset();
    validarEmailInput();
}
