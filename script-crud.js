const btnAgregarTarea = document.querySelector('.app__button--add-task');
const formAgregarTarea = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');
const ulTareas = document.querySelector('.app__section-task-list');
const pDescTarea = document.querySelector('.app__section-active-task-description');
const removerConcluidasBtn = document.getElementById('btn-remover-concluidas');
const removerTodasBtn = document.getElementById('btn-remover-todas');

//JSON tiene dos metodos principales: 
//stringify - Convertir un parametro a string. 
//parse - Convertir un string a un array u objeto.

//en caso de que lo primero sea nulo o indefinido se le da el valor de un arreglo vacio
let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
let tareaSeleccionada = null;
let liTareaSeleccionada = null;
//console.log(tareas);

function actualizarTareas() {
    //recordar que el localStorage es llave:valor, por lo que el primer nombre es la llave de referencia y el segundo el valor como tal 
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

function crearElementoTarea(tarea) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>         
    `;

    const parrafoDesc = document.createElement('p');
    parrafoDesc.classList.add('app__section-task-list-item-description');
    parrafoDesc.innerText = tarea.descripcion;

    const btn = document.createElement('button');
    btn.classList.add("app_button-edit");

    //ya que tenemos la referencia agregamos el siguiente evento para editar
    btn.addEventListener('click', () => {
        //debug -> debuguear/depurar
        // debugger //con esta palabra es posible crear un punto de interrupcion para depurar el codigo 
        const nuevaDescripcion = prompt('¿Cuál es la nueva tarea?');

        //la siguiente condicion es lo mismo a hacer que nuevaDescripcion sea !== null, undefined y ""
        if (nuevaDescripcion) {
            parrafoDesc.innerText = nuevaDescripcion;

            tarea.descripcion = nuevaDescripcion;

            actualizarTareas();
        } else {
            alert("Actualización cancelada o valor inválido");
        }
    });

    const img = document.createElement('img');
    img.src = './imagenes/edit.png';

    li.appendChild(svg);
    li.appendChild(parrafoDesc);
    btn.appendChild(img);
    li.appendChild(btn);

    if (tarea.complete) {
        li.classList.add("app__section-task-list-item-complete");
        btn.setAttribute('disabled', 'disabled');
    } else {
        //para cuando le damos click a todo el li se vea en el parrafo la descripcion..
        li.onclick = () => {

            const elementos = document.querySelectorAll('.app__section-task-list-item-active');
            elementos.forEach((elemento) => {//elimina la clase 
                elemento.classList.remove("app__section-task-list-item-active");
            });

            //para cuando le doy click de nuevo se deseleccione la tarea
            if (tareaSeleccionada == tarea) {
                pDescTarea.textContent = "";
                tareaSeleccionada = null;
                liTareaSeleccionada = null;
                //early return
                return;
            }

            tareaSeleccionada = tarea; //este es el objeto..
            liTareaSeleccionada = li; //este el elemento li como tal
            //console.log(tareaSeleccionada);

            //le brinda la clase solo al que le dan click..
            pDescTarea.textContent = tarea.descripcion;
            li.classList.add("app__section-task-list-item-active");
        }
    }
    return li;
}

btnAgregarTarea.addEventListener('click', function () {
    //la funcion toggle lo que hace es que en este caso si la clase esta en el classlist la quita y sino la pone
    formAgregarTarea.classList.toggle('hidden');
});

formAgregarTarea.addEventListener('submit', function (e) {
    e.preventDefault();

    const tarea = {
        descripcion: textArea.value,
    }

    tareas.push(tarea);

    //para que una vez creada se muestre la tarea
    const elementoTarea = crearElementoTarea(tarea);
    ulTareas.appendChild(elementoTarea);

    textArea.value = '';//para limpiar

    formAgregarTarea.classList.add('hidden');

    actualizarTareas();
});

tareas.forEach((tarea) => {
    const elementoTarea = crearElementoTarea(tarea);
    ulTareas.appendChild(elementoTarea);
});

document.addEventListener("EnfoqueFinalizado", () => {
    if (tareaSeleccionada && liTareaSeleccionada) {
        liTareaSeleccionada.classList.add("app__section-task-list-item-complete");
        liTareaSeleccionada.classList.remove("app__section-task-list-item-active");
        liTareaSeleccionada.querySelector('button').setAttribute('disabled', 'disabled');

        //recordar que es un objeto y le agregamos el siguiente atributo ya que se completo..
        tareaSeleccionada.complete = true;
        actualizarTareas();
    }
});


const eliminarTareas = (soloConcluidas) => {
    
    const selector = soloConcluidas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";
    const elementos = document.querySelectorAll(selector);

    elementos.forEach((elemento) => {
        //console.log(elemento);
        elemento.remove();
    });

    tareas = soloConcluidas ? tareas.filter(tarea => !tarea.complete) : [];
    actualizarTareas();
}

removerConcluidasBtn.onclick = () => eliminarTareas(true);
removerTodasBtn.onclick = () => eliminarTareas(false);
