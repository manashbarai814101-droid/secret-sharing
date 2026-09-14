const textarea = document.getElementById("secret");
const charCount = document.getElementById("charCount");

// Backend URL
const API_URL = "http://localhost:8080/api/secrets";


// Character counter
textarea.addEventListener("input", function () {

    const count = textarea.value.length;

    charCount.textContent =
        count + (count === 1 ? " character" : " characters");

});


// Create Secret
async function createSecret() {

    const secret = textarea.value.trim();
    const result = document.getElementById("result");

    if (secret === "") {

        result.style.display = "block";
        result.innerHTML = "⚠️ Please enter a secret first.";

        return;
    }


    // Generate ID
    const id = Math.random()
        .toString(36)
        .substring(2, 10);


    try {

        // Send secret to backend
        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                id: id,
                content: secret
            })

        });


        if (!response.ok) {
            throw new Error("Failed to create secret");
        }


        // Generate secret link
        const link =
            window.location.origin +
            window.location.pathname +
            "?secret=" +
            id;


        result.style.display = "block";

        result.innerHTML = `
            <div style="margin-bottom:8px;">
                🔗 <strong>Your secret link is ready</strong>
            </div>

            <div style="
                background:rgba(0,0,0,0.25);
                padding:10px;
                border-radius:7px;
                margin-bottom:10px;
                word-break:break-all;
            ">
                ${link}
            </div>

            <button
                onclick="copyLink('${link}')"
                style="
                    width:100%;
                    padding:9px;
                    border:none;
                    border-radius:7px;
                    background:rgba(124,92,255,0.2);
                    color:white;
                    cursor:pointer;
                "
            >
                📋 Copy Secret Link
            </button>
        `;


        textarea.value = "";
        charCount.textContent = "0 characters";

    } catch (error) {

        console.error(error);

        result.style.display = "block";

        result.innerHTML =
            "❌ Backend se connection nahi ho pa raha.";

    }
}


// Copy link
function copyLink(link) {

    navigator.clipboard.writeText(link);

    alert("Secret link copied! 🔐");

}
// Open secret from link
async function loadSecret() {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("secret");

    if (!id) return;

    const result = document.getElementById("result");

    try {

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            result.style.display = "block";
            result.innerHTML = "❌ Secret not found or expired.";
            return;
        }

        const data = await response.json();

        result.style.display = "block";

        result.innerHTML = `
            <div style="margin-bottom:8px;">
                🔐 <strong>Your secret</strong>
            </div>

            <div style="
                background:rgba(0,0,0,0.25);
                padding:15px;
                border-radius:7px;
                word-break:break-word;
            ">
                ${data.content}
            </div>
        `;

    } catch (error) {

        console.error(error);

        result.style.display = "block";
        result.innerHTML = "❌ Unable to connect to backend.";
    }
}


// Check secret link when page opens
loadSecret();