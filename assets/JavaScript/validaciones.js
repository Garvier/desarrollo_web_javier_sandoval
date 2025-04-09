// Obtener elementos del DOM
const validationListElem = document.getElementById("validationList");
const validationMessageElem = document.getElementById("validationMessage");
const validationBox = document.getElementById("validationBox");
const myForm = document.getElementById("informarLugar");

let photoInputs = [];
let currentPhotoCount = 0;
const maxPhotos = 5;


myForm.addEventListener("submit", function(event) {
    event.preventDefault();
    validateForm();
});


function addPhotoInput() {
    if (currentPhotoCount >= maxPhotos) {
        alert("No puedes agregar más de 5 fotos");
        return;
    }
    
    const newInput = document.createElement("input");
    newInput.type = "file";
    newInput.name = "imagen[]";
    newInput.accept = ".jpg,.jpeg,.png";
    newInput.required = currentPhotoCount === 0;
    
    const container = document.getElementById("photoContainer");
    container.appendChild(newInput);
    container.appendChild(document.createElement("br"));
    
    photoInputs.push(newInput);
    currentPhotoCount++;
    

    document.getElementById("photoCounter").textContent = `(${currentPhotoCount}/${maxPhotos})`;
}

// Inicializar el primer input de foto
document.addEventListener("DOMContentLoaded", function() {
    const firstPhotoInput = document.getElementById("imagen");
    photoInputs.push(firstPhotoInput);
    currentPhotoCount = 1;
    
    // Agregar contador de fotos
    const counter = document.createElement("span");
    counter.id = "photoCounter";
    counter.textContent = `(1/${maxPhotos})`;
    firstPhotoInput.insertAdjacentElement("afterend", counter);
});

document.getElementById("tema").addEventListener("change", function() {
    const otroContainer = document.getElementById("otroTemaContainer");
    const selectedOptions = Array.from(this.selectedOptions).map(option => option.value);
    otroContainer.style.display = selectedOptions.includes("otro") ? "block" : "none";
    
    // Si "otro" está seleccionado, hacer el campo
    const otroInput = document.getElementById("otroTemaInput");
    otroInput.required = selectedOptions.includes("otro");
});

document.getElementById('contactar').addEventListener('change', function() {
    const selectedOptions = Array.from(this.selectedOptions).map(opt => opt.value);
    const container = document.getElementById('contactarInputsContainer');
    
    container.innerHTML = '';
    
    selectedOptions.forEach(option => {
        const inputGroup = document.createElement('div');
        inputGroup.style.marginBottom = '10px';
        
        const label = document.createElement('label');
        label.textContent = `ID/URL de ${option}: `;
        label.style.display = 'block';
        label.style.marginBottom = '5px';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.name = `contactar_${option}`;
        input.minLength = 4;
        input.maxLength = 50;
        input.required = true;
        input.style.width = '100%';
        input.style.padding = '8px';
        
        inputGroup.appendChild(label);
        inputGroup.appendChild(input);
        container.appendChild(inputGroup);
    });
});

const validationRegion = () => {
    const regionSelect = document.getElementById("region");
    return regionSelect.value !== "";
}

const validationComuna = () => {
    const comunaSelect = document.getElementById("comuna");
    return comunaSelect.value !== "";
}

const validateSector = (sector) => {
    return sector.length <= 100;
}

const validateName = (nombre) => {
    return nombre && nombre.length <= 200;
}

const validateEmail = (email) => {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.length <= 100 && re.test(email);
}

const validatePhone = (telefono) => {
    if (!telefono) return true; // Opcional
    const re = /^\+\d{3}\.\d{8}$/;
    return re.test(telefono.trim());
}

const validateContacto = () => {
    const contactarSelect = document.getElementById('contactar');
    const selectedOptions = Array.from(contactarSelect.selectedOptions).map(opt => opt.value);
    
    if (selectedOptions.length > 5) {
        return false;
    }
    

    for (const option of selectedOptions) {
        const input = document.querySelector(`input[name="contactar_${option}"]`);
        if (!input || input.value.length < 4 || input.value.length > 50) {
            return false;
        }
    }
    
    return true;
}

const validateFechaInicio = (dia_hora_inicio) => {
    if (!dia_hora_inicio) return false;
    const fecha = new Date(dia_hora_inicio);
    return fecha > new Date();
}

const validateFechaTermino = (dia_hora_inicio, dia_hora_termino) => {
    if (!dia_hora_termino) return true; // Opcional
    const fechaInicio = new Date(dia_hora_inicio);
    const fechaTermino = new Date(dia_hora_termino);
    return fechaTermino > fechaInicio;
}

