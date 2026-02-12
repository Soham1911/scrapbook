let flipInitialized = false;
let turnGestureBound = false;

function setupEnvelopeIntro() {
    const intro = document.getElementById("envelope-intro");
    const typed = document.getElementById("envelope-typed");
    const form = document.getElementById("password-form");
    if (!intro || !typed || !form) return;

    let opened = false;
    const message = "My love, before these pages unfold, enter our special date and let our memories bloom again.";

    intro.addEventListener("click", function() {
        if (opened) return;
        opened = true;
        intro.classList.add("opened");

        let i = 0;
        const typer = setInterval(() => {
            typed.textContent += message.charAt(i);
            i += 1;
            if (i >= message.length) {
                clearInterval(typer);
                form.style.display = "block";
                requestAnimationFrame(() => form.classList.add("show"));
            }
        }, 28);
    });
}

function syncFlipbookSize() {
    if (!flipInitialized) return;
    const container = document.getElementById("flipbook-container");
    if (!container) return;
    $("#flipbook").turn("size", container.clientWidth, container.clientHeight);
}

function checkPassword() {
    const correctPassword = "27112024"; // change this
    const input = document.getElementById("password-input").value;

    if (input === correctPassword) {
        document.getElementById("password-screen").style.display = "none";
        const container = document.getElementById("flipbook-container");
        container.style.display = "block";

        setTimeout(function() {
            if (!flipInitialized) {
                $("#flipbook").turn({
                    width: container.clientWidth,
                    height: container.clientHeight,
                    autoCenter: true,
                    display: "single",
                    gradients: false,
                    elevation: 25,
                    acceleration: false,
                    duration: 550
                });

                flipInitialized = true;
                setupTurnGestures();
            }
        }, 200);

        const bgm = document.getElementById("bgm");
        if (bgm) bgm.play().catch(() => {});
    } else {
        document.getElementById("error").innerText = "Wrong password. Try again.";
    }
}

function moveNoButton() {
    const actions = document.getElementById("valentine-actions");
    const noBtn = document.getElementById("no-btn");
    const yesBtn = document.getElementById("yes-btn");

    if (!actions || !noBtn) return;

    const maxX = Math.max(actions.clientWidth - noBtn.offsetWidth, 0);
    const maxY = Math.max(actions.clientHeight - noBtn.offsetHeight, 0);
    const safeGap = 12;
    let nextX = noBtn.offsetLeft;
    let nextY = noBtn.offsetTop;

    for (let i = 0; i < 36; i++) {
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
            yesMessage.classList.remove("show");
            void yesMessage.offsetWidth;
            yesMessage.classList.add("show");
            launchConfetti();
            setTimeout(launchConfetti, 420);
        });
    }
}

function setupPlayfulInteractions() {
    const runnerMessages = [
        "Too slow, sweetheart.",
        "Nice try. Try again!",
        "Almost caught me.",
        "I learned this from your No button.",
        "Catch me and I might reveal a kiss coupon."
    ];

    const runners = document.querySelectorAll(".tease-runner");
    runners.forEach((runner) => {
        const zone = runner.closest(".play-zone");
        const noteId = runner.dataset.noteTarget;
        const note = noteId ? document.getElementById(noteId) : null;
        if (!zone) return;

        const dodge = () => {
            const maxX = Math.max(zone.clientWidth - runner.offsetWidth - 8, 0);
            const maxY = Math.max(zone.clientHeight - runner.offsetHeight - 8, 0);
            const x = Math.random() * maxX;
            const y = Math.random() * Math.max(maxY - 18, 0);
            runner.style.left = x + "px";
            runner.style.top = y + "px";
            if (note) {
                note.textContent = runnerMessages[Math.floor(Math.random() * runnerMessages.length)];
            }
        };

        runner.addEventListener("mouseenter", dodge);
        runner.addEventListener("touchstart", function(e) {
            e.preventDefault();
            e.stopPropagation();
            dodge();
        }, { passive: false });
        runner.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            dodge();
        });
    });

    const teaseBtn = document.getElementById("tease-reveal-btn");
    const teaseText = document.getElementById("tease-reveal-text");
    const teaseReplies = [
        "You, by 2%.",
        "Me, by 200%.",
        "Both. But today, I am winning.",
        "Plot twist: our dog wins.",
        "Equal love, unlimited teasing."
    ];
    let teaseIndex = 0;

    if (teaseBtn && teaseText) {
        teaseBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            teaseText.textContent = teaseReplies[teaseIndex % teaseReplies.length];
            teaseIndex += 1;
        });
    }
}

