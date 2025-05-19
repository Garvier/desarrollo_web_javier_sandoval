document.addEventListener("DOMContentLoaded", () => {
    const regionSelect = document.getElementById("region");
    const comunaSelect = document.getElementById("comuna");
    const temaSelect = document.getElementById("tema");
    const otroContainer = document.getElementById("otroTemaContainer");
    const otroInput = document.getElementById("otroTemaInput");
    const contactarSelect = document.getElementById('contactar');
    const contactarContainer = document.getElementById('contactarInputsContainer');
    const firstPhotoInput = document.getElementById("imagen");
    const myForm = document.getElementById("informarLugar");
    const validationListElem = document.getElementById("validationList");
    const validationMessageElem = document.getElementById("validationMessage");
    const validationBox = document.getElementById("validationBox");
    const confirmationBox = document.getElementById("confirmationBox");

    let photoInputs = [firstPhotoInput];
    let currentPhotoCount = 1;
    const maxPhotos = 5;

    let triggeredByUser = false;
    document.querySelector('input[type="submit"]').addEventListener('click', () => {
        triggeredByUser = true;
    });

    regionSelect.addEventListener("change", async () => {
        const regionId = regionSelect.value;
        if (!regionId) {
            comunaSelect.innerHTML = '<option value="">Selecciona una comuna</option>';
            comunaSelect.disabled = true;
            return;
        }
        try {
            const response = await fetch(`/api/comunas?region_id=${regionId}`);
            const comunas = await response.json();
            comunaSelect.innerHTML = '<option value="">Selecciona una comuna</option>';
            comunas.forEach(c => {
                const option = document.createElement("option");
                option.value = c.id;
                option.textContent = c.nombre;
                comunaSelect.appendChild(option);
            });
            comunaSelect.disabled = false;
        } catch (err) {
            console.error("Error al cargar comunas:", err);
        }
    });

    temaSelect.addEventListener("change", () => {
        const selectedOptions = Array.from(temaSelect.selectedOptions).map(o => o.value);
        otroContainer.style.display = selectedOptions.includes("otro") ? "block" : "none";
        otroInput.required = selectedOptions.includes("otro");
    });

    contactarSelect.addEventListener('change', () => {
        const selected = Array.from(contactarSelect.selectedOptions).map(opt => opt.value);
        contactarContainer.innerHTML = '';
        selected.forEach(option => {
            const group = document.createElement('div');
            group.style.marginBottom = '10px';
            const label = document.createElement('label');
            label.textContent = `ID/URL de ${option}: `;
            label.style.display = 'block';
            const input = document.createElement('input');
            input.type = 'text';
            input.name = `contactar_${option}`;
            input.minLength = 4;
            input.maxLength = 50;
            input.required = true;
            input.style.width = '100%';
            input.style.padding = '8px';
            group.appendChild(label);
            group.appendChild(input);
            contactarContainer.appendChild(group);
        });
    });

    const counter = document.createElement("span");
    counter.id = "photoCounter";
    counter.textContent = `(1/${maxPhotos})`;
    firstPhotoInput.insertAdjacentElement("afterend", counter);

    myForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!triggeredByUser) return;
        triggeredByUser = false;
        validateForm();
    });

    function validateForm() {
        validationBox.hidden = true;
        validationBox.style.display = "none";
        confirmationBox.hidden = true;
        confirmationBox.style.display = "none";
        validationListElem.innerHTML = "";
        validationMessageElem.textContent = "";

        const region = document.getElementById("region");
        const comuna = document.getElementById("comuna");
        const sector = document.getElementById("sector");
        const nombre = document.getElementById("nombre");
        const email = document.getElementById("email");
        const telefono = document.getElementById("telefono");
        const dia_hora_inicio = document.getElementById("dia_hora_inicio");
        const dia_hora_termino = document.getElementById("dia_hora_termino");
        const descripcion = document.getElementById("actividad");

        let invalidInputs = [];

        if (region.value === "") invalidInputs.push("Región");
        if (comuna.value === "") invalidInputs.push("Comuna");
        if (sector.value.length > 100) invalidInputs.push("Sector");
        if (!nombre.value || nombre.value.length > 200) invalidInputs.push("Nombre");
        if (!validateEmail(email.value)) invalidInputs.push("Email");
        if (!validatePhone(telefono.value)) invalidInputs.push("Teléfono");
        if (!validateContacto()) invalidInputs.push("Contactar");
        if (!validateFechaInicio(dia_hora_inicio.value)) invalidInputs.push("Fecha inicio");
        if (!validateFechaTermino(dia_hora_inicio.value, dia_hora_termino.value)) invalidInputs.push("Fecha término");
        if (descripcion.value && descripcion.value.length > 500) invalidInputs.push("Descripción");
        if (!validateTema()) invalidInputs.push("Tema");
        if (!validatePhotos()) invalidInputs.push("Fotos");


        if (invalidInputs.length > 0) {
            validationListElem.innerHTML = invalidInputs.map(i => `<li>${i}</li>`).join("");
            validationMessageElem.textContent = "Los siguientes campos son inválidos:";
            validationBox.hidden = false;
            validationBox.style.display = "block";
            return;
        }

        showConfirmation();
    }

    function showConfirmation() {
        myForm.style.display = "none";
        confirmationBox.hidden = false;
        confirmationBox.style.display = "block";

        const confirmYes = document.getElementById("confirmYes");
        const confirmNo = document.getElementById("confirmNo");

        confirmYes.replaceWith(confirmYes.cloneNode(true));
        confirmNo.replaceWith(confirmNo.cloneNode(true));

        document.getElementById("confirmYes").addEventListener("click", () => {
            myForm.submit();
        });

        document.getElementById("confirmNo").addEventListener("click", () => {
            myForm.style.display = "block";
            confirmationBox.hidden = true;
            confirmationBox.style.display = "none";
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email && email.length <= 100 && re.test(email);
    }

    function validatePhone(phone) {
        if (!phone) return true;
        return /^\+\d{3}\.\d{8}$/.test(phone.trim());
    }

    function validateContacto() {
        const selected = Array.from(contactarSelect.selectedOptions).map(opt => opt.value);
        if (selected.length > 5) return false;
        return selected.every(option => {
            const input = document.querySelector(`input[name="contactar_${option}"]`);
            return input && input.value.length >= 4 && input.value.length <= 50;
        });
    }

    function validateFechaInicio(fechaStr) {
        if (!fechaStr) return false;
        return new Date(fechaStr) > new Date();
    }

    function validateFechaTermino(inicioStr, finStr) {
        if (!finStr) return true;
        return new Date(finStr) > new Date(inicioStr);
    }

    function validateTema() {
        const selected = Array.from(temaSelect.selectedOptions).map(o => o.value);
        if (selected.length === 0) return false;
        if (selected.includes("otro")) {
            return otroInput.value.length >= 3 && otroInput.value.length <= 15;
        }
        return true;
    }

    function validatePhotos() {
        let hasPhoto = false;
        for (const input of photoInputs) {
            if (input.files && input.files.length > 0) {
                hasPhoto = true;
                const file = input.files[0];
                const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
                if (![".jpg", ".jpeg", ".png"].includes(ext)) return false;
            }
        }
        return hasPhoto && currentPhotoCount <= maxPhotos;
    }
});
