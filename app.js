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

app.post("/api/traducir", (req, res)=>{
    //funcionalidad de traducir con ia
    //llamar a llm
    return(res.status(200).json({
        message: "hola soy una ruta",
        contenido: req.body,
        algo:"asd"
    }))
});


//servir el backked
app.listen(PORT, ()=>{
    console.log("Servidor corriendo correctamente en http://localhost:"+PORT);
})