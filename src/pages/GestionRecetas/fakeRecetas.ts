import type { DificultadReceta, NutricionProps, RecetaIngredienteProps, RecetaProps } from '@/pages/GestionRecetas/store/recetaSlice'

const imagenUnsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=70`

/** Imagen de relleno de las recetas sin foto (el backend todavía no guarda fotos) */
export const FAKE_IMAGEN = imagenUnsplash('1546069901-ba9599a7e63c')

/** [ingrediente, cantidad, unidad] */
type IngredienteEjemplo = [string, number, string]

const ejemplo = (
  id: number,
  titulo: string,
  porciones: number,
  dificultad: DificultadReceta,
  minutos_preparacion: number,
  por_porcion: NutricionProps,
  imagen: string,
  ingredientes: IngredienteEjemplo[],
  pasos: string[],
): RecetaProps => ({
  id,
  titulo,
  slug: '',
  porciones,
  dificultad,
  minutos_preparacion,
  imagen: imagenUnsplash(imagen),
  preparacion: pasos.map((paso, i) => `${i + 1}. ${paso}`).join('\n'),
  ingredientes: ingredientes.map(([label_ingrediente, cantidad, label_unidad], i): RecetaIngredienteProps => ({
    id_ingrediente: i + 1,
    label_ingrediente,
    id_unidad: 0,
    label_unidad,
    cantidad,
  })),
  nutricion: {
    por_porcion,
    total: {
      kcal: por_porcion.kcal * porciones,
      proteinas_g: por_porcion.proteinas_g * porciones,
      carbohidratos_g: por_porcion.carbohidratos_g * porciones,
      grasas_g: por_porcion.grasas_g * porciones,
    },
  },
})

/** Recetas de ejemplo: no están en la base (id negativo) y solo se ven mientras no haya recetas registradas */
export const FAKE_RECETAS: RecetaProps[] = [
  ejemplo(-1, 'Avena con plátano y nueces', 1, 'Fácil', 10, { kcal: 392, proteinas_g: 12, carbohidratos_g: 59, grasas_g: 12 }, '1490474418585-ba9bad8fd0ea', [
    ['Avena', 0.5, 'Taza'],
    ['Leche descremada', 1, 'Taza'],
    ['Plátano', 1, 'Unidad'],
    ['Nueces', 15, 'Gramo'],
  ], [
    'Cocina la avena con la leche a fuego bajo durante 8 minutos, sin dejar de mover.',
    'Sirve en un tazón y agrega el plátano en rodajas.',
    'Termina con las nueces picadas.',
  ]),
  ejemplo(-2, 'Ensalada de quinua con pollo', 2, 'Media', 30, { kcal: 412, proteinas_g: 35, carbohidratos_g: 41, grasas_g: 12 }, '1512621776951-a57141f2eefd', [
    ['Quinua cocida', 2, 'Taza'],
    ['Pechuga de pollo', 200, 'Gramo'],
    ['Tomate', 1, 'Unidad'],
    ['Aceite de oliva', 1, 'Cucharada'],
  ], [
    'Cocina la pechuga a la plancha hasta que esté dorada y córtala en tiras.',
    'Mezcla la quinua cocida con el tomate en cubos.',
    'Agrega el pollo y aliña con el aceite de oliva.',
  ]),
  ejemplo(-3, 'Lomo saltado saludable', 2, 'Media', 30, { kcal: 460, proteinas_g: 34, carbohidratos_g: 45, grasas_g: 16 }, '1544025162-d76694265947', [
    ['Lomo de res', 250, 'Gramo'],
    ['Arroz integral cocido', 1.5, 'Taza'],
    ['Cebolla roja', 1, 'Unidad'],
    ['Tomate', 2, 'Unidad'],
    ['Aceite', 1, 'Cucharada'],
  ], [
    'Corta el lomo en tiras y saltéalo en una sartén bien caliente con el aceite.',
    'Agrega la cebolla y el tomate en gajos y saltea 3 minutos más.',
    'Sirve con el arroz integral.',
  ]),
  ejemplo(-4, 'Crema de zapallo', 4, 'Fácil', 40, { kcal: 169, proteinas_g: 5, carbohidratos_g: 26, grasas_g: 5 }, '1547592166-23ac45744acd', [
    ['Zapallo', 800, 'Gramo'],
    ['Papa', 2, 'Unidad'],
    ['Leche descremada', 1, 'Taza'],
    ['Aceite de oliva', 1, 'Cucharada'],
  ], [
    'Pela y corta el zapallo y las papas en trozos, y cocínalos en agua hasta que estén suaves.',
    'Licúa con la leche descremada.',
    'Devuelve a la olla, calienta 5 minutos y sirve con el aceite de oliva.',
  ]),
  ejemplo(-5, 'Salmón al horno con espárragos', 2, 'Media', 25, { kcal: 388, proteinas_g: 36, carbohidratos_g: 7, grasas_g: 24 }, '1467003909585-2f8a72700288', [
    ['Filete de salmón', 300, 'Gramo'],
    ['Espárragos', 200, 'Gramo'],
    ['Aceite de oliva', 1, 'Cucharada'],
    ['Limón', 1, 'Unidad'],
  ], [
    'Precalienta el horno a 200 °C y coloca el salmón con los espárragos en una bandeja.',
    'Rocía con el aceite de oliva y el jugo de limón.',
    'Hornea durante 15 minutos y sirve.',
  ]),
  ejemplo(-6, 'Tortilla de espinaca', 1, 'Fácil', 15, { kcal: 248, proteinas_g: 19, carbohidratos_g: 7, grasas_g: 16 }, '1525351484163-7529414344d8', [
    ['Huevo', 2, 'Unidad'],
    ['Espinaca', 1, 'Taza'],
    ['Queso fresco', 30, 'Gramo'],
    ['Sal', 1, 'Pizca'],
  ], [
    'Saltea la espinaca en una sartén antiadherente hasta que reduzca su tamaño.',
    'Bate los huevos con la sal y viértelos sobre la espinaca.',
    'Agrega el queso, dobla la tortilla y cocina 2 minutos más.',
  ]),
  ejemplo(-7, 'Ají de pollo ligero', 4, 'Difícil', 45, { kcal: 426, proteinas_g: 33, carbohidratos_g: 42, grasas_g: 14 }, '1603894584373-5ac82b2ae398', [
    ['Pechuga de pollo', 500, 'Gramo'],
    ['Ají amarillo molido', 3, 'Cucharada'],
    ['Pan integral', 4, 'Rebanada'],
    ['Leche descremada', 250, 'Mililitro'],
    ['Arroz integral cocido', 3, 'Taza'],
  ], [
    'Sancocha la pechuga, deshiláchala y reserva el caldo para la salsa.',
    'Licúa el pan remojado en la leche y cocínalo con el ají amarillo hasta que espese.',
    'Incorpora el pollo, ajusta con el caldo y sirve con el arroz integral.',
  ]),
  ejemplo(-8, 'Batido de fresa y yogur', 1, 'Fácil', 5, { kcal: 208, proteinas_g: 14, carbohidratos_g: 29, grasas_g: 4 }, '1553530666-ba11a7da3888', [
    ['Fresas', 1, 'Taza'],
    ['Yogur natural', 200, 'Mililitro'],
    ['Miel', 1, 'Cucharadita'],
  ], [
    'Lava las fresas, retira las hojas y colócalas en la licuadora con el yogur.',
    'Agrega la miel y licúa durante 1 minuto.',
    'Sirve frío.',
  ]),
]