const validateDescripcion = (descripcion) => {
    if (!descripcion) return true; // Opcional
    return descripcion.length <= 500;
}

const validateTema = () => {
    const temas = document.getElementById("tema");
    const selectedOptions = Array.from(temas.selectedOptions).map(option => option.value);
    
    // Validar que se haya seleccionado al menos un tema
    if (selectedOptions.length === 0) {
        return false;
    }
    
    // Validar campo "otro" si está seleccionado
    if (selectedOptions.includes("otro")) {
        const otroTema = document.getElementById("otroTemaInput").value;
        if (!otroTema || otroTema.length < 3 || otroTema.length > 15) {
            return false;
        }
    }
    
    return true;
}
const validatePhotos = () => {
    let hasAtLeastOne = false;
    
    for (const input of photoInputs) {
        if (input.files && input.files.length > 0) {
            hasAtLeastOne = true;
            
            // Validar formato de archivo
            const file = input.files[0];
            const validExtensions = [".jpg", ".jpeg", ".png"];
            const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
            
            if (!validExtensions.includes(extension)) {
                return false;
            }
        }
    }
    
    return hasAtLeastOne && currentPhotoCount <= maxPhotos;
}

const validateForm = () => {
    // Obtener elementos
    const region = document.getElementById("region");
    const comuna = document.getElementById("comuna");
    const sector = document.getElementById("sector");
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const telefono = document.getElementById("telefono");
    const contactar = document.getElementById("contactar");
    const dia_hora_inicio = document.getElementById("dia_hora_inicio");
    const dia_hora_termino = document.getElementById("dia_hora_termino");
    const descripcion = document.getElementById("actividad");
    const tema = document.getElementById("tema");

    // validar 
    let invalidInputs = [];
    
    if (!validationRegion()) invalidInputs.push("Región");
    if (!validationComuna()) invalidInputs.push("Comuna");
    if (!validateSector(sector.value)) invalidInputs.push("Sector");
    if (!validateName(nombre.value)) invalidInputs.push("Nombre");
    if (!validateEmail(email.value)) invalidInputs.push("Email");
    if (!validatePhone(telefono.value)) invalidInputs.push("Teléfono");
    if (!validateContacto(contactar.value)) invalidInputs.push("Contactar");
    if (!validateFechaInicio(dia_hora_inicio.value)) invalidInputs.push("Fecha inicio");
    if (!validateFechaTermino(dia_hora_inicio.value, dia_hora_termino.value)) invalidInputs.push("Fecha término");
    if (!validateDescripcion(descripcion.value)) invalidInputs.push("Descripción");
    if (!validateTema()) invalidInputs.push("Tema");
    if (!validatePhotos()) invalidInputs.push("Fotos");

    if (invalidInputs.length > 0) {
        validationListElem.innerHTML = invalidInputs.map(input => `<li>${input}</li>`).join("");
        validationMessageElem.textContent = "Los siguientes campos son inválidos:";
        validationBox.style.display = "block";
        validationBox.style.backgroundColor = "#ffdddd";
        validationBox.style.border = "1px solid #f44336";
        return;
    }

    showConfirmation();
}

function showConfirmation() {

    myForm.style.display = "none";
    
    //mensaje de confirmación
    validationBox.innerHTML = `
        <p>¿Está seguro que desea agregar esta actividad?</p>
        <div style="margin-top: 20px;">
            <button id="confirmYes" style="margin-right: 10px; padding: 8px 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Sí, estoy seguro
            </button>
            <button id="confirmNo" style="padding: 8px 15px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
                No, quiero volver al formulario
            </button>
        </div>
    `;
    
    validationBox.style.display = "block";
    validationBox.style.backgroundColor = "#ddffdd";
    validationBox.style.border = "1px solid #4CAF50";
    validationBox.style.padding = "20px";
    
    // Manejar eventos de los botones
    document.getElementById("confirmYes").addEventListener("click", function() {
        validationBox.innerHTML = `
            <p>Hemos recibido su información, muchas gracias y suerte en su actividad</p>
            <button id="returnHome" style="margin-top: 20px; padding: 8px 15px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Volver a la portada
            </button>
        `;
        
        document.getElementById("returnHome").addEventListener("click", function() {
            window.location.href = "portada.html";
        });
    });
    
    document.getElementById("confirmNo").addEventListener("click", function() {
        myForm.style.display = "block";
        validationBox.style.display = "none";
    });
}