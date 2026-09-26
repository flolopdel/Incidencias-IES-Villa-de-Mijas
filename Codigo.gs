/*****************************************************************************
 * MIRTO · Partes de incidencia para centros educativos
 * Servidor: Google Apps Script + Hoja de cálculo + Drive
 *
 * PASOS (una sola vez):
 *   1. Cambia la CLAVE de dirección y, si quieres, el correo de aviso.
 *   2. Menú Ejecutar > preparar.  Autoriza cuando lo pida.
 *   3. Implementar > Nueva implementación > Aplicación web.
 *        Ejecutar como: Yo
 *        Quién tiene acceso: Cualquier usuario
 *   4. Copia la URL que te da y pégala en CONFIG.URL_SCRIPT de index.html.
 *
 * Al cambiar este código hay que hacer Implementar > Gestionar
 * implementaciones > editar > Nueva versión, o los cambios no salen.
 *****************************************************************************/

var AJUSTES = {
  CENTRO: 'Nombre del centro',   // aparece en el nombre de la hoja y de la carpeta
  CLAVE: '',                     // <-- OBLIGATORIO. Clave del equipo directivo.
  AVISAR_A: '',                  // correo que recibe cada parte nuevo. Vacío = sin avisos.
  AVISAR_SOLO_URGENTES: false,   // true = solo avisa de «Alta» y «Bloquea»
  FOTOS_PUBLICAS: false          // false = la foto solo la abre quien tenga cuenta del centro
};

var CABECERAS = ['Código','Fecha y hora','Quién avisa','Categoría','Sitio','Espacio',
                 'Detalle','Urgencia','Descripción','Estado','Derivada a','Foto','Actualizado',
                 'Ref'];

/* ------------------------------------------------------------------ base */

function preparar() {
  var p = PropertiesService.getScriptProperties();

  var hoja = SpreadsheetApp.create('Mirto · Partes de incidencia — ' + AJUSTES.CENTRO);
  var h = hoja.getActiveSheet();
  h.setName('Partes');
  h.getRange(1, 1, 1, CABECERAS.length).setValues([CABECERAS])
   .setFontWeight('bold').setBackground('#1E5C3F').setFontColor('#FFFFFF');
  h.setFrozenRows(1);
  h.setColumnWidth(1, 130); h.setColumnWidth(2, 150); h.setColumnWidth(9, 340);
  h.hideColumns(14);            // la referencia es de uso interno
  p.setProperty('HOJA', hoja.getId());

  var carpeta = DriveApp.createFolder('Mirto · Fotos de incidencias — ' + AJUSTES.CENTRO);
  p.setProperty('CARPETA', carpeta.getId());

  Logger.log('Hoja de cálculo: ' + hoja.getUrl());
  Logger.log('Carpeta de fotos: ' + carpeta.getUrl());
  return hoja.getUrl();
}

function _hoja() {
  var id = PropertiesService.getScriptProperties().getProperty('HOJA');
  if (!id) throw new Error('SIN_PREPARAR');
  var h = SpreadsheetApp.openById(id).getSheetByName('Partes');
  // Hojas creadas con la versión anterior no tienen la columna Ref: se añade sola.
  if (h.getRange(1, 14).getValue() !== 'Ref') {
    h.getRange(1, 14).setValue('Ref').setFontWeight('bold')
     .setBackground('#1E5C3F').setFontColor('#FFFFFF');
  }
  return h;
}

/* Devuelve el código ya asignado a una referencia, o '' si aún no existe.
   Es lo que impide que un reintento cree el parte dos veces. */
function _buscarRef(ref) {
  if (!ref) return '';
  var h = _hoja();
  if (h.getLastRow() < 2) return '';
  var n = h.getLastRow() - 1;
  var refs = h.getRange(2, 14, n, 1).getValues();
  var ids  = h.getRange(2, 1, n, 1).getValues();
  for (var i = n - 1; i >= 0; i--) {              // de abajo arriba: lo reciente primero
    if (String(refs[i][0]) === String(ref)) return String(ids[i][0]);
  }
  return '';
}

function _carpeta() {
  return DriveApp.getFolderById(
    PropertiesService.getScriptProperties().getProperty('CARPETA'));
}

