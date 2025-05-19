
from sqlalchemy import create_engine, Column, Integer, DateTime, String, ForeignKey, Enum
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
import enum

DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()


# --- Enums ---

class TemaEnum(enum.Enum):
    musica = "musica"
    deporte = "deporte"
    ciencias = "ciencias"
    religión = "religión"
    politica = "politica"
    tecnologia = "tecnologia"
    juegos = "juegos"
    baile = "baile"
    comida = "comida"
    otro = "otro"

class ContactoEnum(enum.Enum):
    whatsapp = "whatsapp"
    telegram = "telegram"
    x = "X"
    instagram = "instagram"
    tiktok = "tiktok"
    otra = "otra"


# --- Models ---
class Region(Base):
    __tablename__ = 'region'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    comunas = relationship("Comuna", back_populates="region")

class Comuna(Base):
    __tablename__ = 'comuna'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey("region.id"), nullable=False)
    region = relationship("Region", back_populates="comunas")
    actividades = relationship("Actividad", back_populates="comuna")

class Actividad(Base):
    __tablename__ = 'actividad'

    id = Column(Integer, primary_key=True, autoincrement=True)
    comuna_id = Column(Integer, ForeignKey("comuna.id"), nullable=False)
    sector = Column(String(100))
    nombre = Column(String(200), nullable=False)
    email = Column(String(100), nullable=False)
    celular = Column(String(15))
    dia_hora_inicio = Column(DateTime, nullable=False)
    dia_hora_termino = Column(DateTime)
    descripcion = Column(String(500))

    comuna = relationship("Comuna", back_populates="actividades")
    temas = relationship("ActividadTema", back_populates="actividad", cascade="all, delete")
    fotos = relationship("Foto", back_populates="actividad", cascade="all, delete")
    contactos = relationship("ContactarPor", back_populates="actividad", cascade="all, delete")

class ActividadTema(Base):
    __tablename__ = 'actividad_tema'

    id = Column(Integer, primary_key=True, autoincrement=True)
    actividad_id = Column(Integer, ForeignKey("actividad.id"), nullable=False)
    tema = Column(Enum(TemaEnum), nullable=False)
    glosa_otro = Column(String(15))

    actividad = relationship("Actividad", back_populates="temas")

class Foto(Base):
    __tablename__ = 'foto'

    id = Column(Integer, primary_key=True, autoincrement=True)
    actividad_id = Column(Integer, ForeignKey("actividad.id"), nullable=False)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)

    actividad = relationship("Actividad", back_populates="fotos")

class ContactarPor(Base):
    __tablename__ = 'contactar_por'

    id = Column(Integer, primary_key=True, autoincrement=True)
    actividad_id = Column(Integer, ForeignKey("actividad.id"), nullable=False)
    nombre = Column(Enum(ContactoEnum), nullable=False)
    identificador = Column(String(150), nullable=False)

    actividad = relationship("Actividad", back_populates="contactos")


# --- funciones para la base de datos ---

# region
def get_regiones():
    with SessionLocal() as session:
        return session.query(Region).all()

def get_region_by_nombre(nombre):
    with SessionLocal() as session:
        return session.query(Region).filter_by(nombre=nombre).first()

def get_region_by_id(id):
    with SessionLocal() as session:
        return session.query(Region).filter_by(id=id).first()

# comuna
def get_comunas_by_region(region_id):
    with SessionLocal() as session:
        return session.query(Comuna).filter_by(region_id=region_id).all()

def get_comuna_by_id(id):
    with SessionLocal() as session:
        return session.query(Comuna).filter_by(id=id).first()

def get_comuna_by_nombre(nombre):
    with SessionLocal() as session:
        return session.query(Comuna).filter_by(nombre=nombre).first()

# crear actividad

def create_actividad(comuna_id, sector, nombre, email, celular, dia_hora_inicio, dia_hora_termino, descripcion):
    with SessionLocal() as session:
        act = Actividad(
            comuna_id=comuna_id,
            sector=sector,
            nombre=nombre,
            email=email,
            celular=celular,
            dia_hora_inicio=dia_hora_inicio,
            dia_hora_termino=dia_hora_termino,
            descripcion=descripcion
        )
        session.add(act)
        session.commit()
        session.refresh(act)

        return act

def add_tema_a_actividad(actividad_id, tema, glosa_otro=None):
    with SessionLocal() as session:
        nuevo = ActividadTema(actividad_id=actividad_id, tema=tema, glosa_otro=glosa_otro)
        session.add(nuevo)
        session.commit()

def get_temas_by_actividad(actividad_id):
    with SessionLocal() as session:
        return session.query(ActividadTema).filter_by(actividad_id=actividad_id).all()

def add_contacto_a_actividad(actividad_id, nombre, identificador):
    with SessionLocal() as session:
        nuevo = ContactarPor(actividad_id=actividad_id, nombre=nombre, identificador=identificador)
        session.add(nuevo)
        session.commit()

def get_contactos_by_actividad(actividad_id):
    with SessionLocal() as session:
        return session.query(ContactarPor).filter_by(actividad_id=actividad_id).all()

def add_foto_a_actividad(actividad_id, ruta, nombre):
    with SessionLocal() as session:
        nueva = Foto(actividad_id=actividad_id, ruta_archivo=ruta, nombre_archivo=nombre)
        session.add(nueva)
        session.commit()

def get_fotos_by_actividad(actividad_id):
    with SessionLocal() as session:
        return session.query(Foto).filter_by(actividad_id=actividad_id).all()


# obtener actividad
def get_actividad_by_id(id):
    with SessionLocal() as session:
        return session.query(Actividad).filter_by(id=id).first()

def show_actividad(actividad_id):

    with SessionLocal() as session:
        actividad = session.query(Actividad).filter_by(id=actividad_id).first()
        if not actividad:
            return None
        comuna = session.query(Comuna).filter_by(id=actividad.comuna_id).first()
        region = session.query(Region).filter_by(id=comuna.region_id).first()
        temas = session.query(ActividadTema).filter_by(actividad_id=actividad_id).all()
        contactos = session.query(ContactarPor).filter_by(actividad_id=actividad_id).all()
        fotos = session.query(Foto).filter_by(actividad_id=actividad_id).all()
        return {
            "actividad": actividad,
            "comuna": comuna,
            "region": region,
            "temas": temas,
            "contactos": contactos,
            "fotos": fotos
        }

def get_actividades_by_comuna(comuna_id):
    with SessionLocal() as session:
        return session.query(Actividad).filter_by(comuna_id=comuna_id).all()

def show_five_actividades():
    with SessionLocal() as session:
        actividades = (
            session.query(Actividad)
            .order_by(Actividad.id.desc())
            .limit(5)
            .all()
        )
        return [show_actividad(actividad.id) for actividad in actividades]

def get_actividades():
    with SessionLocal() as session:
        return session.query(Actividad).all()

def show_all_actividades():
    with SessionLocal() as session:
        actividades = session.query(Actividad).all()
        return [show_actividad(actividad.id) for actividad in actividades]


def get_actividad_by_dia_hora_inicio(dia_hora_inicio):
    with SessionLocal() as session:
        return session.query(Actividad).filter_by(dia_hora_inicio=dia_hora_inicio).first()

def get_actividades_by_tipo(actividad_id):
    with SessionLocal() as session:
        return session.query(Actividad).filter_by(id=actividad_id).all()








