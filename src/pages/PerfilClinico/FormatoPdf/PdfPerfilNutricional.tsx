import type { ReactNode } from 'react'
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { differenceInYears } from 'date-fns'
import logo from '@/assets/img/logo-empresa.jpg'
import { formatDate } from '@/helpers/FormatDate'
import { localDateStringToDate } from '@/helpers/getDate'
import type { ColaboradorProps } from '@/pages/PerfilColaborador/store/perfilColaboradorSlice'
import type { PerfilNutricional } from '../hook/usePerfilNutricionalStore'
import { calcularCinturaCadera, calcularImc, calcularPgc, clasificarImc } from '../Tabs/TabEvaluacionCorporal/medidasAntropometricas'

/** Textos de lo marcado en cada lista (terminología) */
export type MarcadosPdf = Record<'objetivos' | 'personales' | 'familiares' | 'lesiones' | 'alergias', string>

export type PdfPerfilNutricionalProps = {
  paciente: ColaboradorProps
  sexo?: string
  registro: PerfilNutricional
  /** Todas las fechas del paciente (reporte nutricionista) */
  registros: PerfilNutricional[]
  marcados: MarcadosPdf
  /** Fotos como data url; null si no hay o no se pudo cargar */
  fotos: { perfil: string | null, frente: string | null }
}

const s = StyleSheet.create({
  pagina: { paddingTop: 28, paddingBottom: 40, paddingHorizontal: 28, fontSize: 9, fontFamily: 'Helvetica', color: '#212529' },
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  logo: { width: 110, height: 32, objectFit: 'cover' },
  titulo: { fontSize: 13, fontFamily: 'Helvetica-Bold', textAlign: 'right', marginBottom: 3 },
  seccion: { borderWidth: 1, borderColor: '#dee2e6', borderRadius: 3, marginBottom: 8 },
  tituloSeccion: { backgroundColor: '#000', color: '#fff', fontFamily: 'Helvetica-Bold', paddingVertical: 4, paddingHorizontal: 8 },
  cuerpo: { padding: 6, flexDirection: 'row', flexWrap: 'wrap' },
  dato: { paddingHorizontal: 3, paddingVertical: 3 },
  etiqueta: { fontSize: 8, color: '#6c757d', marginBottom: 1 },
  negrita: { fontFamily: 'Helvetica-Bold' },
  foto: { width: '50%', alignItems: 'center' },
  imagen: { width: 150, height: 188, objectFit: 'cover', marginTop: 3 },
  fila: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#dee2e6' },
  celda: { flex: 1, padding: 4, fontSize: 8 },
  pie: { position: 'absolute', bottom: 18, left: 28, right: 28, fontSize: 8, color: '#6c757d', textAlign: 'right' },
})

const mostrar = (valor: unknown) => (valor === null || valor === undefined || valor === '' ? '—' : String(valor))
const textoFecha = (fecha: string) => formatDate(fecha.slice(0, 10), 'yyyy-mm-dd', 'd MMMM [del] yyyy')

const Seccion = ({ titulo, children, junta = true }: { titulo: string, children: ReactNode, junta?: boolean }) => (
  <View style={s.seccion} wrap={!junta}>
    <Text style={s.tituloSeccion} minPresenceAhead={30}>{titulo}</Text>
    <View style={s.cuerpo}>{children}</View>
  </View>
)

const Dato = ({ label, valor, ancho = '33.33%' }: { label: string, valor: unknown, ancho?: string }) => (
  <View style={[s.dato, { width: ancho }]}>
    <Text style={s.etiqueta}>{label}</Text>
    <Text style={s.negrita}>{mostrar(valor)}</Text>
  </View>
)

const Fila = ({ celdas, cabecera = false }: { celdas: string[], cabecera?: boolean }) => (
  <View style={s.fila} wrap={false} fixed={cabecera}>
    {celdas.map((celda, i) => <Text key={i} style={cabecera ? [s.celda, s.negrita] : s.celda}>{celda}</Text>)}
  </View>
)

/** Cirugías guardadas en el mismo orden: "Apéndice, Rodilla" / "03/2020, 08/2022". null = No */
const textoCirugias = ({ cirugia, cirugia_fecha }: PerfilNutricional) => {
  if (cirugia === null) return 'No'
  const fechas = (cirugia_fecha ?? '').split(',').map((f) => f.trim())
  const lista = cirugia.split(',').map((c, i) => [c.trim(), fechas[i] && `(${fechas[i]})`].filter(Boolean).join(' ')).filter(Boolean)
  return lista.length ? lista.join(', ') : 'Sí'
}