function _respuesta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* Curso académico: de septiembre a agosto. Devuelve por ejemplo "2526". */
function _curso(d) {
  var a = d.getFullYear(), m = d.getMonth();
  var ini = (m >= 8) ? a : a - 1;
  return String(ini).slice(2) + String(ini + 1).slice(2);
}

function _codigo(fecha) {
  var p = PropertiesService.getScriptProperties();
  var curso = _curso(fecha);
  var n = Number(p.getProperty('CONTADOR_' + curso) || 0) + 1;
  p.setProperty('CONTADOR_' + curso, String(n));
  return 'ARR-' + curso + '-' + ('000' + n).slice(-4);
}

/* --------------------------------------------------------------- entrada */

function doPost(e) {
  var bloqueo = LockService.getScriptLock();
  try {
    bloqueo.waitLock(25000);
    var d = JSON.parse(e.postData.contents);

    if (d.accion === 'crear')  return _respuesta(crear(d.parte));
    if (d.accion === 'listar') { _comprobar(d.clave); return _respuesta({ok: true, partes: listar()}); }
    if (d.accion === 'estado')  { _comprobar(d.clave); return _respuesta(estado(d.id, d.estado)); }
    if (d.accion === 'derivar') { _comprobar(d.clave); return _respuesta(derivar(d.id, d.derivada)); }

    return _respuesta({ok: false, error: 'ACCION_DESCONOCIDA'});
  } catch (err) {
    return _respuesta({ok: false, error: String(err.message || err)});
  } finally {
    try { bloqueo.releaseLock(); } catch (x) {}
  }
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (!p.accion) {
    return ContentService.createTextOutput(
      'Mirto está en marcha. Esta dirección va pegada en CONFIG.URL_SCRIPT.');
  }

  var r;
  try {
    if (p.accion === 'codigo') {
      var id = _buscarRef(p.ref);
      r = id ? {ok: true, id: id} : {ok: false, error: 'PENDIENTE'};
    } else if (p.accion === 'listar') {
      _comprobar(p.clave); r = {ok: true, partes: listar()};
    } else if (p.accion === 'estado') {
      _comprobar(p.clave); r = estado(p.id, p.estado);
    } else if (p.accion === 'derivar') {
      _comprobar(p.clave); r = derivar(p.id, p.derivada);
    } else {
      r = {ok: false, error: 'ACCION_DESCONOCIDA'};
    }
  } catch (err) {
    r = {ok: false, error: String(err.message || err)};
  }

  var txt = JSON.stringify(r);
  if (p.callback) {
    return ContentService.createTextOutput(p.callback + '(' + txt + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(txt).setMimeType(ContentService.MimeType.JSON);
}

function _comprobar(clave) {
  // Sin clave configurada nadie entra: evita dejar el panel abierto por olvido.
  if (!AJUSTES.CLAVE) throw new Error('CLAVE_SIN_CONFIGURAR');
  if (String(clave) !== String(AJUSTES.CLAVE)) throw new Error('CLAVE_INCORRECTA');
}

/* ---------------------------------------------------------------- crear */

function crear(p) {
  var h = _hoja();

  // Si este parte ya entró (reintento tras un envío a ciegas), no se duplica.
  var yaEsta = _buscarRef(p.ref);
  if (yaEsta) return {ok: true, id: yaEsta};

  var fecha = p.creado ? new Date(p.creado) : new Date();
  var id = _codigo(fecha);
  var enlaceFoto = '';

  if (p.foto) {
    try {
      var trozos = p.foto.split(',');
      var bytes = Utilities.base64Decode(trozos[1]);
      var blob = Utilities.newBlob(bytes, 'image/jpeg', id + '.jpg');
      var archivo = _carpeta().createFile(blob);
      if (AJUSTES.FOTOS_PUBLICAS) {
        archivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      }
      enlaceFoto = archivo.getUrl();
    } catch (err) {
      enlaceFoto = 'La foto no se pudo guardar';
    }
  }

  // La derivación la decide dirección desde el panel: nace vacía a propósito.
  h.appendRow([id, fecha, p.nombre, p.categoria, p.subcategoria, p.ubicacion,
               p.detalle, p.urgencia, p.descripcion, 'Nueva', 'Sin derivar',
               enlaceFoto, new Date(), p.ref || '']);

  _avisar(id, p, enlaceFoto);
  return {ok: true, id: id};
}

function _avisar(id, p, foto) {
  if (!AJUSTES.AVISAR_A) return;
  if (AJUSTES.AVISAR_SOLO_URGENTES && p.urgencia !== 'Alta' && p.urgencia !== 'Bloquea') return;
  try {
    var sitio = [p.subcategoria, p.ubicacion].filter(String).join(' · ');
    MailApp.sendEmail({
      to: AJUSTES.AVISAR_A,
      subject: '[' + id + '] ' + p.categoria + (sitio ? ' — ' + sitio : '') + ' (' + p.urgencia + ')',
      body: 'Parte nuevo en Mirto.\n\n' +
            'Código: ' + id + '\n' +
            'Avisa: ' + p.nombre + '\n' +
            'Sitio: ' + (sitio || '—') + '\n' +
            (p.detalle ? 'Detalle: ' + p.detalle + '\n' : '') +
            'Urgencia: ' + p.urgencia + '\n\n' +
            p.descripcion + '\n\n' +
            (foto ? 'Foto: ' + foto + '\n' : '')
    });
  } catch (err) {}
}

/* --------------------------------------------------------------- listar */

function listar() {
  var h = _hoja();
  if (h.getLastRow() < 2) return [];
  var f = h.getRange(2, 1, h.getLastRow() - 1, CABECERAS.length).getValues();
  var salida = [];
  for (var i = f.length - 1; i >= 0; i--) {          // el más reciente primero
    var r = f[i];
    if (!r[0]) continue;
    salida.push({
      id: r[0],
      creado: (r[1] instanceof Date) ? r[1].toISOString() : String(r[1]),
      nombre: r[2], categoria: r[3], subcategoria: r[4], ubicacion: r[5],
      detalle: r[6], urgencia: r[7], descripcion: r[8],
      estado: r[9] || 'Nueva', derivada: r[10], foto: r[11]
    });
  }
  return salida;
}

/* --------------------------------------------------------------- estado */

function _fila(id) {
  var h = _hoja();
  var n = Math.max(h.getLastRow() - 1, 1);
  var ids = h.getRange(2, 1, n, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2;
  }
  throw new Error('PARTE_NO_ENCONTRADO');
}

function estado(id, nuevo) {
  var h = _hoja(), fila = _fila(id);
  h.getRange(fila, 10).setValue(nuevo);        // Estado
  h.getRange(fila, 13).setValue(new Date());   // Actualizado
  return {ok: true};
}

/* La derivación no se calcula sola: la asigna dirección desde el panel. */
function derivar(id, destino) {
  var h = _hoja(), fila = _fila(id);
  h.getRange(fila, 11).setValue(destino || 'Sin derivar');
  h.getRange(fila, 13).setValue(new Date());
  return {ok: true};
}

/*****************************************************************************
 * ¿DÓNDE ESTÁ LA HOJA DE CÁLCULO?
 * Pon tu correo abajo, guarda, y ejecuta esta función desde el menú Ejecutar.
 * Los dos enlaces salen en el «Registro de ejecución», al pie del editor.
 * De paso, comparte ambos con tu cuenta para que los veas desde tu Drive.
 * No hace falta volver a implementar: las funciones se ejecutan con el código
 * guardado, no con el publicado.
 *****************************************************************************/
function enlaces() {
  var MI_CORREO = 'pon.aqui.tu.correo@tucentro.es';   // <-- cámbialo

  var p = PropertiesService.getScriptProperties();
  var hoja = SpreadsheetApp.openById(p.getProperty('HOJA'));
  var carpeta = DriveApp.getFolderById(p.getProperty('CARPETA'));

  Logger.log('HOJA DE CÁLCULO:  ' + hoja.getUrl());
  Logger.log('CARPETA DE FOTOS: ' + carpeta.getUrl());

  if (MI_CORREO.indexOf('pon.aqui') === -1) {
    hoja.addEditor(MI_CORREO);
    carpeta.addEditor(MI_CORREO);
    Logger.log('Compartidos con ' + MI_CORREO + '. Míralos en «Compartido conmigo».');
  } else {
    Logger.log('Cambia MI_CORREO si quieres verlos desde tu cuenta de dirección.');
  }
}
