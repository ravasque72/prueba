const express = require('express');
const app = express();
const {WebhookClient} = require('dialogflow-fulfillment');
const axios=require("axios");
 
app.get('/', function (req, res) {
  res.send('Hello World RDV 3000');
});

app.post('/webhook', express.json(), function (req, res) {
  const agent = new WebhookClient({ request: req, response: res });


  function CrearRegistro(agent){
    let Cedula=agent.parameters["Cedula"];
    let Nombres=agent.parameters["Nombres"];
    let EPS=agent.parameters["EPS"];
    let Comentario=agent.parameters["Comentario"];
    let Celular=agent.parameters["Celular"];
    let today=new Date();
    let day = today.getDate();
	let month = today.getMonth()+1;
	let year = today.getFullYear();
    let Fecha=+day+"-"+month+"-"+year;
	let NroSeguimiento=Math.floor((Math.random() * 9999) + 1000);
    let Estado="PENDIENTE";
    axios.post("https://sheet.best/api/sheets/ce6d7a44-a862-4e16-b392-901a2625c0f4",{Nombres,Cedula,EPS,Comentario,Celular,Fecha,NroSeguimiento,Estado});
    agent.add(Nombres+" Tu solicitud ha sido registrada exitosamente ...");
  }
 
    async function ConsultarRegistro(agent) {
    let NroSeguimiento=agent.parameters["NroSeguimiento"];
    let respuesta=await axios.get("https://sheet.best/api/sheets/ce6d7a44-a862-4e16-b392-901a2625c0f4/NroSeguimiento/"+NroSeguimiento);
    let tramites=respuesta.data;
    if(tramites.length>0) {
        let tramite=tramites[0];
          agent.add("El estado de su solicitud es: "+tramite.Estado+" .la solicitud fue realizada por: "+tramite.Nombres+" con número de contacto :"+tramite.Celular);
    } else {
        agent.add("Lo sentimos no encontramos ningún caso con ese Número, verifica he intenta nuevamente.");
    }
 }




  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function ProbandoWebhook(agent) {
    agent.add(`Conectado ... Webhook !!!`);
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('ProbandoWebhook', ProbandoWebhook);
  intentMap.set("CrearRegistro", CrearRegistro);
  intentMap.set('ConsultarRegistro', ConsultarRegistro);
  
  agent.handleRequest(intentMap);
});

 
app.listen(3000, ()=> {
console.log (" Servidor web OK")
});