function setupInteractivePages() {
    const revealButtons = document.querySelectorAll(".reveal-btn");
    revealButtons.forEach((button) => {
        button.addEventListener("click", function(e) {
            e.stopPropagation();
            const targetId = button.dataset.target;
            const note = document.getElementById(targetId);
            if (!note) return;
            note.classList.toggle("show");
            button.textContent = note.classList.contains("show") ? "Hide Memory Note" : "Open Memory Note";
        });
    });

    const chips = document.querySelectorAll(".memory-chip");
    const chipOutput = document.getElementById("chip-output");
    chips.forEach((chip) => {
        chip.addEventListener("click", function(e) {
            e.stopPropagation();
            if (!chipOutput) return;
            chipOutput.textContent = chip.dataset.text || "";
            chipOutput.classList.remove("note-reveal");
            void chipOutput.offsetWidth;
            chipOutput.classList.add("note-reveal");
        });
    });

    const meter = document.getElementById("love-meter");
    const meterText = document.getElementById("love-meter-text");
    const meterMessages = {
        "1": "Crushing softly, smiling secretly.",
        "2": "Falling steadily, heartbeat by heartbeat.",
        "3": "Somewhere between best friends and soulmates.",
        "4": "Hopelessly in love and loving every second.",
        "5": "Married, magical, and forever yours."
    };

    if (meter && meterText) {
        meter.addEventListener("input", function(e) {
            e.stopPropagation();
            meterText.textContent = meterMessages[meter.value] || meterMessages["3"];
        });
    }

    const shuffleBtn = document.querySelector(".shuffle-btn");
    const collage = document.getElementById("love-collage");
    const collageCards = collage ? Array.from(collage.querySelectorAll(".polaroid")) : [];
    if (shuffleBtn && collage && collageCards.length > 0) {
        shuffleBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            const order = collageCards
                .map((card) => ({ card, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map((item) => item.card);

            order.forEach((card, index) => {
                card.style.order = String(index);
                const randomRotation = Math.round((Math.random() - 0.5) * 20);
                const randomY = Math.round((Math.random() - 0.5) * 10);
                card.style.transform = "rotate(" + randomRotation + "deg) translateY(" + randomY + "px)";
            });

            collage.scrollTo({ left: 0, behavior: "smooth" });
        });
    }

    const timelineTexts = {
        vow: "When we said our vows, time felt still.",
        ring: "The ring slide felt like destiny fitting perfectly.",
        dance: "Our first dance was clumsy, tender, and unforgettable."
    };

    const timelineButtons = document.querySelectorAll(".timeline-step");
    const timelineMemory = document.getElementById("timeline-memory");
    timelineButtons.forEach((btn) => {
        btn.addEventListener("click", function(e) {
            e.stopPropagation();
            timelineButtons.forEach((item) => item.classList.remove("active"));
            btn.classList.add("active");
            if (!timelineMemory) return;
            const key = btn.dataset.memory;
            timelineMemory.textContent = timelineTexts[key] || "";
        });
    });

    const sticker = document.getElementById("sticker-open");
    const secretLetter = document.getElementById("secret-letter");
    const envelope = document.querySelector(".envelope-card");
    if (sticker && secretLetter) {
        sticker.addEventListener("click", function(e) {
            e.stopPropagation();
            if (envelope && envelope.classList.contains("opened")) return;

            if (envelope) {
                envelope.classList.add("open");
                envelope.classList.add("opened");
            }

            sticker.classList.add("opened");
            sticker.textContent = "Opened";

            setTimeout(() => {
                secretLetter.classList.add("show");
            }, 320);
        });
    }
}

function setupTurnGestures() {
    if (turnGestureBound) return;

    const container = document.getElementById("flipbook-container");
    if (!container) return;

    let startX = 0;
    let startY = 0;
    let startedOnInteractive = false;

    container.addEventListener("pointerdown", function(e) {
        const interactiveTarget = e.target.closest("[data-no-turn], button, input, textarea, select, label, a, .photo-board, .timeline");
        startedOnInteractive = Boolean(interactiveTarget);
        if (startedOnInteractive) return;
        startX = e.clientX;
        startY = e.clientY;
    }, { passive: true });

    container.addEventListener("pointerup", function(e) {
        if (!flipInitialized || startedOnInteractive) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (absDx >= 24 && absDy < 34) {
            $("#flipbook").turn(dx < 0 ? "next" : "previous");
            return;
        }

        if (absDx <= 8 && absDy <= 8) {
            const rect = container.getBoundingClientRect();
            const tapOnLeft = e.clientX < rect.left + rect.width / 2;
            $("#flipbook").turn(tapOnLeft ? "previous" : "next");
        }
    }, { passive: true });

    turnGestureBound = true;
}

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

setupEnvelopeIntro();
setupInteractivePages();
setupPlayfulInteractions();
setupValentineButtons();
window.addEventListener("resize", syncFlipbookSize);





