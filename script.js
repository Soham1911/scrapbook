let flipInitialized = false;

function checkPassword() {
    const correctPassword = "27112024"; // change this
    const input = document.getElementById("password-input").value;

    if (input === correctPassword) {

        document.getElementById("password-screen").style.display = "none";
        const container = document.getElementById("flipbook-container");
        container.style.display = "block";

        setTimeout(function () {

            if (!flipInitialized) {

                $("#flipbook").turn({
                    width: container.clientWidth,
                    height: container.clientHeight,
                    autoCenter: true,
                    display: "single",
                    gradients: true,
                    elevation: 50,
                    acceleration: true
                });

                flipInitialized = true;
            }

        }, 200);

        const bgm = document.getElementById("bgm");
        if (bgm) bgm.play().catch(()=>{});

    } else {
        document.getElementById("error").innerText = "Wrong password 💔";
    }
}

function showReasons() {
    document.getElementById("reasons").style.display = "block";
}

function moveNoButton() {
    const actions = document.getElementById("valentine-actions");
    const noBtn = document.getElementById("no-btn");

    if (!actions || !noBtn) return;

    const maxX = Math.max(actions.clientWidth - noBtn.offsetWidth, 0);
    const maxY = Math.max(actions.clientHeight - noBtn.offsetHeight, 0);
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
}

function setupValentineButtons() {
    const yesBtn = document.getElementById("yes-btn");
    const noBtn = document.getElementById("no-btn");
    const yesMessage = document.getElementById("yes-message");

    if (noBtn) {
        noBtn.addEventListener("mouseenter", moveNoButton);
        noBtn.addEventListener("touchstart", function(e) {
            e.preventDefault();
            e.stopPropagation();
            moveNoButton();
        }, { passive: false });
        noBtn.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            moveNoButton();
        });
    }

    if (yesBtn && yesMessage) {
        yesBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            yesMessage.style.display = "block";
        });
    }
}

/* FORCE TAP TO TURN */
document.addEventListener("click", function(e) {
    const interactiveTarget = e.target.closest("button, input, textarea, select, label, a, #reasons");
    if (interactiveTarget) return;

    if (flipInitialized) {
        $("#flipbook").turn("next");
    }
});

function createHeart() {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerHTML = "❤️";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = (15 + Math.random() * 20) + "px";
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 6000);
}

setInterval(createHeart, 1200); 

setupValentineButtons();
