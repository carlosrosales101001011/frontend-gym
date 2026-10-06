import { useState, type DragEvent } from 'react'

/**
 * Arrastre entre dos columnas: `zona(columna)` va en la columna y `arrastre(id, columna)` en cada tarjeta.
 * Solo se suelta en la columna contraria; al soltar llama a onSoltar(id, columnaDestino).
 */
export const useArrastreColumnas = <C extends string>(habilitado: boolean, onSoltar: (id: number, destino: C) => void) => {
  const [arrastrando, setArrastrando] = useState<{ id: number, desde: C } | null>(null)
  const [zonaSobre, setZonaSobre] = useState<C | null>(null)

  const zona = (columna: C) => ({
    sobre: zonaSobre === columna,
    onDragOver: (e: DragEvent) => {
      if (!arrastrando || arrastrando.desde === columna) return
      e.preventDefault()
      setZonaSobre(columna)
    },
    onDragLeave: () => setZonaSobre(null),
    onDrop: (e: DragEvent) => {
      e.preventDefault()
      setZonaSobre(null)
      if (!arrastrando || arrastrando.desde === columna) return
      onSoltar(arrastrando.id, columna)
      setArrastrando(null)
    },
  })

  const arrastre = (id: number, desde: C) => ({
    draggable: habilitado,
    arrastrandose: arrastrando?.id === id,
    onDragStart: (e: DragEvent) => {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', String(id)) // Firefox no arrastra sin datos
      setArrastrando({ id, desde })
    },
    onDragEnd: () => { setArrastrando(null); setZonaSobre(null) },
  })

  return { zona, arrastre }
}
