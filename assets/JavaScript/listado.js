
const actividades = [
    {
        id: 1,
        inicio: "2025-03-28 12:00",
        termino: "2025-03-28 14:00",
        comuna: "Santiago",
        sector: "Beauchef 850, terraza",
        tema: "Escuela de Boxeo",
        fotos: ["boxeo1.jpg", "boxeo2.jpg"],
        descripcion: "Clases de boxeo para principiantes e intermedios. Traer guantes y ropa cómoda.",
        organizador: "Juan Pérez",
        email: "juan@boxeo.cl",
        contacto: "+569.12345678"
    },
    {
        id: 2,
        inicio: "2025-03-29 19:00",
        termino: "2025-03-29 20:00",
        comuna: "Ñuñoa",
        sector: "Plaza",
        tema: "Cómo deshidratar fruta",
        fotos: ["fruta1.jpg"],
        descripcion: "Taller práctico de deshidratación de frutas. Aprende a conservar frutas de temporada.",
        organizador: "María González",
        email: "maria@frutas.cl",
        contacto: "+569.87654321"
    },
    {
        id: 3,
        inicio: "2025-03-30 18:00",
        termino: null,
        comuna: "Santiago",
        sector: "Parque O'higgins",
        tema: "Música urbana",
        fotos: ["musica1.jpg"],
        descripcion: "Concierto gratuito de bandas locales de música urbana.",
        organizador: "Colectivo Musical",
        email: "contacto@colectivomusical.cl",
        contacto: "+569.55555555"
    },
    {
        id: 4,
        inicio: "2025-04-05 10:00",
        termino: "2025-04-05 12:00",
        comuna: "Providencia",
        sector: "Biblioteca Municipal",
        tema: "Taller de programación",
        fotos: ["programacion1.jpg"],
        descripcion: "Introducción a la programación para niños de 8 a 12 años.",
        organizador: "Code for Kids",
        email: "info@codeforkids.cl",
        contacto: "+569.11112222"
    },
    {
        id: 5,
        inicio: "2025-04-10 17:00",
        termino: "2025-04-10 19:00",
        comuna: "Las Condes",
        sector: "Centro Comunitario",
        tema: "Yoga al aire libre",
        fotos: ["yoga1.jpg"],
        descripcion: "Sesión de yoga para todos los niveles. Traer tu propia esterilla.",
        organizador: "Yoga en el Barrio",
        email: "hola@yogaenelbarrio.cl",
        contacto: "+569.99998888"
    }
];

// Cargar datos en la tabla
document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('#activitiesTable tbody');
    
    actividades.forEach(actividad => {
        const row = document.createElement('tr');
        row.dataset.id = actividad.id;
        
        row.innerHTML = `
            <td>${actividad.inicio}</td>
            <td>${actividad.termino || '-'}</td>
            <td>${actividad.comuna}</td>
            <td>${actividad.sector}</td>
            <td>${actividad.tema}</td>
            <td>
                ${actividad.fotos.length > 0 ? 
                    `<img src="assets/img/${actividad.fotos[0]}" class="thumbnail" alt="${actividad.tema}">` : 
                    'Sin foto'}
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    const rows = document.querySelectorAll('#activitiesTable tbody tr');
    rows.forEach(row => {
        row.addEventListener('click', function() {
            const activityId = parseInt(this.dataset.id);
            showActivityDetails(activityId);
        });
    });
    
    setupModals();
});

// Mostrar detalles de la actividad
function showActivityDetails(activityId) {
    const actividad = actividades.find(a => a.id === activityId);
    if (!actividad) return;
    
    const modalContent = document.getElementById('modalContent');
    
    let photosHTML = '';
    if (actividad.fotos.length > 0) {
        photosHTML = `<div class="activity-photos">
            <h3>Fotos:</h3>
            <div class="photo-gallery">`;
        
        actividad.fotos.forEach((foto, index) => {
            photosHTML += `
                <img src="assets/img/${foto}" 
                     alt="Foto ${index + 1} de ${actividad.tema}" 
                     class="gallery-thumbnail"
                     onclick="expandImage('assets/img/${foto}', '${actividad.tema}')">
            `;
        });
        
        photosHTML += `</div></div>`;
    }
    
    modalContent.innerHTML = `
        <h2>${actividad.tema}</h2>
        <p><strong>Fecha y hora de inicio:</strong> ${actividad.inicio}</p>
        ${actividad.termino ? `<p><strong>Fecha y hora de término:</strong> ${actividad.termino}</p>` : ''}
        <p><strong>Comuna:</strong> ${actividad.comuna}</p>
        <p><strong>Sector:</strong> ${actividad.sector}</p>
        <p><strong>Descripción:</strong> ${actividad.descripcion}</p>
        <div class="organizer-info">
            <h3>Información del organizador:</h3>
            <p><strong>Nombre:</strong> ${actividad.organizador}</p>
            <p><strong>Email:</strong> ${actividad.email}</p>
            <p><strong>Contacto:</strong> ${actividad.contacto}</p>
        </div>
        ${photosHTML}
    `;
    
    document.getElementById('activityModal').style.display = 'block';
}


function setupModals() {
    // Modal de actividad
    const activityModal = document.getElementById('activityModal');
    const span = activityModal.querySelector('.close');
    
    span.onclick = function() {
        activityModal.style.display = 'none';
    }
    
    document.getElementById('backToList').onclick = function() {
        activityModal.style.display = 'none';
    }
    
    document.getElementById('backToHome').onclick = function() {
        window.location.href = 'portada.html';
    }
    
    // Modal de imagen
    const imageModal = document.getElementById('imageModal');
    const imgClose = imageModal.querySelector('.close');
    
    imgClose.onclick = function() {
        imageModal.style.display = 'none';
    }
    
    window.onclick = function(event) {
        if (event.target === activityModal) {
            activityModal.style.display = 'none';
        }
        if (event.target === imageModal) {
            imageModal.style.display = 'none';
        }
    }
}

// Expandir imagen
function expandImage(imgSrc, imgAlt) {
    const expandedImg = document.getElementById('expandedImg');
    const captionText = document.getElementById('imgCaption');
    
    expandedImg.src = imgSrc;
    expandedImg.alt = imgAlt;
    captionText.innerHTML = imgAlt;
    
    document.getElementById('imageModal').style.display = 'block';
}