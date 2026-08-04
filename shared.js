var boyAvatarSvg = "<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' fill='#3b82f6' stroke='#1e40af' stroke-width='1'><circle cx='12' cy='8' r='5'/><path d='M3 21v-1a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v1z'/></svg>";
var girlAvatarSvg = "<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' fill='#ec4899' stroke='#be185d' stroke-width='1'><circle cx='12' cy='8' r='5'/><path d='M4 21c0-5 3-8 8-8s8 3 8 8z'/><path d='M5 8a7 7 0 0 1 14 0'/></svg>";

function getAvatarSvg(avatar) {
    if (avatar === "girl") {
        return girlAvatarSvg;
    }
    return boyAvatarSvg;
}

function showNotification(message, isError) {

    var box = document.getElementById("notification");

    if (box == null) {
        box = document.createElement("div");
        box.id = "notification";
        document.body.appendChild(box);
    }

    box.textContent = message;

    if (isError) {
        box.className = "fixed top-4 right-4 px-4 py-2 rounded shadow text-white bg-red-500";
    } else {
        box.className = "fixed top-4 right-4 px-4 py-2 rounded shadow text-white bg-green-500";
    }

    setTimeout(function() {
        box.className = "hidden";
    }, 2500);

}

var captchaText = "";

function drawCaptcha(canvas) {

    var ctx = canvas.getContext("2d");

    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    captchaText = "";
    for (var i = 0; i < 5; i++) {
        captchaText += chars[Math.floor(Math.random() * chars.length)];
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var n = 0; n < 6; n++) {
        ctx.strokeStyle = "rgb(" + rand(100, 200) + "," + rand(100, 200) + "," + rand(100, 200) + ")";
        ctx.beginPath();
        ctx.moveTo(rand(0, canvas.width), rand(0, canvas.height));
        ctx.lineTo(rand(0, canvas.width), rand(0, canvas.height));
        ctx.stroke();
    }

    for (var j = 0; j < captchaText.length; j++) {

        ctx.save();

        var x = 20 + j * 30;
        var y = 30;

        ctx.translate(x, y);
        ctx.rotate((Math.random() - 0.5) * 0.6);

        ctx.font = rand(24, 32) + "px Arial";
        ctx.fillStyle = "rgb(" + rand(0, 100) + "," + rand(0, 100) + "," + rand(0, 100) + ")";

        ctx.fillText(captchaText[j], 0, 0);

        ctx.restore();
    }
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkCaptcha(userInput) {
    return userInput.toUpperCase() === captchaText;
}

function openHandleDb() {
    return new Promise(function(resolve, reject) {
        var request = indexedDB.open("fileHandleDb", 1);

        request.onupgradeneeded = function() {
            request.result.createObjectStore("handles");
        };

        request.onsuccess = function() {
            resolve(request.result);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}

async function saveFileHandle(handle) {
    var db = await openHandleDb();
    return new Promise(function(resolve, reject) {
        var tx = db.transaction("handles", "readwrite");
        tx.objectStore("handles").put(handle, "dataFile");
        tx.oncomplete = function() { resolve(); };
        tx.onerror = function() { reject(tx.error); };
    });
}

async function loadFileHandle() {
    var db = await openHandleDb();
    return new Promise(function(resolve, reject) {
        var tx = db.transaction("handles", "readonly");
        var getRequest = tx.objectStore("handles").get("dataFile");
        getRequest.onsuccess = function() { resolve(getRequest.result); };
        getRequest.onerror = function() { reject(getRequest.error); };
    });
}

async function readDataFromFile(handle) {
    var file = await handle.getFile();
    var text = await file.text();

    if (text.trim() === "") {
        return { lists: {} };
    }
    return JSON.parse(text);
}

async function writeDataToFile(handle, data) {
    var writable = await handle.createWritable();
    await writable.write(JSON.stringify(data, null, 2));
    await writable.close();
}

function setupHeader() {

    var currentUser = sessionStorage.getItem("currentUser");

    var avatarKey = "avatar_" + currentUser;

    var currentAvatar = localStorage.getItem(avatarKey);
    if (currentAvatar == null) {
        currentAvatar = "boy";
    }

    var signOutBtn = document.getElementById("signOutBtn");
    var darkModeBtn = document.getElementById("darkModeBtn");
    var avatarBtn = document.getElementById("avatarBtn");
    var usernameSpan = document.getElementById("usernameSpan");

    usernameSpan.textContent = currentUser;
    usernameSpan.style.cursor = "pointer";
    usernameSpan.onclick = function() {
        window.location.href = "profile.html";
    };

    avatarBtn.innerHTML = getAvatarSvg(currentAvatar);

    avatarBtn.onclick = function() {
        if (currentAvatar === "boy") {
            currentAvatar = "girl";
        } else {
            currentAvatar = "boy";
        }

        localStorage.setItem(avatarKey, currentAvatar);
        avatarBtn.innerHTML = getAvatarSvg(currentAvatar);
    };

    signOutBtn.onclick = function() {
        sessionStorage.removeItem("loggedIn");
        sessionStorage.removeItem("currentUser");
        window.location.href = "login.html";
    };

    function updateCalendarTheme(isDark) {
        var darkCalendarCss = document.getElementById("flatpickrDark");
        if (darkCalendarCss != null) {
            darkCalendarCss.disabled = !isDark;
        }
    }

    var darkModeOn = localStorage.getItem("darkMode") === "true";

    if (darkModeOn) {
        document.documentElement.classList.add("dark");
        darkModeBtn.textContent = "☀️";
    } else {
        darkModeBtn.textContent = "🌙";
    }

    updateCalendarTheme(darkModeOn);

    darkModeBtn.onclick = function() {
        document.documentElement.classList.toggle("dark");

        darkModeOn = document.documentElement.classList.contains("dark");
        localStorage.setItem("darkMode", darkModeOn);

        if (darkModeOn) {
            darkModeBtn.textContent = "☀️";
        } else {
            darkModeBtn.textContent = "🌙";
        }

        updateCalendarTheme(darkModeOn);
    };

}