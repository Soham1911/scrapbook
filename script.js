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
    const yesBtn = document.getElementById("yes-btn");

    if (!actions || !noBtn) return;

    const maxX = Math.max(actions.clientWidth - noBtn.offsetWidth, 0);
    const maxY = Math.max(actions.clientHeight - noBtn.offsetHeight, 0);
    const safeGap = 10;
    let nextX = noBtn.offsetLeft;
    let nextY = noBtn.offsetTop;

    for (let i = 0; i < 30; i++) {
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        if (!yesBtn) {
            nextX = x;
            nextY = y;
            break;
        }

        const overlapX = x < yesBtn.offsetLeft + yesBtn.offsetWidth + safeGap &&
            x + noBtn.offsetWidth + safeGap > yesBtn.offsetLeft;
        const overlapY = y < yesBtn.offsetTop + yesBtn.offsetHeight + safeGap &&
            y + noBtn.offsetHeight + safeGap > yesBtn.offsetTop;

        if (!(overlapX && overlapY)) {
            nextX = x;
            nextY = y;
            break;
        }
    }

    noBtn.style.left = nextX + "px";
    noBtn.style.top = nextY + "px";
}

function launchConfetti() {
    const colors = ["#ff4f8a", "#ffd166", "#7bdff2", "#b388ff", "#95e06c"];
    const total = 100;

    for (let i = 0; i < total; i++) {
        const piece = document.createElement("span");
        piece.className = "confetti-piece";
        piece.style.left = 50 + (Math.random() * 12 - 6) + "vw";
        piece.style.top = "45vh";
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.transform = "rotate(" + (Math.random() * 360) + "deg)";
        document.body.appendChild(piece);

        const x = (Math.random() - 0.5) * 340;
        const y = 220 + Math.random() * 250;
        const r = (Math.random() - 0.5) * 700;
        const duration = 900 + Math.random() * 700;

        piece.animate(
            [
                { transform: piece.style.transform + " translate(0, 0)", opacity: 1 },
                { transform: piece.style.transform + " translate(" + x + "px, " + y + "px) rotate(" + r + "deg)", opacity: 0.95 },
                { transform: piece.style.transform + " translate(" + (x * 1.15) + "px, " + (y + 80) + "px) rotate(" + (r * 1.4) + "deg)", opacity: 0 }
            ],
            {
                duration: duration,
                easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
                fill: "forwards"
            }
        );

        setTimeout(() => piece.remove(), duration + 80);
    }
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
            launchConfetti();
        });
    }
}

/* TAP LEFT/RIGHT TO TURN */
document.addEventListener("click", function(e) {
    const interactiveTarget = e.target.closest("button, input, textarea, select, label, a, #reasons");
    if (interactiveTarget) return;

    if (!flipInitialized) return;

    const container = document.getElementById("flipbook-container");
    if (!container || container.style.display === "none") return;

    const rect = container.getBoundingClientRect();
    const insideBook = e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!insideBook) return;

    const clickOnLeft = e.clientX < rect.left + rect.width / 2;
    $("#flipbook").turn(clickOnLeft ? "previous" : "next");
});

function createHeart() {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = "\u2764\uFE0F";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = (15 + Math.random() * 20) + "px";
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 6000);
}

setInterval(createHeart, 1500); 

setupValentineButtons();