const COLUMNAS_REPORTE = ['Fecha', 'Peso (kg)', 'Agua corporal (L)', 'MME (kg)', 'Masa grasa (kg)', 'IMC', 'PGC (%)', 'Grasa visceral']

const filaReporte = (r: PerfilNutricional) => [
  formatDate(r.fecha.slice(0, 10), 'yyyy-mm-dd', 'dd/mm/yyyy'),
  mostrar(r.peso),
  mostrar(r.agua_corporal_total),
  mostrar(r.masa_musculo_esqueletica),
  mostrar(r.masa_grasa_corporal),
  mostrar(calcularImc(r.peso, r.talla)),
  mostrar(calcularPgc(r.masa_grasa_corporal, r.peso)),
  mostrar(r.nivel_grasa_viceral),
]

/** PDF del perfil nutricional: datos generales, evaluación corporal y antecedentes de la fecha elegida, y la evolución en todas las fechas */
export const PdfPerfilNutricional = ({ paciente, sexo, registro: r, registros, marcados, fotos }: PdfPerfilNutricionalProps) => {
  const nacimiento = paciente.fecha_nacimiento ? localDateStringToDate(String(paciente.fecha_nacimiento).slice(0, 10)) : null
  const apellidos = [paciente.apellido_paterno, paciente.apellido_materno].filter(Boolean).join(' ')
  const imc = calcularImc(r.peso, r.talla)
  const clasificacion = clasificarImc(imc)
  const hayFotos = r.uid_image_fotoPerfil || r.uid_image_fotoFrente

  const segmentos = [
    ['Brazo derecho', r.masa_magra_brazoDerecho, r.grasa_brazoDerecho],
    ['Brazo izquierdo', r.masa_magra_brazoIzquierdo, r.grasa_brazoIzquierdo],
    ['Tronco', r.masa_magra_tronco, r.grasa_tronco],
    ['Pierna derecha', r.masa_magra_piernaDerecha, r.grasa_piernaDerecha],
    ['Pierna izquierda', r.masa_magra_piernaIzquierda, r.grasa_piernaIzquierda],
  ]

  return (
    <Document title={`Perfil nutricional - ${paciente.nombres} ${apellidos}`}>
      <Page size="A4" style={s.pagina}>
        <View style={s.cabecera}>
          <Image src={logo} style={s.logo} />
          <View>
            <Text style={s.titulo}>Perfil nutricional</Text>
            <Text style={{ textAlign: 'right' }}>{[textoFecha(r.fecha), r.nombrePerfil].filter(Boolean).join(': ')}</Text>
          </View>
        </View>

        <Seccion titulo="Datos personales y contacto">
          <Dato label="Nombres" valor={paciente.nombres} />
          <Dato label="Apellidos" valor={apellidos} />
          <Dato label="Sexo" valor={sexo} />
          <Dato label="Fecha de nacimiento" valor={nacimiento && formatDate(nacimiento, 'yyyy-mm-dd', 'dd/mm/yyyy')} />
          <Dato label="Edad" valor={nacimiento && `${differenceInYears(new Date(), nacimiento)} años`} />
          <Dato label="Teléfono" valor={paciente.telefono?.trim()} />
          <Dato label="Email personal" valor={paciente.email_personal?.trim()} ancho="100%" />
        </Seccion>

        {hayFotos && (
          <Seccion titulo="Fotos">
            {([['Foto de perfil', fotos.perfil, r.uid_image_fotoPerfil], ['Foto de frente', fotos.frente, r.uid_image_fotoFrente]] as const).map(([label, src, uid]) => (
              <View key={label} style={s.foto}>
                <Text style={s.etiqueta}>{label}</Text>
                {src ? <Image src={src} style={s.imagen} /> : <Text>{uid ? 'No se pudo cargar la foto' : '—'}</Text>}
              </View>
            ))}
          </Seccion>
        )}

        <Seccion titulo="Hábitos y estilo de vida">
          <Dato label="Horas de sueño promedio" valor={r.horas_suenio_evida} />
          <Dato label="Consumo de agua (L/día)" valor={r.consumo_agua_evida} />
          <Dato label="Consumo de alcohol" valor={r.consumo_alcohol_evida} />
          <Dato label="Fuma" valor={r.fuma_evida === null ? null : r.fuma_evida ? 'Sí' : 'No'} />
          <Dato label="Estrés diario (1-10)" valor={r.estres_evida} />
          <Dato label="Nivel de actividad diaria" valor={r.actividadDiaria_evida} />
          <Dato label="Frecuencia de evacuación" valor={r.frecuencia_evacuacion} />
          <Dato label="Porciones de alimentos por día" valor={r.porciones_alimentos_x_dia} />
        </Seccion>

        <Seccion titulo="Objetivo principal">
          <Dato label="Objetivos específicos" valor={marcados.objetivos} ancho="100%" />
        </Seccion>

        <Seccion titulo="Análisis de masa magra segmental">
          {segmentos.map(([nombre, magra]) => (
            <Dato key={String(nombre)} label={`${nombre} (kg)`} valor={magra} />
          ))}
        </Seccion>

        <Seccion titulo="Análisis de grasa segmental">
          {segmentos.map(([nombre, , grasa]) => (
            <Dato key={String(nombre)} label={`${nombre} (kg)`} valor={grasa} />
          ))}
        </Seccion>

        <Seccion titulo="Análisis de composición corporal">
          <Dato label="Agua corporal total (L)" valor={r.agua_corporal_total} />
          <Dato label="Proteínas (kg)" valor={r.proteinas} />
          <Dato label="Minerales (kg)" valor={r.minerales} />
          <Dato label="MME - masa músculo esquelética (kg)" valor={r.masa_musculo_esqueletica} />
          <Dato label="Masa grasa corporal (kg)" valor={r.masa_grasa_corporal} />
        </Seccion>

        <Seccion titulo="Parámetros de investigación">
          <Dato label="Tasa metabólica basal (kcal)" valor={r.tasa_metabolica_basal} />
          <Dato label="Nivel de grasa visceral" valor={r.nivel_grasa_viceral} />
          <Dato label="Grado de obesidad (%)" valor={r.porcentaje_obesidad} />
          <Dato label="Contenido mineral óseo (kg)" valor={r.mineral_oseo} />
          <Dato label="IME - índice de masa esquelética (kg/m²)" valor={r.masa_esqueletica} ancho="66.66%" />
        </Seccion>

        <Seccion titulo="Evaluación antropométrica">
          <Dato label="Peso (kg)" valor={r.peso} />
          <Dato label="Talla (m)" valor={r.talla} />
          <Dato label="IMC" valor={clasificacion && `${imc} ${clasificacion.texto}`} />
          <Dato label="Cintura (cm)" valor={r.cintura} />
          <Dato label="Cadera (cm)" valor={r.cadera} />
          <Dato label="Cintura / cadera" valor={calcularCinturaCadera(r.cintura, r.cadera)} />
          <Dato label="Cuello (cm)" valor={r.medida_cuello} />
          <Dato label="Pecho (cm)" valor={r.medida_pecho} />
          <Dato label="Brazo derecho (cm)" valor={r.medida_brazoDerecho} />
          <Dato label="Brazo izquierdo (cm)" valor={r.medida_brazoIzquierdo} />
          <Dato label="Muslo derecho (cm)" valor={r.medida_musloDerecho} />
          <Dato label="Muslo izquierdo (cm)" valor={r.medida_musloIzquierdo} />
        </Seccion>

        <Seccion titulo="Observación de la evaluación corporal" junta={false}>
          <Text style={s.dato}>{mostrar(r.observacion_corporal)}</Text>
        </Seccion>

        <Seccion titulo="Antecedentes" junta={false}>
          <Dato label="Personales" valor={marcados.personales} ancho="50%" />
          <Dato label="Observación" valor={r.antecedentes_personales_observacion} ancho="50%" />
          <Dato label="Familiares" valor={marcados.familiares} ancho="50%" />
          <Dato label="Observación" valor={r.antecedentes_familiares_observacion} ancho="50%" />
          <Dato label="Lesiones" valor={marcados.lesiones} ancho="50%" />
          <Dato label="Observación" valor={r.lesiones_observacion} ancho="50%" />
          <Dato label="Alergias e intolerancias" valor={marcados.alergias} ancho="50%" />
          <Dato label="Observación" valor={r.alergias_observacion} ancho="50%" />
          <Dato label="Cirugías previas" valor={textoCirugias(r)} ancho="100%" />
        </Seccion>

        <View style={s.seccion}>
          <Text style={s.tituloSeccion} minPresenceAhead={60}>Evolución del paciente</Text>
          <Fila celdas={COLUMNAS_REPORTE} cabecera />
          {registros.map((fila) => <Fila key={fila.id} celdas={filaReporte(fila)} />)}
        </View>

        <Text style={s.pie} fixed render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
      </Page>
    </Document>
  )
}
