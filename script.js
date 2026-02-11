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

/* FORCE TAP TO TURN */
document.addEventListener("click", function(e) {
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