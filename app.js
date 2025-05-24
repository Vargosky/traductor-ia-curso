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
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
//Ruta

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


//servir el backked
app.listen(PORT, ()=>{
    console.log("Servidor corriendo correctamente en http://localhost:"+PORT);
})