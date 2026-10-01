import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/hook/useAuth';
import { VerticalLayout } from '@/layouts/VerticalLayout';
import { useAppSelector } from '@/stores/Store';
import { usePermisosStore } from '@/hook/usePermisosStore';
import { useModuloActual } from '@/hook/useModuloActual';
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay';
import { RUTAS_PERFIL } from '@/routes/rutasPerfil';

/** Formato de la url de un módulo (el backend valida lo mismo): minúsculas, números y guiones */
const PATRON_URL_MODULO = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Rutas de un módulo: /:url_modulo/:seccion (ej. /venta/punto-venta). En orden:
 * 1. Sesión iniciada (si no, al login, sin pedir nada al servidor).
 * 2. url_modulo con formato válido (si no, al home).
 * 3. Uno de los módulos del usuario tiene esa url (si no, al home). Queda como módulo actual (store + localStorage).
 * 4. Se piden las secciones con el uid_modulo del módulo; la sección de la URL tiene que ser suya:
 *    sin sección o con una que no es suya, a la primera sección. Las rutas de perfil las valida ProfileGuard.
 */
export const ProtectedRoutes = () => {
  const { url_modulo = '' } = useParams();
  const { pathname } = useLocation();
  const [, , urlSeccion = ''] = pathname.split('/');
  const { isAuthenticated } = useAuth();
  const { modulos, secciones } = useAppSelector((state) => state.PERMISO);
  const { loadingSecciones, loadingModulos, obtenerSeccionesxUidModulo, obtenerModulos, hasSeccion } = usePermisosStore();
  const { moduloActual, seleccionarModuloActual } = useModuloActual();

  const formatoValido = PATRON_URL_MODULO.test(url_modulo);
  const puedeCargar = isAuthenticated && formatoValido;
  const modulo = modulos.find((m) => m.modulo?.url === url_modulo);
  const uidModulo = modulo?.uid ?? '';

  useEffect(() => {
    if (puedeCargar) obtenerModulos();
  }, [urlSeccion, puedeCargar]);

  // Las secciones se piden por el uid_modulo, que se conoce cuando llegan los módulos
  useEffect(() => {
    if (puedeCargar && uidModulo) obtenerSeccionesxUidModulo(uidModulo);
  }, [uidModulo, urlSeccion, puedeCargar]);

  // El módulo de la URL queda como módulo actual (store + localStorage)
  useEffect(() => {
    if (!modulo?.uid || !modulo.modulo.url || moduloActual?.uid_modulo === modulo.uid) return;
    seleccionarModuloActual({ uid_modulo: modulo.uid, id: modulo.id, url: modulo.modulo.url, label: modulo.modulo.label });
  }, [modulo?.uid]);

  // 1. Sin sesión → login (antes de cualquier carga)
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  // 2. url_modulo con formato inválido (ej. un uid o un id de las URLs anteriores) → home
  if (!formatoValido) return <Navigate to="/home" replace />;

  if (loadingModulos) return <LoadingOverlay texto='Cargando módulos' />;
  // 3. Ningún módulo del usuario tiene esa url (o todavía no tiene uid) → home
  if (!modulo || !uidModulo) return <Navigate to="/home" replace />;

  // Al cambiar de módulo sin recargar (ej. desde "Mis módulos"), en el primer render las secciones del
  // store todavía son del módulo anterior: se espera a que lleguen las del nuevo
  const seccionesDeOtroModulo = secciones.some((s) => s.id_modulouser !== modulo.id);
  if (loadingSecciones || seccionesDeOtroModulo) return <LoadingOverlay texto='Cargando secciones' />;
  if (secciones.length === 0) return <Navigate to="/home" replace />;

  // 4. Sin sección, o una que no es del módulo → primera sección (los perfiles los valida ProfileGuard)
  const primeraSeccion = `/${url_modulo}/${secciones[0].seccion.url}`;
  const esPerfil = RUTAS_PERFIL.includes(urlSeccion);
  if (!urlSeccion || (!esPerfil && !hasSeccion(urlSeccion, modulo.id, secciones))) {
    return <Navigate to={primeraSeccion} replace />;
  }

  // Sección marcada en mantenimiento: se muestra el aviso en lugar de la página
  const seccionActual = secciones.find((s) => s.seccion.url.replace(/^\//, '') === urlSeccion);
  const enMantenimiento = seccionActual?.seccion.is_seccion_mantenimiento ? seccionActual.seccion.label : null;

  return <VerticalLayout misSecciones={secciones} seccionEnMantenimiento={enMantenimiento} />;
}
