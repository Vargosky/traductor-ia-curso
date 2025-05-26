//importar dependencias
import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import { promptSystem } from "./public/assets/prompt/asistente.js"




//cargar configuracion (de api key)
dotenv.config();
//cargar express

const app = express();
const PORT = process.env.PORT || 3000;

//servir front end
app.use("/", express.static("public"));


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

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



    try {
        const promptSystemString = `
${promptSystem.rol}
${promptSystem.mision}
Restricciones: ${promptSystem.restricciones.join(" ")}
Información del negocio:
- Nombre: ${promptSystem.informacion_negocio.nombre}
- Ubicación: ${promptSystem.informacion_negocio.ubicacion}
- Horario:
  * Lunes a sábado: ${promptSystem.informacion_negocio.horario.lunes_a_sabado}
  * Domingo: ${promptSystem.informacion_negocio.horario.domingo}
- Contacto:
  * Teléfono: ${promptSystem.informacion_negocio.contacto.telefono}
  * Correo: ${promptSystem.informacion_negocio.contacto.correo}
  * Instagram: ${promptSystem.informacion_negocio.contacto.instagram}
- Servicios: ${promptSystem.informacion_negocio.servicios.join(" ")}
- Formas de pago: ${promptSystem.informacion_negocio.formas_pago.join(", ")}
Tono: ${promptSystem.comportamiento.tono}
Objetivo: ${promptSystem.comportamiento.objetivo}
`.trim();

        const completion = await openai.chat.completions.create({
            model: "qwen/qwen3-8b", // Modelo cargado en LM Studio
            messages: [
                { role: "system", content: promptSystemString },
                { role: "user", content: promptUsuario }
            ]
        });

        const responseText = completion.choices[0].message.content;
        const cleanText = responseText.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
        return res.status(200).json({ respuesta: cleanText });

    } catch (error) {
        console.error("Error al consultar el asistente:", error);
        return res.status(500).json({ error: "Error al generar respuesta con el LLM local" });
    }

});

app.post("/api/asistenteLLM", async (req, res) => {
    const { promptUsuario } = req.body;


    try {
        const promptSystemString = `
${promptSystem.rol}
${promptSystem.mision}
Restricciones: ${promptSystem.restricciones.join(" ")}
Información del negocio:
- Nombre: ${promptSystem.informacion_negocio.nombre}
- Ubicación: ${promptSystem.informacion_negocio.ubicacion}
- Horario:
  * Lunes a sábado: ${promptSystem.informacion_negocio.horario.lunes_a_sabado}
  * Domingo: ${promptSystem.informacion_negocio.horario.domingo}
- Contacto:
  * Teléfono: ${promptSystem.informacion_negocio.contacto.telefono}
  * Correo: ${promptSystem.informacion_negocio.contacto.correo}
  * Instagram: ${promptSystem.informacion_negocio.contacto.instagram}
- Servicios: ${promptSystem.informacion_negocio.servicios.join(" ")}
- Formas de pago: ${promptSystem.informacion_negocio.formas_pago.join(", ")}
Tono: ${promptSystem.comportamiento.tono}
Objetivo: ${promptSystem.comportamiento.objetivo}
`.trim();

        const completion = await openai.chat.completions.create({
            model: "qwen/qwen3-8b", // o el modelo que uses
            messages: [
                { role: "system", content: promptSystemString },
                { role: "user", content: promptUsuario }
            ]
        });

        const responseText = completion.choices[0].message.content;
        const cleanText = responseText.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

        return res.status(200).json({ respuesta: cleanText });

    } catch (error) {
        console.error("Error al consultar el asistente:", error);
        return res.status(500).json({ error: "Error al generar respuesta con el LLM local" });
    }
});




//servir el backked
app.listen(PORT, () => {
    console.log("Servidor corriendo correctamente en http://localhost:" + PORT);
})