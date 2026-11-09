const STORAGE_KEY = "tasks";

const addNoteButton = document.querySelector("#add-note");
const formContainer = document.querySelector(".form-container");
const closeFormButton = document.querySelector(".closeForm");
const stack = document.querySelector(".stack");
const upButton = document.querySelector("#upBtn");
const downButton = document.querySelector("#downBtn");
const form = document.querySelector(".form-container form");
const imageUrlInput = form.querySelector("#image-url");
const fullNameInput = form.querySelector("#full-name");
const homeTownInput = form.querySelector("#home-town");
const purposeInput = form.querySelector("#purpose");

function getTasks() {
    try {
        const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(tasks) ? tasks : [];
    } catch {
        return [];
    }
}

function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createInfoRow(label, value) {
    const row = document.createElement("div");
    row.className = "info";

    const labelElement = document.createElement("span");
    labelElement.textContent = label;
    const valueElement = document.createElement("span");
    valueElement.textContent = value;

    row.append(labelElement, valueElement);
    return row;
}

function createCard(task) {
    const card = document.createElement("article");
    card.className = "card";

    const avatar = document.createElement("img");
    avatar.className = "avatar";
    avatar.src = task.imageUrl;
    avatar.alt = `${task.fullName}'s profile`;
    avatar.loading = "lazy";
    avatar.referrerPolicy = "no-referrer";

    const name = document.createElement("h2");
    name.textContent = task.fullName;

    const buttons = document.createElement("div");
    buttons.className = "buttons";

    const callButton = document.createElement("button");
    callButton.className = "call";
    callButton.type = "button";
    callButton.innerHTML = '<i class="ri-phone-line" aria-hidden="true"></i> Call';

    const messageButton = document.createElement("button");
    messageButton.className = "msg";
    messageButton.type = "button";
    messageButton.textContent = "Message";

    buttons.append(callButton, messageButton);
    card.append(
        avatar,
        name,
        createInfoRow("Home town", task.homeTown),
        createInfoRow("Purpose", task.purpose),
        buttons
    );
    return card;
}

function updateStack() {
    Array.from(stack.children).forEach((card, index) => {
        card.style.zIndex = String(Math.max(1, 3 - index));
        card.style.transform = `translateY(${Math.min(index, 2) * 10}px) scale(${1 - Math.min(index, 2) * 0.02})`;
        card.style.opacity = String(1 - Math.min(index, 2) * 0.1);
    });
}

function showCards() {
    const cards = document.createDocumentFragment();
    getTasks().forEach((task) => cards.append(createCard(task)));
    stack.replaceChildren(cards);
    updateStack();
}

addNoteButton.addEventListener("click", () => {
    formContainer.style.display = "block";
    imageUrlInput.focus();
});

closeFormButton.addEventListener("click", () => {
    formContainer.style.display = "none";
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const selectedCategory = form.querySelector("input[name='category']:checked");
    if (!selectedCategory) return;

    const imageUrl = imageUrlInput.value.trim();
    if (!/^https?:\/\//i.test(imageUrl)) {
        imageUrlInput.setCustomValidity("Enter a valid image URL starting with http:// or https://.");
        imageUrlInput.reportValidity();
        imageUrlInput.setCustomValidity("");
        return;
    }

    try {
        saveTask({
            imageUrl,
            fullName: fullNameInput.value.trim(),
            homeTown: homeTownInput.value.trim(),
            purpose: purposeInput.value.trim(),
            selected: selectedCategory.value,
        });
    } catch (error) {
        alert("Unable to save this note. Check that browser storage is available.");
        return;
    }

    form.reset();
    formContainer.style.display = "none";
    showCards();
});

upButton.addEventListener("click", () => {
    const lastCard = stack.lastElementChild;
    if (lastCard) {
        stack.prepend(lastCard);
        updateStack();
    }
});

downButton.addEventListener("click", () => {
    const firstCard = stack.firstElementChild;
    if (firstCard) {
        stack.append(firstCard);
        updateStack();
    }
});

showCards();
