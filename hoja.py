# -*- coding: utf-8 -*-
"""
Hoja de instrucciones de una cara (A4) para la sala del profesorado.

Si ya tienes la dirección definitiva de la aplicación, ponla en DIRECCION y
vuelve a ejecutar: se imprimirá en grande y el QR podrás pegarlo en el hueco.
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color

DIRECCION = ""          # p. ej. "partes-tucentro.netlify.app"
CENTRO    = "Nombre del centro"   # aparece en la cabecera y en el pie
LOCALIDAD = "Localidad"
SALIDA    = "Mirto-instalacion-sala-profesorado.pdf"
ICONO     = "icon-512.png"

W, H = A4
MIRTO  = HexColor("#1E5C3F")
TINTA  = HexColor("#12241B")
TENUE  = HexColor("#5E6B60")
BORDE  = HexColor("#C7D0C4")
PAPEL  = HexColor("#EDF0EA")
ROJO   = HexColor("#A3241C")

MG = 46          # margen lateral
c = canvas.Canvas(SALIDA, pagesize=A4)
c.setTitle("Mirto · Cómo instalar la aplicación de partes")
c.setAuthor(CENTRO)


def texto(x, y, t, fuente="Helvetica", tam=10.5, color=TINTA, alineado="izq"):
    c.setFont(fuente, tam)
    c.setFillColor(color)
    if alineado == "centro":
        c.drawCentredString(x, y, t)
    elif alineado == "der":
        c.drawRightString(x, y, t)
    else:
        c.drawString(x, y, t)


def parrafo(x, y, lineas, tam=10.5, interlineado=14, fuente="Helvetica", color=TINTA):
    for i, l in enumerate(lineas):
        texto(x, y - i * interlineado, l, fuente, tam, color)
    return y - (len(lineas) - 1) * interlineado


# ---------------------------------------------------------------- cabecera
BANDA = 96
c.setFillColor(MIRTO)
c.rect(0, H - BANDA, W, BANDA, stroke=0, fill=1)

try:
    c.drawImage(ImageReader(ICONO), MG, H - BANDA + 24, width=48, height=48,
                mask="auto")
except Exception:
    pass

texto(MG + 64, H - BANDA + 54, "Mirto", "Times-Roman", 30, PAPEL)
texto(MG + 64, H - BANDA + 34, "Partes de incidencia  ·  " + CENTRO,
      "Helvetica", 11, Color(0.93, 0.95, 0.92, 0.85))
texto(W - MG, H - BANDA + 34, "Se instala una vez", "Helvetica", 11,
      Color(0.93, 0.95, 0.92, 0.75), "der")

y = H - BANDA - 48

# ------------------------------------------------------------- la dirección
texto(MG, y, "1.  La dirección de la aplicación", "Helvetica-Bold", 13, MIRTO)
y -= 24

CAJA_Q = 118                       # hueco para pegar el QR
c.setStrokeColor(BORDE)
c.setDash(4, 3)
c.setLineWidth(1)
c.rect(W - MG - CAJA_Q, y - CAJA_Q + 12, CAJA_Q, CAJA_Q, stroke=1, fill=0)
c.setDash()
texto(W - MG - CAJA_Q / 2, y - CAJA_Q / 2 + 16, "Pega aquí", "Helvetica", 9, TENUE, "centro")
texto(W - MG - CAJA_Q / 2, y - CAJA_Q / 2 + 4, "el código QR", "Helvetica", 9, TENUE, "centro")

ancho_txt = W - 2 * MG - CAJA_Q - 24
if DIRECCION:
    texto(MG, y - 6, DIRECCION, "Helvetica-Bold", 16, TINTA)
else:
    c.setStrokeColor(BORDE)
    c.setLineWidth(1.2)
    c.line(MG, y - 12, MG + ancho_txt, y - 12)
    texto(MG, y - 26, "(escribe aquí la dirección antes de fotocopiar)",
          "Helvetica-Oblique", 9.5, TENUE)

y2 = parrafo(MG, y - 48, [
    "Escanea el QR con la cámara del móvil, o escribe la dirección",
    "en el navegador. También te llegará por el grupo del claustro.",
], 10.5, 14, color=TENUE)

y = min(y - CAJA_Q - 6, y2 - 40)

# --------------------------------------------------------- las dos columnas
texto(MG, y, "2.  Instálala en tu móvil", "Helvetica-Bold", 13, MIRTO)
y -= 22

COL = (W - 2 * MG - 22) / 2
ALTO = 224
x1, x2 = MG, MG + COL + 22
top = y
cy = top - ALTO


def columna(x, titulo, subtitulo, pasos, dibujar_icono, aviso=None, aviso_color=ROJO):
    c.setFillColor(PAPEL)
    c.setStrokeColor(BORDE)
    c.setLineWidth(1)
    c.roundRect(x, cy, COL, ALTO, 10, stroke=1, fill=1)

    texto(x + 18, cy + ALTO - 26, titulo, "Helvetica-Bold", 13, TINTA)
    texto(x + 18, cy + ALTO - 41, subtitulo, "Helvetica", 10, TENUE)

    dibujar_icono(x + COL - 46, cy + ALTO - 44)

    yy = cy + ALTO - 72
    for i, p in enumerate(pasos):
        c.setFillColor(MIRTO)
        c.circle(x + 24, yy - 3.5, 8.5, stroke=0, fill=1)
        texto(x + 24, yy - 6.5, str(i + 1), "Helvetica-Bold", 9.5, PAPEL, "centro")
        for j, linea in enumerate(p):
            texto(x + 40, yy - j * 13.5, linea, "Helvetica", 10.5, TINTA)
        yy -= 13.5 * len(p) + 16

    if aviso:
        tam = 9.5
        while c.stringWidth(aviso, "Helvetica-Bold", tam) > COL - 36 and tam > 7.5:
            tam -= 0.25
        texto(x + 18, cy + 16, aviso, "Helvetica-Bold", tam, aviso_color)


def icono_menu(x, y):
    """Los tres puntos del menú de Chrome."""
    c.setStrokeColor(BORDE); c.setFillColor(HexColor("#FFFFFF")); c.setLineWidth(1)
    c.roundRect(x - 13, y - 15, 30, 34, 7, stroke=1, fill=1)
    c.setFillColor(TINTA)
    for k in range(3):
        c.circle(x + 2, y + 9 - k * 9, 2.4, stroke=0, fill=1)


def icono_compartir(x, y):
    """El cuadrado con la flecha hacia arriba de iOS."""
    c.setStrokeColor(BORDE); c.setFillColor(HexColor("#FFFFFF")); c.setLineWidth(1)
    c.roundRect(x - 13, y - 15, 30, 34, 7, stroke=1, fill=1)
    c.setStrokeColor(TINTA); c.setLineWidth(1.6)
    # caja abierta por arriba
    p = c.beginPath()
    p.moveTo(x - 4, y + 4); p.lineTo(x - 4, y - 8)
    p.lineTo(x + 8, y - 8); p.lineTo(x + 8, y + 4)
    c.drawPath(p, stroke=1, fill=0)
    # flecha
    c.line(x + 2, y - 4, x + 2, y + 12)
    q = c.beginPath()
    q.moveTo(x - 3, y + 7); q.lineTo(x + 2, y + 12.5); q.lineTo(x + 7, y + 7)
    c.drawPath(q, stroke=1, fill=0)


columna(
    x1, "Android", "Con Chrome",
    [["Abre la dirección en Chrome."],
     ["Toca el menú de los tres puntos,", "arriba a la derecha."],
     ["Elige «Instalar aplicación»", "y confirma."]],
    icono_menu,
    aviso="También vale «Añadir a pantalla de inicio».",
    aviso_color=TENUE,
)

columna(
    x2, "iPhone y iPad", "Con Safari, no con Chrome",
    [["Abre la dirección en Safari."],
     ["Toca el botón Compartir,", "abajo en el centro."],
     ["Baja por el menú, elige «Añadir a", "pantalla de inicio» y toca Añadir."]],
    icono_compartir,
    aviso="En Chrome de iPhone no aparece la opción.",
)

y = cy - 42

# ----------------------------------------------------------------- uso diario
texto(MG, y, "3.  Al usarla", "Helvetica-Bold", 13, MIRTO)
y -= 22

notas = [
    ("Ábrela desde el icono verde",
     "No desde el navegador: solo así guarda el parte cuando no hay cobertura."),
    ("Tu nombre se escribe una vez",
     "La aplicación lo recuerda. En los siguientes partes ya sale puesto."),
    ("La foto, solo del desperfecto",
     "Nunca fotografíes a personas, ni al alumnado de fondo."),
    ("La fecha y el código los pone ella",
     "Al enviar verás un código tipo ARR-2526-0041. Es tu número de registro."),
    ("Si hay riesgo para las personas",
     "Da el parte y avisa además a dirección por teléfono. La aplicación no suena."),
]

for titulo, detalle in notas:
    c.setFillColor(MIRTO)
    c.circle(MG + 3, y + 3.5, 2.6, stroke=0, fill=1)
    texto(MG + 14, y, titulo, "Helvetica-Bold", 10.5, TINTA)
    texto(MG + 14, y - 12.5, detalle, "Helvetica", 10, TENUE)
    y -= 37

# --------------------------------------------------------------------- pie
c.setStrokeColor(BORDE)
c.setLineWidth(1)
c.line(MG, 52, W - MG, 52)
texto(MG, 38, "¿No te funciona? Pásate por dirección y lo instalamos juntos "
              "en un minuto.", "Helvetica", 9.5, TENUE)
texto(W - MG, 38, CENTRO + ("  ·  " + LOCALIDAD if LOCALIDAD else ""), "Helvetica", 9.5, TENUE, "der")

c.showPage()
c.save()
print("Generado:", SALIDA)
