// Listener para abrir o chat quando recebe uma mensagem
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "openChat") {
        openChatModal(request.url); // Chama a função para abrir o modal de chat
    } 
});

// Função para abrir o modal de chat
function openChatModal(url) {
    const existingModal = document.getElementById("floating-chat-modal");

    // Se já existir, atualiza a URL e mostra o modal
    if (existingModal) {
        updateModal(existingModal, url);
        existingModal.style.display = 'flex'; // Garante que o modal esteja visível
        return; // Retorna sem criar um novo modal
    }

    // Criando um novo modal
    const chatModal = createChatModal(url);
    document.body.appendChild(chatModal);
}

// Função para atualizar um modal existente
function updateModal(modal, url) {
    modal.querySelector('iframe').src = url; // Atualiza a URL do iframe
}

// Função para criar um novo modal com o iframe
function createChatModal(url) {
    const chatModal = document.createElement("div");
    setModalStyles(chatModal);
    
    const header = createHeader();
    const iframe = createIframe(url);
    
    chatModal.appendChild(header);
    chatModal.appendChild(iframe);

    return chatModal;
}

// Função para definir os estilos do modal
function setModalStyles(modal) {
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "white";
    modal.style.border = "1px solid #ccc";
    modal.style.borderRadius = "8px";
    modal.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
    modal.style.zIndex = "10001";
    modal.style.display = "flex";
    modal.style.flexDirection = "column";
    modal.style.resize = "both"; // Permite redimensionar
    modal.style.overflow = "hidden"; // Esconde a barra de rolagem

    // Restaura o tamanho do chat, se disponível
    const savedSize = JSON.parse(localStorage.getItem('chatModalSize'));
    if (savedSize) {
        modal.style.width = savedSize.width;
        modal.style.height = savedSize.height;
    } else {
        modal.style.width = "800px"; // Tamanho padrão
        modal.style.height = "600px"; // Tamanho padrão
    }
}

// Função para criar o cabeçalho do modal
function createHeader() {
    const header = document.createElement("div");
    header.style.backgroundColor = "#5e17eb";
    header.style.color = "white";
    header.style.padding = "10px";
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.position = "relative"; // Para posicionar o botão de fechar

    const title = document.createElement("span");
    title.textContent = "Chat"; // Nome do chat

    const closeButton = createCloseButton();
    
    header.appendChild(title);
    header.appendChild(closeButton);
    
    return header;
}

// Função para criar o botão de fechar
function createCloseButton() {
    const closeButton = document.createElement("button");
    closeButton.textContent = "×"; // Símbolo de fechamento
    closeButton.style.backgroundColor = "transparent"; // Fundo transparente
    closeButton.style.border = "none"; // Sem borda
    closeButton.style.color = "white"; // Cor do texto
    closeButton.style.cursor = "pointer"; // Muda o cursor ao passar por cima
    closeButton.style.fontSize = "20px"; // Tamanho da fonte
    closeButton.style.width = "20px"; // Largura do botão
    closeButton.style.height = "20px"; // Altura do botão
    closeButton.style.borderRadius = "50%"; // Botão arredondado
    closeButton.style.position = "absolute"; // Para o posicionamento
    closeButton.style.right = "10px"; // Margem à direita
    closeButton.style.top = "10px"; // Margem acima

    // Evento para fechar o modal ao clicar no botão
    closeButton.addEventListener("click", () => {
        const chatModal = closeButton.closest('div').parentElement; // Encontrar o modal mais próximo
        if (chatModal) {
            chatModal.remove(); // Remove o modal do DOM
        }
    });

    return closeButton;
}

// Função para criar o iframe
function createIframe(url) {
    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "calc(100% - 40px)"; // Espaço para o cabeçalho
    iframe.style.border = "none";
    iframe.src = url; // Define a URL do chat
    
    return iframe;
}

// Função para salvar o tamanho do modal
function saveChatSize(modal) {
    const size = {
        width: modal.style.width,
        height: modal.style.height,
    };
    localStorage.setItem('chatModalSize', JSON.stringify(size));
}