# Mirto · Guía de puesta en marcha

Partes de incidencia para centros educativos.

> Si es la primera vez que abres esto, lee antes **`PERSONALIZAR.md`**: resume
> las cuatro cosas que hay que cambiar. Esta guía es el montaje técnico.

Son cinco archivos que se suben tal cual a una dirección web, más un script de
Google que guarda los partes en una hoja de cálculo y las fotos en Drive.
Todo con cuentas gratuitas. Sin Play Store ni App Store.

---

## 1. El servidor (Google Apps Script) · 10 minutos

1. Entra en <https://script.google.com> con la cuenta del centro y crea un
   **proyecto nuevo**.
2. Borra lo que haya en `Código.gs` y pega el contenido de **`Codigo.gs`**.
3. Arriba del archivo, en `AJUSTES`:
   - `CENTRO`: el nombre de tu centro.
   - `CLAVE`: ponla. Es la clave del equipo directivo (no la de nadie más).
     Mientras esté vacía, el panel de dirección no deja entrar a nadie.
   - `AVISAR_A`: correo que recibirá un aviso por cada parte. Déjalo vacío si
     no quieres correos.
   - `AVISAR_SOLO_URGENTES`: ponlo en `true` si solo quieres que te escriba
     cuando alguien marque «Cuanto antes» o «No puedo dar clase».
4. Menú **Ejecutar** → función `preparar`. Google pedirá permisos: acéptalos
   (aparecerá un aviso de «aplicación no verificada»; es tu propio script,
   entra por *Configuración avanzada → Ir a…*).
   Esto crea la hoja de cálculo y la carpeta de fotos en tu Drive. En el
   registro de ejecución verás los dos enlaces: guárdalos.
5. Botón **Implementar** → *Nueva implementación* → tipo **Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
6. Copia la **URL** que aparece al terminar (acaba en `/exec`).

> Si más adelante tocas el código, hay que volver a **Implementar → Gestionar
> implementaciones → editar → Nueva versión**. Si no, los cambios no salen.

---

## 2. La aplicación · 5 minutos

Abre `index.html` con cualquier editor de texto y busca el bloque `CONFIG`
(está al principio del `<script>`, señalizado):

- **`URL_SCRIPT`**: pega ahí la URL del paso 1.6, entre las comillas.
- **Apartado 1**: nombre de la aplicación, del centro y de la localidad.
- **Apartado 3**: los espacios. `AULAS` viene como `rango("Aula", 1, 20)`; si
  tus aulas tienen nombre, escríbelas a mano. Igual con pasillos, baños, patio
  y puertas. Usa los nombres que emplea el claustro, no los del plano.
- **Apartado 4**: los destinos de derivación, según tu comunidad autónoma.
- **Apartado 5**: los atajos de desperfectos frecuentes.

Todo esto está detallado en `PERSONALIZAR.md`.
- **`ATAJOS_*`**: los desperfectos más frecuentes de cada sitio. Son botones de
  un toque para no tener que escribir.

Guarda. No hace falta tocar nada más.

---

## 3. Publicarla · 5 minutos

Necesita HTTPS; si no, ni Android ni iOS la dejan instalar. Dos caminos
gratuitos:

**Netlify Drop** (el más rápido): entra en <https://app.netlify.com/drop> y
arrastra la carpeta entera. Te da una dirección al instante.

> **Atención:** desde julio de 2026 los equipos nuevos crean los proyectos como
> **privados**, y entonces solo los ve el propietario. Después de publicar, ve a
> *Project configuration → General → Visitor access* y ponlo en **Public**, o el
> claustro se encontrará una pantalla de inicio de sesión de Netlify.

**GitHub Pages**: crea un repositorio, sube los archivos, y en
*Settings → Pages* elige la rama principal. La dirección será
`https://usuario.github.io/repositorio/`.

Con la dirección en la mano, genera un **código QR** y pégalo en la sala del
profesorado y en el tablón de dirección.

---

## 4. Cómo la instala el profesorado

Es lo único que hay que explicarles. Cabe en un correo.

**Android** — abre el enlace en Chrome → menú **⋮** → *Instalar aplicación* (o
*Añadir a pantalla de inicio*) → *Instalar*.

**iPhone o iPad** — abre el enlace **en Safari** (en Chrome de iOS no funciona)
→ botón **Compartir** (el cuadrado con la flecha) → *Añadir a pantalla de
inicio* → *Añadir*.

Queda un icono verde con una hoja, junto al resto de aplicaciones. Al abrirlo
no se ve barra de navegador: es indistinguible de una app normal.

Se puede usar también sin instalar, directamente desde el enlace, pero entonces
no funciona sin cobertura.

---

## 5. Cómo funciona por dentro

- **El profesorado** escribe su nombre (queda memorizado en su móvil), elige
  categoría, sitio y urgencia, describe y, si hace falta, hace una foto. La
  foto se reduce a 1400 px antes de subirse, así que no consume datos.
- **Fecha y hora** las pone la aplicación: aparecen arriba mientras se rellena
  el parte y quedan selladas al enviarlo. Nadie las teclea, nadie las cambia.
- **Código de incidencia**: `ARR-2526-0041`. Las cuatro cifras del curso
  académico (septiembre a agosto) y un número correlativo que se reinicia cada
  septiembre. Sale en grande al enviar el parte y encabeza cada ficha del
  panel: es el número que citas en un correo al Ayuntamiento.
