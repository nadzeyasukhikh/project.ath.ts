"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const baseURL = "https://jsonplaceholder.typicode.com/users";
function fetchData(username, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseURL}?username=${username}&email=${email}`;
        try {
            const res = yield fetch(url);
            const data = yield res.json();
            return data;
        }
        catch (e) {
            console.log('Error:', e);
            return undefined;
        }
    });
}
const form = document.querySelector('#authForm');
const usernameInput = document.querySelector('#username');
const emailInput = document.querySelector('#email');
const usernameFeedback = document.querySelector('#usernameFeedback');
const emailFeedback = document.querySelector('#emailFeedback');
usernameInput === null || usernameInput === void 0 ? void 0 : usernameInput.addEventListener('input', validateInput);
emailInput === null || emailInput === void 0 ? void 0 : emailInput.addEventListener('input', validateInput);
form === null || form === void 0 ? void 0 : form.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const username = usernameInput.value;
    const email = emailInput.value;
    const data = yield fetchData(username, email);
    console.log(data);
    if (data && data.length > 0) {
        renderUser(data[0]);
    }
    else {
        alert('This user does not exist.');
    }
}));
function validateInput(event) {
    const target = event.target;
    const feedback = target.nextElementSibling;
    if (target.value.trim() !== '') {
        feedback.textContent = 'The field is filled in correctly.';
        feedback.style.color = "#32CD32";
    }
    else {
        feedback.textContent = 'The field is filled in incorrectly.';
        feedback.style.color = "#FF0000";
    }
}
function renderUser(user) {
    const container = document.querySelector('#userDetails');
    if (!container) {
        console.error("Unable to find the #userDetails container.");
        return;
    }
    form.style.display = "none";
    container.style.display = "block";
    container.innerHTML = `
        <p>ID: ${user.id}</p>
        <p>Name: ${user.name}</p>
        <p>Username: ${user.username}</p>
        <p>Email: ${user.email}</p>
        <p>Phone: ${user.phone}</p>
        <p>Website: <input id="websiteInput" value="${user.website}"></p>
        <button id="updateWebsite">Edit Website</button>
        <button id="btnSearch">Search</button>
    `;
    const updateWebsite = document.querySelector('#updateWebsite');
    const websiteInput = document.querySelector('#websiteInput');
    if (updateWebsite && websiteInput) {
        updateWebsite.addEventListener('click', () => {
            user.website = websiteInput.value;
            alert('Website edited!');
        });
    }
    const btnSearch = document.querySelector("#btnSearch");
    const nextPage = document.querySelector('#nextPage');
    if (btnSearch && nextPage) {
        btnSearch.addEventListener("click", () => {
            container.style.display = 'none';
            nextPage.style.display = 'block';
        });
    }
}
const searchInput = document.querySelector('#searchInput');
const searchResults = document.querySelector('#searchResults');
const btnAlbums = document.querySelector('#btnAlbums');
const btnTodos = document.querySelector('#btnTodos');
const btnPosts = document.querySelector('#btnPosts');
let currentSearchType = "";
btnAlbums.addEventListener('click', () => {
    currentSearchType = "albums";
    toggleSearchPage();
});
btnTodos.addEventListener('click', () => {
    currentSearchType = "todos";
    toggleSearchPage();
});
btnPosts.addEventListener('click', () => {
    currentSearchType = "posts";
    toggleSearchPage();
});
const backBtn = document.querySelector(".backBtn");
const searchContainer = document.querySelector('#searchContainer');
const nextPage = document.querySelector('#nextPage');
function toggleSearchPage() {
    if (nextPage && searchContainer && searchInput && searchResults) {
        nextPage.style.display = 'none';
        searchContainer.style.display = 'block';
        searchInput.value = '';
        searchResults.innerHTML = '';
    }
}
searchInput.addEventListener('input', (event) => __awaiter(void 0, void 0, void 0, function* () {
    const target = event.target;
    const query = target.value;
    if (query) {
        const results = yield searchByTitle(query, currentSearchType);
        if (results) {
            displayResults(results);
        }
    }
    else {
        searchResults.innerHTML = '';
    }
}));
function searchByTitle(query, type) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://jsonplaceholder.typicode.com/${type}`);
            const data = yield response.json();
            return data.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
        }
        catch (e) {
            console.log('Error:', e);
        }
    });
}
function displayResults(results) {
    if (results) {
        searchResults.innerHTML = results.map(item => `<div>${item.title}</div>`).join('');
    }
}
if (backBtn && searchContainer && nextPage) {
    backBtn.addEventListener("click", () => {
        searchContainer.style.display = 'none';
        nextPage.style.display = 'block';
    });
}
