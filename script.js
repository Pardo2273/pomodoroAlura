//obteniendo elementos del DOM
const html = document.querySelector('html');

const botonCorto = document.querySelector('.app__card-button--corto');
const botonEnfonque = document.querySelector('.app__card-button--enfoque');
const botonLargo = document.querySelector('.app__card-button--largo');

const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');

const botones = document.querySelectorAll('.app__card-button');

const inputEnfoqueMusica = document.querySelector('#alternar-musica');
const musica = new Audio('./sonidos/luna-rise-part-one.mp3');

const botonIniciarPausar = document.querySelector('#start-pause');
const textoIniciarPausar = document.querySelector('#start-pause span');
const imagenIniciarPausar = document.querySelector('.app__card-primary-butto-icon');
const tiempoEnPantalla = document.querySelector('#timer');

let tiempoTranscurridoEnSegundos = 5; //1500;//igual a 25 minutos
let idIntervalo = null;

const musicaTiempoInicio = new Audio('./sonidos/play.wav');
const musicaTiempoPausa = new Audio('./sonidos/pause.mp3');
const musicaTiempoFinalizado = new Audio('./sonidos/beep.mp3');

//para que se repita la musica hasta que el usuario desee
musica.loop = true; 

//evento para el checkbox para activar o desactivar la musica
inputEnfoqueMusica.addEventListener('change', () => {
    if(musica.paused){
        musica.play();
    }else{
        musica.pause();
    }
});

//anadiendo los eventos para cambiar el color del fondo
botonCorto.addEventListener('click', () => {
    tiempoTranscurridoEnSegundos = 300; //300 segundos = 5 minutos
    cambiarContexto('descanso-corto');
    botonCorto.classList.add('active');
});

botonEnfonque.addEventListener('click', () => {
    tiempoTranscurridoEnSegundos = 1500; // 1500 segunods = 25 minutos
    cambiarContexto('enfoque');
    botonEnfonque.classList.add('active');
});

botonLargo.addEventListener('click', () => {
    tiempoTranscurridoEnSegundos = 900; //900 segundos = 15 minutos
    cambiarContexto('descanso-largo');
    botonLargo.classList.add('active');
});


function cambiarContexto(contexto){

    //para que salga el tiempo adecuado segun el boton que se optima..
    mostrarTiempo();

    //limpia la clase de los otros botones que no han sido clicados
    botones.forEach(function(contexto) {
        contexto.classList.remove('active');
    });

    //setAttribute se utiliza para definir o modificar el valor de un atributo en un elemento HTML
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `./imagenes/${contexto}.png`);
    
    switch(contexto){
        case "enfoque":
            titulo.innerHTML = `
            Optimiza tu productividad,<br>
            <strong class="app__title-strong">sumérgete en lo que importa.</strong>
                `
            break;
        case "descanso-corto":
            titulo.innerHTML = `
            ¿Qué tal tomar un respiro?<br>
            <strong class="app__title-strong">¡Haz una pausa corta!</strong>
            `
            break;
        case "descanso-largo":
            titulo.innerHTML = `
            Hora de volver a la superficie,<br>
            <strong class="app__title-strong">Haz una pausa larga.</strong>
            `
            break;
    }
}

const cuentaRegresiva = () => {
    if(tiempoTranscurridoEnSegundos <= 0){
        musicaTiempoFinalizado.play();
        alert('Tiempo Final');
        
        //generamos evento para sincronizar el tiempo con la conclusion de la tarea.
        const enfoqueActivo = html.getAttribute("data-contexto") == "enfoque"; //esto se guarda como boolean
        if(enfoqueActivo){
            //broadcast event
            const evento = new CustomEvent("EnfoqueFinalizado");//generamos evento
            document.dispatchEvent(evento);//lo disparamos

        }

        reiniciar();
        return; //este return sin nada es para interrumpir el tiempo de la operacion
    }

    textoIniciarPausar.textContent = "Pausar";
    imagenIniciarPausar.setAttribute('src', './imagenes/pause.png');

    tiempoTranscurridoEnSegundos -= 1;
    mostrarTiempo();
}

botonIniciarPausar.addEventListener('click', iniciarPausar);

function iniciarPausar(){
    if(idIntervalo){//esta parte es por si le doy pausa (click en el mismo boton va a pausar el decremento)
        musicaTiempoPausa.play();
        reiniciar();
        return;
    }
    musicaTiempoInicio.play();
    //setInterval establece el intervalo en que determinada cosa va a ocurrir, en este caso la cuenta regresiva, 
    //y hay que decir de cuanto es el intervalo, en este caso 1 segundo (1000 milisegundos)
    idIntervalo = setInterval(cuentaRegresiva, 1000);
}

function reiniciar(){
    //clearInterval interrumple el flujo de ese interval
    clearInterval(idIntervalo);
    idIntervalo = null;
    textoIniciarPausar.textContent = 'Comenzar';
    imagenIniciarPausar.setAttribute('src', './imagenes/play_arrow.png');
}

// innerHtml agrega texto y etiquetas html (con template string lo interpreta segun corresponda entre html y texto)
// textContent agrega solo texto (comprende todo como texto)

function mostrarTiempo(){
    //este objeto date es empleado para usar fechas y horas
    //la hora siempre se pasa en miles de segundos (pasar de segundos a miles de segundos se multiplica x 1000)
    const tiempo = new Date(tiempoTranscurridoEnSegundos * 1000);
    const tiempoFormateado = tiempo.toLocaleTimeString('es-CR', {minute:'2-digit', second:'2-digit'}); 
    tiempoEnPantalla.innerHTML = `${tiempoFormateado}`;
}

mostrarTiempo();//se llama para que el tiempo siempre apareza en pantalla

// más funcionalidades y soporte para diferentes formatos de zonas horarias, una buena alternativa es utilizar bibliotecas de manipulación de fechas, como Moment.js o date-fns.