- **Sin cobertura** el parte se guarda en el móvil y se envía solo cuando
  vuelve la conexión. La pantalla lo dice claramente.
- **Dirección** entra por el enlace del pie con la clave, ve todos los partes,
  filtra por estado y los mueve entre *Nueva → En trámite → Resuelta / No
  reparable*. Todo queda escrito en la hoja de cálculo.
- **Derivación**: la decide dirección. Cada ficha del panel lleva un desplegable
  *Derivar a* y todos los partes nacen como «Sin derivar». No hay ninguna
  asignación automática: la aplicación no supone a quién le toca.
- **Historial por espacio**: la pestaña *Por espacio* agrupa todos los partes
  del curso por aula o zona, ordenados por reincidencia, indicando cuántos
  siguen sin cerrar y de cuándo es el último. Al pulsar en un espacio se ve su
  historial completo. Además, cada ficha avisa de si es el «3.º de 5 en Aula 7»
  y lo marca en rojo a partir del tercero. Ese dato es el que gana una
  reclamación al Ayuntamiento cuando la misma persiana lleva cuatro partes.
- **Excel**: el botón *Descargar en Excel* del panel saca un CSV con separador
  `;` y BOM, que Excel en español abre en columnas sin tocar nada. Útil para el
  equipo técnico de coordinación pedagógica, el Consejo Escolar o la memoria de
  autoevaluación.

---

## 5 bis. Por qué no usa una conexión normal

Apps Script no envía la cabecera `Access-Control-Allow-Origin`, así que un
navegador se niega a leer sus respuestas desde otro dominio. En vez de pelearse
con eso, la aplicación usa dos caminos que no dependen de esa cabecera:

- **Para leer** (listado del panel, cambio de estado, derivación) usa JSONP: la
  petición viaja en una etiqueta `<script>`, que no está sujeta a esa regla.
- **Para enviar** un parte usa `fetch` en modo `no-cors`: la petición sale y el
  servidor la procesa, aunque el navegador no nos deje ver qué contestó. El
  código del parte se recupera después con una consulta JSONP.

Cada parte lleva una **referencia interna** (columna oculta `Ref` de la hoja).
Si un envío no llega a confirmarse y se reintenta, el servidor reconoce la
referencia y devuelve el código que ya había asignado en lugar de crear una fila
nueva. Por eso los reintentos son seguros y nunca salen partes duplicados.

Una consecuencia a tener en cuenta: la clave de dirección viaja en la dirección
de la consulta JSONP. Va cifrada por HTTPS, pero queda en el historial del
navegador y en los registros de Google. Es aceptable para una clave de
mantenimiento; no reutilices ahí ninguna contraseña que uses para otra cosa.

---

## 6. Protección de datos

- Las fotos se guardan en el Drive del centro **sin enlace público**. Solo las
  abre quien esté dentro de la cuenta. Si prefieres verlas directamente desde
  el panel, cambia `FOTOS_PUBLICAS` a `true` en `Codigo.gs`, sabiendo que
  entonces cualquiera con el enlace podrá verlas.
- La aplicación avisa expresamente de no fotografiar a personas. Conviene
  repetirlo en el claustro de inicio de curso: la foto es del desperfecto, no
  de quien pasa por delante.
- El único dato personal que se registra es el nombre de quien avisa, con la
  finalidad de gestionar el mantenimiento del centro. Merece una línea en el
  registro de actividades de tratamiento.

---

## 7. Límites que conviene conocer

- Google permite unas 20.000 ejecuciones diarias del script y 100 correos al
  día en cuentas gratuitas. Para un centro de Primaria sobra con mucho.
- No hay notificaciones push. Fue una decisión deliberada: en iOS obligan a
  tener la app instalada y complican bastante el montaje. El aviso por correo
  cubre lo mismo con una décima parte del trabajo.
- La clave de dirección es una barrera razonable, no un sistema de
  autenticación. No metas en el campo de descripción nada que no pondrías en un
  acta.


---

## 8. Si el envío falla con un error de CORS

Es el tropiezo más habitual, y no siempre depende de ti. Si en la consola del
navegador aparece `No 'Access-Control-Allow-Origin' header is present`:

1. Comprueba que en la implementación, **Quién tiene acceso** está en
   *Cualquier usuario* (no en *Cualquier usuario con una cuenta de Google*).
2. Mira la forma de la URL. Si lleva `/a/macros/tudominio.es/` en medio, la
   implementación está atada al dominio. Eso ocurre cuando el script pertenece
   a una cuenta de **Google Workspace** cuyo administrador tiene restringido
   compartir fuera de la organización, y entonces la opción *Cualquier usuario*
   ni siquiera aparece en el desplegable.
3. Salidas posibles: crear el script desde una cuenta de Google que no esté en
   Workspace, o pedir al administrador del dominio que cree una unidad
   organizativa con esa única cuenta y le permita el uso compartido externo en
   *Apps → Google Workspace → Drive y Documentos → Configuración de uso
   compartido*. Los cambios de la consola tardan de minutos a horas en aplicarse.

La URL correcta empieza por `script.google.com/macros/s/` a secas.

---

## 9. Licencia y crédito

Úsala, cópiala y adáptala libremente en cualquier centro educativo. No hace
falta pedir permiso ni citar a nadie. Si le haces mejoras que puedan servir a
otros, compártelas de vuelta.
