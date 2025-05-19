import matplotlib.pyplot as plt
import numpy as np
from database.db import *
from datetime import datetime


#grafico 1: fecha vs cantidad de actividades

def graficar_actividades_por_fecha(path):
    actividades = get_actividades()
    fechas = [actividad.dia_hora_inicio for actividad in actividades]
    fechas = [fecha.date() for fecha in fechas]
    fechas = list(set(fechas))
    fechas.sort()
    cantidad_actividades = [0] * len(fechas)
    for actividad in actividades:
        fecha = actividad.dia_hora_inicio.date()
        cantidad_actividades[fechas.index(fecha)] += 1

    plt.plot(fechas, cantidad_actividades, marker='o')
    plt.xlabel('Fecha')
    plt.ylabel('Cantidad de actividades')
    plt.title('Cantidad de actividades por fecha')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(path)
    plt.close()

# grafico 2: grafico de pastel de actividades por tipo
def graficar_actividades_por_tipo(path):
    actividades = get_actividades()

    conteo_temas = {}

    for actividad in actividades:
        temas = get_temas_by_actividad(actividad.id)
        for tema in temas:
            clave = tema.tema.value
            if clave in conteo_temas:
                conteo_temas[clave] += 1
            else:
                conteo_temas[clave] = 1

    etiquetas = list(conteo_temas.keys())
    cantidades = list(conteo_temas.values())

    plt.figure(figsize=(6,6))
    plt.pie(cantidades, labels=etiquetas, autopct='%1.1f%%', startangle=90)
    plt.title('Distribución de temas en actividades')
    plt.axis('equal')
    plt.tight_layout()
    plt.savefig(path)
    plt.close()



# grafico 3: grafico de barras (tres barras por punto en X) meses vs cantidad de actividades en la mañana mediodia y tarde

def graficar_actividades_por_hora(path):
    actividades = get_actividades()

    meses = [datetime(2025, m, 1).strftime('%B') for m in range(1, 13)]
    data = {mes: {"mañana": 0, "mediodía": 0, "tarde": 0} for mes in meses}

    for act in actividades:
        dt = act.dia_hora_inicio
        mes = dt.strftime('%B')
        hora = dt.hour
        if 0 <= hora < 11:
            data[mes]["mañana"] += 1
        elif 11 <= hora < 15:
            data[mes]["mediodía"] += 1
        elif 15 <= hora <= 24:
            data[mes]["tarde"] += 1

    x = np.arange(len(meses))
    width = 0.25

    manana = [data[mes]["mañana"] for mes in meses]
    medio = [data[mes]["mediodía"] for mes in meses]
    tarde = [data[mes]["tarde"] for mes in meses]

    plt.bar(x - width, manana, width=width, label="Mañana")
    plt.bar(x, medio, width=width, label="Mediodía")
    plt.bar(x + width, tarde, width=width, label="Tarde")

    plt.xticks(x, meses, rotation=45)
    plt.ylabel("Cantidad")
    plt.title("Actividades por franja horaria y mes")
    plt.legend()
    plt.tight_layout()
    plt.savefig(path)
    plt.close()


