# Mirto · Qué hay que cambiar en tu centro

Esta es una plantilla libre. Funciona tal cual, pero antes de repartirla hay que
tocar **cuatro cosas**. Las tres primeras son obligatorias; la cuarta es la que
hace que la aplicación hable el idioma de tu claustro.

Todo está agrupado y numerado dentro de los archivos, no hay que buscar.

---

## 1. La clave de dirección · `Codigo.gs`

Al principio del archivo, en el bloque `AJUSTES`:

```js
CENTRO: 'Nombre del centro',
CLAVE: '',                      // <-- OBLIGATORIO
```

Pon el nombre de tu centro y **una clave**. Mientras `CLAVE` esté vacía nadie
puede entrar al panel de dirección: es deliberado, para que no se quede abierto
por olvido. No reutilices aquí una contraseña que uses para otra cosa; en el
apartado 6 se explica por qué.

Si quieres recibir un correo por cada parte, rellena `AVISAR_A`. Si solo te
interesan los urgentes, pon `AVISAR_SOLO_URGENTES` en `true`.

---

## 2. La dirección del servidor · `index.html`

En el bloque `CONFIG`, apartado 2:

```js
URL_SCRIPT: "",
```

Ahí va la URL que te dará Apps Script al implementar. Cómo obtenerla está en
`GUIA.md`, paso 1. Hasta que no la pegues, la aplicación avisa en pantalla y
guarda los partes en el dispositivo.

---

## 3. La identidad del centro · `index.html`

En el mismo bloque `CONFIG`, apartado 1:

```js
APP:       "Mirto",
CENTRO:    "Nombre del centro",
LOCALIDAD: "Localidad",
```

`APP` es el nombre que sale en grande y bajo el icono del móvil. Puedes dejar
*Mirto* —viene de mirto, el arrayán— o poner el que quieras: el icono es una
hoja y no dice ningún nombre, así que sirve igual.

Si cambias el nombre, cámbialo también en `manifest.webmanifest`, en los campos
`name` y `short_name`. Es lo que ve el sistema operativo al instalarla.

---

## 4. Los espacios del centro · `index.html`

Apartados 3, 4 y 5 de `CONFIG`. Es el trabajo de verdad, y merece media hora.

```js
AULAS: rango("Aula", 1, 20),
```

`rango()` genera series numeradas. Si tus aulas tienen nombre, escríbelas:

```js
AULAS: ["Infantil 3 años", "Infantil 4 años", "1.º A", "2.º A",
        "Aula de música", "Aula de PT", "Gimnasio"],
```

Lo mismo con pasillos, baños, zonas del patio y puertas de acceso. **Usa los
nombres que de verdad emplea el claustro**, aunque no sean los del plano. Si en
el centro se dice «el pasillo de arriba», pon eso: la lista es para que alguien
elija en diez segundos con el móvil en la mano, no para el inventario.

En el apartado 4 están los destinos de derivación. Ajústalos a tu comunidad
autónoma: el mantenimiento del edificio suele corresponder al ayuntamiento y lo
informático al servicio TIC de la administración educativa, pero los nombres
cambian en cada sitio.

En el apartado 5, los atajos: los desperfectos más frecuentes de cada zona,
que aparecen como botones de un toque. Quita los que no os pasen nunca y añade
los vuestros.

---

## Y después

Sigue `GUIA.md` de principio a fin: crear el script, publicar la carpeta e
instalarla en los móviles. Para la sala del profesorado tienes `hoja.py`, que
genera un A4 de instrucciones; abre el archivo, pon `CENTRO`, `LOCALIDAD` y la
dirección, y ejecútalo con `python3 hoja.py`.

---

## Antes de repartirla, comprueba

- [ ] `CLAVE` puesta en `Codigo.gs` y anotada donde corresponda.
- [ ] `URL_SCRIPT` pegada y la aplicación no muestra el aviso amarillo.
- [ ] Un parte de prueba llega a la hoja de cálculo, con su foto en la carpeta.
- [ ] El acceso de dirección funciona con la clave nueva.
- [ ] La dirección web se abre en una ventana de incógnito sin pedir sesión.
- [ ] La hoja y la carpeta están compartidas con la cuenta de dirección
      (función `enlaces` de `Codigo.gs`).
- [ ] Borrada la fila de prueba de la hoja.

---

## Un apunte sobre protección de datos

La aplicación guarda el nombre de quien da el parte y las fotos que se adjunten.
Eso es un tratamiento de datos personales, aunque sea mínimo, y conviene que
figure en el registro de actividades de tratamiento del centro con su finalidad:
la gestión del mantenimiento.

Las fotos se guardan sin enlace público, y la aplicación avisa expresamente de
no fotografiar a personas. Merece la pena repetirlo en el claustro de
principio de curso: la foto es del desperfecto, no de quien pasa por delante.

Conviene además que la cuenta de Google propietaria del script sea **del
centro**, no personal de nadie, y que la contraseña esté en poder del equipo
directivo. Si esa cuenta se pierde, se pierde con ella el acceso a la hoja y a
las fotos.
