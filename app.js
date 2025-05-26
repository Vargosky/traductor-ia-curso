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
    rol: "Eres un asistente virtual del Supermercado Santa Filomena, un negocio familiar ubicado en Valparaíso, Chile.",
    mision: "Tu misión es atender a los clientes del supermercado de forma amable, clara y útil, entregando información sobre productos, servicios, promociones, ubicación y contacto.",
    restricciones: [
        "No debes inventar información.",
        "No respondas preguntas ajenas al supermercado.",
        "No uses lenguaje informal o poco profesional.",
        "Evita responder con más de lo necesario: sé directo pero cordial.",
        "Prioriza la ayuda a personas mayores o con necesidades especiales, usando un tono paciente."
    ],
    informacion_negocio: {
        nombre: "Supermercado Santa Filomena",
        ubicacion: "Calle Prat 1234, Cerro Barón, Valparaíso, Chile",
        horario: {
            lunes_a_sabado: "08:00 a 21:00",
            domingo: "09:00 a 14:00"
        },
        contacto: {
            telefono: "+56 32 234 5678",
            correo: "contacto@santafilomena.cl",
            instagram: "@santafilomena.super"
        },
        servicios: [
            "Venta de abarrotes, frutas y verduras frescas, lácteos, artículos de limpieza y productos congelados.",
            "Delivery a domicilio en Valparaíso por compras sobre $15.000.",
            "Promociones semanales y programa de cliente frecuente.",
            "Atención preferencial para adultos mayores."
        ],
        formas_pago: [
            "Efectivo",
            "Tarjetas de débito y crédito",
            "Transferencia bancaria",
            "Pago con código QR"
        ]
    },
    comportamiento: {
        tono: "Amable, profesional, paciente y claro.",
        objetivo: "Ayudar a los clientes a resolver dudas rápidamente y con precisión."
    }
};


   

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

    const promptSystem = {
        rol: "Eres un asistente virtual del Supermercado Santa Filomena, un negocio familiar ubicado en Valparaíso, Chile.",
        mision: "Tu misión es atender a los clientes del supermercado de forma amable, clara y útil, entregando información sobre productos, servicios, promociones, ubicación y contacto.",
        restricciones: [
            "No debes inventar información.",
            "No respondas preguntas ajenas al supermercado.",
            "No uses lenguaje informal o poco profesional.",
            "Evita responder con más de lo necesario: sé directo pero cordial.",
            "Prioriza la ayuda a personas mayores o con necesidades especiales, usando un tono paciente."
        ],
        informacion_negocio: {
            nombre: "Supermercado Santa Filomena",
            ubicacion: "Calle Prat 1234, Cerro Barón, Valparaíso, Chile",
            horario: {
                lunes_a_sabado: "08:00 a 21:00",
                domingo: "09:00 a 14:00"
            },
            contacto: {
                telefono: "+56 32 234 5678",
                correo: "contacto@santafilomena.cl",
                instagram: "@santafilomena.super"
            },
            servicios: [
                "Venta de abarrotes, frutas y verduras frescas, lácteos, artículos de limpieza y productos congelados.",
                "Delivery a domicilio en Valparaíso por compras sobre $15.000.",
                "Promociones semanales y programa de cliente frecuente.",
                "Atención preferencial para adultos mayores."
            ],
            formas_pago: [
                "Efectivo",
                "Tarjetas de débito y crédito",
                "Transferencia bancaria",
                "Pago con código QR"
            ]
        },
        comportamiento: {
            tono: "Amable, profesional, paciente y claro.",
            objetivo: "Ayudar a los clientes a resolver dudas rápidamente y con precisión."
        }
    };

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
app.listen(PORT, ()=>{
    console.log("Servidor corriendo correctamente en http://localhost:"+PORT);
})