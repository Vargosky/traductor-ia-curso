const translateButton = document.querySelector("#translateButton");

translateButton.addEventListener("click", async () => {
    const inputText = document.querySelector("#inputText");
    const text = inputText.value.trim();

    if (!text) return false;

    // Mostrar mensaje del usuario en el chat
    const userMessage = document.createElement("div");
    userMessage.className = "chat__message chat__message--user";
    userMessage.textContent = text;

    const messageContainer = document.querySelector(".chat__messages");
    messageContainer.appendChild(userMessage);
    messageContainer.scrollTop = messageContainer.scrollHeight;

    try {
        const response = await fetch("/api/asistenteLLM", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                promptUsuario: text
            })
        });

        const data = await response.json();

        const botMessage = document.createElement("div");
        botMessage.className = "chat__message chat__message--bot";
        botMessage.textContent = data.respuesta || "Lo siento, no entendí la pregunta.";

        messageContainer.appendChild(botMessage);
        messageContainer.scrollTop = messageContainer.scrollHeight;

    } catch (error) {
        console.error("Error al comunicarse con el asistente:", error);

        const errorMessage = document.createElement("div");
        errorMessage.className = "chat__message chat__message--bot error";
        errorMessage.textContent = "Lo sentimos, hubo un error al consultar al asistente.";
        messageContainer.appendChild(errorMessage);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    inputText.value = "";
});
