let tarea = document.getElementById('tarea');
let lista = document.getElementById('la_lista');
let totalTareasSpan = document.getElementById('li_tarea');
let tareasCompletadasSpan = document.getElementById('li_completada');
let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

//Para el contador de tareas del nav
const actualizarContador = () => {
    totalTareasSpan.innerText = `Total: ${tareas.length}`;
    let completadas = tareas.filter(tarea => tarea.completada).length;
    tareasCompletadasSpan.innerText = `Completadas: ${completadas}`;
};


const cargarTareas = () => {
    lista.innerHTML = '';
    tareas.forEach((tarea, index) => {
        // Aqui llamo a la funcion que creé en la siguiente linea
        crearTarea(tarea.texto, tarea.completada, index);
    });
    actualizarContador();
};

// por defecto el false en completada ya que la tarea no esta realizada cuando se añade,tambien agrego un ternario para agregar o no la clase de bootstrap text-decoration-line-through
const crearTarea = (texto, completada = false, index) => {
    let item_lista = document.createElement('li');
    item_lista.classList = 'list-group-item d-flex flex-column flex-sm-row align-items-center justify-content-between my-3 bg-dark-subtle fw-bolder shadow rounded-2 py-3';

    item_lista.innerHTML = `
        <div class="d-flex align-items-center mb-2 mb-sm-0">
            <input type="checkbox" ${completada ? 'checked' : ''} class="form-check-input me-3" onchange="marcarCheckbox(${index})">
        </div>
        <div class="flex-grow-1 text-center tarea-texto ${completada ? 'text-decoration-line-through' : ''}">${texto}</div>
        <div class="d-flex justify-content-center justify-content-sm-end mt-2 mt-sm-0">
            <button class="btn btn-sm btn-success mx-2" onclick="actualizarTarea(${index})"><i class="bi bi-pencil-fill"></i></button>
            <button class="btn btn-sm btn-danger" onclick="eliminarTarea(${index})"><i class="bi bi-trash3-fill"></i></button>
        </div>
    `;

    lista.appendChild(item_lista);
};





const agregarTarea = (event) => {
    event.preventDefault();
    let nueva_tarea = tarea.value;
    // el condicional para no agregar lista vacía
    if (nueva_tarea.trim() === '') return; 

    tareas.push({ texto: nueva_tarea, completada: false });
    localStorage.setItem('tareas', JSON.stringify(tareas));
    document.querySelector('form').reset();
    tarea.focus();

    crearTarea(nueva_tarea, false, tareas.length - 1);
    actualizarContador();
};


const eliminarTarea = (index) => {
    tareas.splice(index, 1);
    localStorage.setItem('tareas', JSON.stringify(tareas));
    cargarTareas();
};


const actualizarTarea = (index) => {
    Swal.fire({
        title: 'Editar tarea',
        input: 'text',
        inputLabel: 'Modifica la tarea:',
        inputValue: tareas[index].texto,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value.trim()) {
                return '¡El campo no puede estar vacío!';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            tareas[index].texto = result.value;
            localStorage.setItem('tareas', JSON.stringify(tareas));
            cargarTareas();
            Swal.fire('¡Tarea actualizada!', '', 'success');
        }
    });
};

// Función para marcar como completada o desmarcar
const marcarCheckbox = (index) => {
    tareas[index].completada = !tareas[index].completada;
    localStorage.setItem('tareas', JSON.stringify(tareas));
    cargarTareas();
    actualizarContador();
};


cargarTareas();
