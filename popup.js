document.addEventListener("DOMContentLoaded", () => {
    const addChatForm = document.querySelector("#addChatForm");
    const chatList = document.querySelector("#chatList");

    // Carregar chats salvos ao abrir o popup
    loadChats();

    // Adicionar novo chat
    addChatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const chatName = document.querySelector("#chatName").value.trim();
        const chatUrl = document.querySelector("#chatUrl").value.trim();

        if (chatName && isValidUrl(chatUrl)) {
            saveChat(chatName, chatUrl);
        } else {
            alert("Por favor, insira um nome válido e uma URL correta.");
        }
    });

    // Função para carregar chats
    function loadChats() {
        chrome.storage.sync.get("chats", ({ chats }) => {
            if (chats && Array.isArray(chats)) {
                chats.forEach(({ name, url }) => renderChat(name, url));
            }
        });
    }

    // Função para salvar um novo chat
    function saveChat(name, url) {
        chrome.storage.sync.get("chats", ({ chats = [] }) => {
            const newChat = { name, url };
            const updatedChats = [...chats, newChat];

            chrome.storage.sync.set({ chats: updatedChats }, () => {
                renderChat(name, url);
                addChatForm.reset(); // Resetar o formulário
                alert("Chat salvo com sucesso!");
            });
        });
    }

    // Função para renderizar um chat na lista
    function renderChat(name, url) {
        const li = document.createElement("li");
        li.className = "chat-item";
    
        const chatNameSpan = document.createElement("span");
        chatNameSpan.textContent = name;
    
        // Criação de um contêiner para os botões
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex"; // Torna o contêiner flexível
        buttonContainer.style.justifyContent = "flex-end"; // Alinha os botões à direita
        buttonContainer.style.gap = "10px"; // Espaço entre os botões
    
        const startChatBtn = document.createElement("button");
        startChatBtn.textContent = "Iniciar Chat";
        startChatBtn.style.backgroundColor = "#5e17eb"; // Mudando a cor do botão "Iniciar Chat"
        startChatBtn.style.color = "white"; // Cor do texto
        startChatBtn.style.border = "none"; // Sem borda
        startChatBtn.style.padding = "5px 10px"; // Padding do botão
        startChatBtn.style.borderRadius = "4px"; // Bordas arredondadas
        startChatBtn.onclick = () => openChatWidget(url); // Inicia o chat
    
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Excluir";
        deleteBtn.style.backgroundColor = "#c62828"; // Cor do botão "Excluir"
        deleteBtn.style.color = "white"; // Cor do texto
        deleteBtn.style.border = "none"; // Sem borda
        deleteBtn.style.padding = "5px 10px"; // Padding do botão
        deleteBtn.style.borderRadius = "4px"; // Bordas arredondadas
        deleteBtn.onclick = () => removeChat(name, url, li); // Remove o chat
    
        // Adiciona os botões ao contêiner
        buttonContainer.appendChild(startChatBtn);
        buttonContainer.appendChild(deleteBtn);
    
        li.appendChild(chatNameSpan);
        li.appendChild(buttonContainer);
        chatList.appendChild(li);
    }

    // Função para abrir o chat
    function openChatWidget(url) {
        const widgetMessage = { action: "openChat", url };
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, widgetMessage);
            }
        });
    }

    // Função para remover um chat
    function removeChat(name, url, element) {
        chrome.storage.sync.get("chats", ({ chats = [] }) => {
            const updatedChats = chats.filter(chat => !(chat.name === name && chat.url === url));
            chrome.storage.sync.set({ chats: updatedChats }, () => {
                element.remove(); // Remove o chat da lista
            });
        });
    }

    // Função para validar a URL
    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // Estilizando o botão "Salvar" no formulário
    const saveButton = document.querySelector('#addChatForm button[type="submit"]');
    saveButton.style.backgroundColor = "#5e17eb"; // Cor do botão "Salvar"
    saveButton.style.color = "white"; // Cor do texto do botão "Salvar"
    saveButton.style.border = "none"; // Sem borda
    saveButton.style.padding = "10px 15px"; // Padding do botão
    saveButton.style.borderRadius = "4px"; // Bordas arredondadas
    saveButton.style.cursor = "pointer"; // Cursor de mão ao passar sobre o botão

    // Efeitos de hover para o botão "Salvar"
    saveButton.addEventListener('mouseover', () => {
        saveButton.style.backgroundColor = "#4c14c5"; // Cor de fundo ao passar o mouse
    });

    saveButton.addEventListener('mouseout', () => {
        saveButton.style.backgroundColor = "#5e17eb"; // Cor de fundo ao sair 
    });
});