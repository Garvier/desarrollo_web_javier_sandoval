from flask import Flask, request, render_template, redirect, url_for, session, flash
import utils.plots as val
from database import db
from werkzeug.utils import secure_filename
import hashlib
import filetype
import os
import uuid
from datetime import datetime

from utils.plots import *


UPLOAD_FOLDER = 'static/uploads'
GRAFICOS_FOLDER = 'static/graficos'
app = Flask(__name__)
app.secret_key = "secret_key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 100

# --- Auth routes ---

@app.route("/")
def portada():
    ultimas = db.show_five_actividades()
    return render_template("portada.html", actividades=ultimas)

@app.route("/informar", methods=["GET", "POST"])
def informar():
    regiones = db.get_regiones()
    region_id = request.form.get("region") or request.args.get("region")
    comunas = db.get_comunas_by_region(region_id) if region_id else []
    temas = list(db.TemaEnum)
    contactos = list(db.ContactoEnum)

    if request.method == "POST":
        try:
            comuna = int(request.form.get("comuna"))
            nombre = request.form.get("nombre")
            email = request.form.get("email")
            celular = request.form.get("celular")
            descripcion = request.form.get("descripcion")
            fecha_inicio_str = request.form.get("dia_hora_inicio")
            fecha_termino_str = request.form.get("dia_hora_termino")

            if not all([comuna, nombre, email, fecha_inicio_str]):
                flash("Por favor, completa todos los campos obligatorios.")
                raise ValueError("Faltan campos obligatorios.")

            fecha_inicio = datetime.strptime(fecha_inicio_str, "%Y-%m-%dT%H:%M")
            fecha_termino = datetime.strptime(fecha_termino_str, "%Y-%m-%dT%H:%M") if fecha_termino_str else None

            actividad = db.create_actividad(
                comuna_id=comuna,
                sector=request.form.get("sector"),
                nombre=nombre,
                email=email,
                celular=celular,
                dia_hora_inicio=fecha_inicio,
                dia_hora_termino=fecha_termino,
                descripcion=descripcion
            )

            # Temas
            for tema in request.form.getlist("temas"):
                glosa = request.form.get("glosa_otro") if tema == "otro" else None
                db.add_tema_a_actividad(actividad.id, tema, glosa)

            # Contactos
            for c in request.form.getlist("contactos"):
                identificador = request.form.get(f"contactar_{c}")
                if identificador:
                    db.add_contacto_a_actividad(actividad.id, c, identificador)

            # Fotos
            for archivo in request.files.getlist("fotos"):
                if archivo and archivo.filename:
                    extension = os.path.splitext(archivo.filename)[1]
                    nombre_archivo = f"{uuid.uuid4().hex}{extension}"
                    ruta_archivo = os.path.join(app.config['UPLOAD_FOLDER'], nombre_archivo)
                    archivo.save(ruta_archivo)
                    db.add_foto_a_actividad(actividad.id, f"uploads/{nombre_archivo}", nombre_archivo)

            flash("Actividad registrada exitosamente.")
            return redirect(url_for("portada"))

        except Exception as e:
            flash(f"Error al procesar la información: {e}")

    return render_template("informarActividad.html",
                           regiones=regiones,
                           comunas=comunas,
                           region_seleccionada=region_id,
                           temas=temas,
                           contactos=contactos)





@app.route("/listado", methods=["GET"])
def listado():
    actividades = db.show_all_actividades()
    return render_template("listado.html", actividades=actividades)


@app.route("/estadisticas", methods=["GET"])
def estadisticas():
    #eliminar graficos actuales
    for file in os.listdir(GRAFICOS_FOLDER):
        if file.endswith(".png"):
            os.remove(os.path.join(GRAFICOS_FOLDER, file))

    #generar graficos

    graficar_actividades_por_fecha(os.path.join(GRAFICOS_FOLDER, "actividades_por_fecha.png"))
    graficar_actividades_por_tipo(os.path.join(GRAFICOS_FOLDER, "actividades_por_tipo.png"))
    graficar_actividades_por_hora(os.path.join(GRAFICOS_FOLDER, "actividades_por_hora.png"))

    paths = {
        "actividades_por_fecha": "graficos/actividades_por_fecha.png",
        "actividades_por_tipo": "graficos/actividades_por_tipo.png",
        "actividades_por_hora": "graficos/actividades_por_hora.png"
    }
    return render_template("estadisticas.html", paths=paths)



# --- apis ---

from flask import jsonify

@app.route("/api/comunas")
def api_comunas():
    region_id = request.args.get("region_id")
    if not region_id:
        return jsonify([])

    comunas = db.get_comunas_by_region(region_id)
    return jsonify([{"id": c.id, "nombre": c.nombre} for c in comunas])
