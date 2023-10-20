interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone?: string;  
    website?: string;
}
const baseURL: string = "https://jsonplaceholder.typicode.com/users";

async function fetchData(username: string, email: string): Promise<User[] | undefined> {
    const url: string = `${baseURL}?username=${username}&email=${email}`;
    
    try {
        const res = await fetch(url);
        const data: User[] = await res.json();
        return data;
    } catch (e) {
        console.log('Error:', e);
        return undefined;
    }
}

const form = document.querySelector('#authForm') as HTMLFormElement;
const usernameInput = document.querySelector('#username') as HTMLInputElement;
const emailInput = document.querySelector('#email') as HTMLInputElement;
const usernameFeedback = document.querySelector('#usernameFeedback') as HTMLSpanElement;
const emailFeedback = document.querySelector('#emailFeedback') as HTMLSpanElement;

usernameInput?.addEventListener('input', validateInput);
emailInput?.addEventListener('input', validateInput);

form?.addEventListener('submit', async (event: Event) => {
    event.preventDefault();
    
    const username = usernameInput.value;
    const email = emailInput.value;

    const data = await fetchData(username, email);
    console.log(data);

    if (data && data.length > 0) {
        renderUser(data[0]);
    } else {
        alert('This user does not exist.');
    }
});

function validateInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const feedback = target.nextElementSibling as HTMLSpanElement;

    if (target.value.trim() !== '') {  
        feedback.textContent = 'The field is filled in correctly.';
        feedback.style.color = "#32CD32";
    } else {
        feedback.textContent = 'The field is filled in incorrectly.';
        feedback.style.color = "#FF0000"; 
    }
}


function renderUser(user: User) {
    const container = document.querySelector('#userDetails') as HTMLElement;
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
    const updateWebsite = document.querySelector('#updateWebsite') as HTMLButtonElement
    const websiteInput = document.querySelector('#websiteInput') as HTMLInputElement

    if (updateWebsite && websiteInput) {
    updateWebsite.addEventListener('click', () => {
        user.website = websiteInput.value;
        alert('Website edited!');
    
    });
}

    const btnSearch = document.querySelector("#btnSearch") as HTMLButtonElement;
    const nextPage = document.querySelector('#nextPage') as HTMLElement;

    if (btnSearch && nextPage) {
    btnSearch.addEventListener("click", () => {
        container.style.display = 'none';
        nextPage.style.display = 'block';
    });
}
}

const searchInput = document.querySelector('#searchInput') as HTMLInputElement;
const searchResults = document.querySelector('#searchResults') as HTMLElement;

const btnAlbums = document.querySelector('#btnAlbums') as HTMLButtonElement;
const btnTodos = document.querySelector('#btnTodos') as HTMLButtonElement;
const btnPosts = document.querySelector('#btnPosts') as HTMLButtonElement;

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
const backBtn = document.querySelector(".backBtn") as HTMLElement | null;
const searchContainer = document.querySelector('#searchContainer') as HTMLElement | null;
const nextPage = document.querySelector('#nextPage') as HTMLElement | null;

function toggleSearchPage() {
    if (nextPage && searchContainer && searchInput && searchResults) {
        nextPage.style.display = 'none';
        searchContainer.style.display = 'block';
        searchInput.value = '';
        searchResults.innerHTML = '';
    }
}

interface SearchResult {
    title: string;
    
}

searchInput.addEventListener('input', async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const query: string = target.value;
    if (query) {
        const results: SearchResult[] | undefined = await searchByTitle(query, currentSearchType);
        if (results) {
            displayResults(results);
        }
    } else {
        searchResults.innerHTML = '';
    }
});

async function searchByTitle(query: string, type: string): Promise<SearchResult[] | undefined> {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/${type}`);
        const data: SearchResult[] = await response.json();
        return data.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
    } catch (e) {
        console.log('Error:', e);
    }
}

function displayResults(results: SearchResult[] | undefined) {
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