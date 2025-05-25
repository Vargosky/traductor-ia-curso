//importar dependencias
import express from "express";
import dotenv from  "dotenv";
import OpenAI from "openai";




//cargar configuracion (de api key)
dotenv.config();
//cargar express

const app = express();
const PORT = process.env.PORT || 3000;

//servir front end
app.use("/", express.static("public"));


// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//instancia de openai y pasar el apikey
// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });
// //Ruta


const openai = new OpenAI({
    baseURL: "http://localhost:1234/v1", // Cambia el puerto si LM Studio usa otro
    apiKey: "lm-studio", // LM Studio ignora el API key, pero se requiere algo
});


app.post("/api/traducir", async (req, res) => {
    const { text, targetLang } = req.body;

    const promptSystem = {
        rol: "Eres un traductor profesional",
        mision: "Tu misión es traducir de forma precisa la frase que se te proporciona.",
        restriccion: "Solamente debes responder la traducción, otra interacción está prohibida."
    };

    const promptUsuario = `Traduce el siguiente texto: "${text}" al ${targetLang}`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: promptSystem.rol },
                { role: "system", content: promptSystem.mision + " " + promptSystem.restriccion },
                { role: "user", content: promptUsuario }
            ]
        });

        const translatedText = completion.choices[0].message.content;
        return res.status(200).json({ translatedText });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al traducir" });
    }
});

app.post("/api/traducirLLM", async (req, res) => {
    const { text, targetLang } = req.body;

    const promptSystem = {
        rol: "Eres un traductor profesional",
        mision: "Tu misión es traducir de forma precisa la frase que se te proporciona.",
        restriccion: "Solamente debes responder con la traducción. No expliques, no pienses en voz alta, no incluyas etiquetas como <think> ni otras reflexiones. Solo responde con el texto traducido, nada más."
    };

    const promptUsuario = `Traduce el siguiente texto: "${text}" al ${targetLang}`;

    try {
        const completion = await openai.chat.completions.create({
            model: "qwen/qwen3-8b", // el modelo que aparece cargado en LM Studio
            messages: [
                { role: "system", content: `${promptSystem.rol} ${promptSystem.mision} ${promptSystem.restriccion}` },
                { role: "user", content: promptUsuario }
            ]
        });

        const translatedText = completion.choices[0].message.content;
        const cleanText = translatedText.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
        return res.status(200).json({ translatedText: cleanText });

    } catch (error) {
        console.error("Error al traducir:", error);
        return res.status(500).json({ error: "Error al traducir con LLM local" });
    }
});



//servir el backked
app.listen(PORT, ()=>{
    console.log("Servidor corriendo correctamente en http://localhost:"+PORT);
})