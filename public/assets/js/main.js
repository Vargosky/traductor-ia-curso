const translateButton = document.querySelector("#translateButton");

translateButton.addEventListener("click", async () => {
    let inputText = document.querySelector("#inputText");
    const text = inputText.value.trim();
    const targetLang = document.querySelector("#targetLang").value;

    if (!text) return false;

    const userMessage = document.createElement("div");
    userMessage.className = "chat__message chat__message--user";
    userMessage.textContent = text;

    const messageContainer = document.querySelector(".chat__messages");
    messageContainer.appendChild(userMessage);
    messageContainer.scrollTop = messageContainer.scrollHeight;

    try {
        const response = await fetch("/api/traducir", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                text,
                targetLang
            })
        });
        

        const data = await response.json();
        // alert(data.translatedText);

        //agregar al componente 

        const botMessage = document.createElement("div");
        botMessage.className = "chat__message chat__message--bot"

        botMessage.textContent = data.translatedText;
        messageContainer.appendChild(botMessage);
        messageContainer.scrollTop = messageContainer.scrollHeight;

        

    } catch (error) {
        console.log({ "Error": "error al traducir", detalle: error });
    }

    inputText.value = "";
});
