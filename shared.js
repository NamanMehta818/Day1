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

function loadHeaderFooter() {

    var currentUser = sessionStorage.getItem("currentUser");

    var avatarKey = "avatar_" + currentUser;

    var currentAvatar = localStorage.getItem(avatarKey);
    if (currentAvatar == null) {
        currentAvatar = "boy";
    }

    var headerHtml = "";
    headerHtml += "<div class='flex justify-between items-center mb-6'>";
    headerHtml += "<button id='darkModeBtn' class='border rounded px-3 py-1 bg-white dark:bg-gray-800 text-lg'></button>";
    headerHtml += "<div class='flex items-center gap-3'>";
    headerHtml += "<button id='avatarBtn' title='Click to change avatar'></button>";
    headerHtml += "<span>" + currentUser + "</span>";
    headerHtml += "<button id='signOutBtn' class='border rounded px-3 py-1 bg-white dark:bg-gray-800'>Sign Out</button>";
    headerHtml += "</div>";
    headerHtml += "</div>";

    document.getElementById("pageHeader").innerHTML = headerHtml;

    var signOutBtn = document.getElementById("signOutBtn");
    var darkModeBtn = document.getElementById("darkModeBtn");
    var avatarBtn = document.getElementById("avatarBtn");

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

    var darkModeOn = localStorage.getItem("darkMode") === "true";

    if (darkModeOn) {
        document.documentElement.classList.add("dark");
        darkModeBtn.textContent = "☀️";
    } else {
        darkModeBtn.textContent = "🌙";
    }

    darkModeBtn.onclick = function() {
        document.documentElement.classList.toggle("dark");

        darkModeOn = document.documentElement.classList.contains("dark");
        localStorage.setItem("darkMode", darkModeOn);

        if (darkModeOn) {
            darkModeBtn.textContent = "☀️";
        } else {
            darkModeBtn.textContent = "🌙";
        }
    };

}