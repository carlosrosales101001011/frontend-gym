import React, { useEffect, useMemo, useState } from 'react';
import { BuscadorGlobal } from '@/components/BuscadorGlobal/BuscadorGlobal';
import { useSelector } from 'react-redux';
import type { RootState } from '@/stores/Store';
import type { moduloProps } from '@/routes/store/moduloSlice';
import { usePermisosStore } from '@/hook/usePermisosStore';
import IconCR from '@/components/Icons/IconCR';
import getDateHoy from '@/helpers/getDateHoy';
import { useAuth } from '@/hook/useAuth';
import { useSesionStore } from '@/hook/useSesionStore';
import { useUbicacionUsuario } from '@/hook/useUbicacionUsuario';
import { useIrAModulo } from '@/hook/useIrAModulo';
import { IconosTopbar } from '@/components/TopBar/IconosTopbar';
import { LogoEmpresa } from '@/components/LogoEmpresa/LogoEmpresa';
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay';
import { ID_TIPO_MODULO_EMPRESARIAL } from '@/stores/permisos/permisoSlice';

/**
 * NOTA DE INTEGRACIÓN
 * --------------------
 * El diseño de referencia muestra datos que hoy no existen en `moduloProps`
 * (contador de secciones, badges tipo "12 por aprobar", flag de "sin acceso",
 * usuario/planta/fecha del header). Para no inventar campos en tu store,
 * este componente los lee de forma opcional con `as any` y cae a valores
 * vacíos si no vienen. Cuando el backend los exponga, basta con tipar
 * `moduloProps` con esos campos y quitar los casts.
 *
 * Campos opcionales esperados por módulo (todos opcionales):
 *  - badge_texto?: string       -> "12 por aprobar", "3 bajo mínimo"
 *  - secciones?: number         -> "6" en la esquina de la tarjeta
 *  - sin_acceso?: boolean       -> pinta la tarjeta como bloqueada
 *  - notificaciones?: number    -> burbuja verde en módulos personales
 */

type ModuloExtra = {
  badge_texto?: string;
  secciones?: number;
  sin_acceso?: boolean;
  notificaciones?: number;
};

const withExtra = (m: moduloProps) => m as moduloProps & ModuloExtra;

export const ModulosHome: React.FC = () => {
  const [selected, setSelected] = useState<number>(0);
  const { obtenerModulos, loadingModulos } = usePermisosStore();
  const { modulos } = useSelector((state: RootState) => state.PERMISO);

  useEffect(() => {
    obtenerModulos();
  }, []);

  const entrarAModulo = useIrAModulo();
  const irAModulo = (modulo: moduloProps) => {
    if (entrarAModulo(withExtra(modulo))) setSelected(modulo.id);
  };

  // const favoritos = useMemo(() => modulos.filter((f) => f.is_favorito), [modulos]);
  const empresariales = useMemo(() => modulos.filter((f) => f.modulo?.id_tipo === ID_TIPO_MODULO_EMPRESARIAL), [modulos]);
  // const personales = useMemo(() => modulos.filter((f) => f.modulo?.id_tipo === 2013), [modulos]);

  const fechaHoy = useMemo(() => {
    const { anio, dia, date, mes, hora, minuto } = getDateHoy();
    return `${dia} ${date} ${mes} ${anio} · ${hora}:${minuto.toString().padStart(2, '0')}`;
  }, []);

  // Distrito y ciudad del navegador del usuario; '' si no da permiso de ubicación
  const ubicacion = useUbicacionUsuario();
  const { nombreUsuario, obtenerUsuarioSesion } = useSesionStore();
  // Mientras /user/me (con guard) responde se ve un skeleton en lugar del nombre
  const [cargandoNombre, setCargandoNombre] = useState(true);
  useEffect(() => {
    obtenerUsuarioSesion().finally(() => setCargandoNombre(false));
  }, []);
  // Borra el token de localStorage; AuthGuard redirige solo a /login
  const { logout } = useAuth();

  return (
    <div className="nk-home">
      <style>{nkStyles}</style>
      <LoadingOverlay show={loadingModulos} texto='Cargando módulos' />

      {/* Arriba de todo, encima del logo (Ctrl+K lo enfoca); en la misma fila, a la derecha, los íconos del Topbar */}
      <div className="nk-buscador">
        
        <div className="nk-header-iconos">
          <IconosTopbar />
        </div>
      </div>

      <header className="nk-header">
        <div className="nk-logo">
          <LogoEmpresa alto={56} />
        </div>
        
      </header>
      <div className="nk-buscador-campo">
          <BuscadorGlobal />
        </div>
      {/* Fijo abajo a la derecha; en mobile queda solo el ícono */}
      <button type="button" className="nk-logout" onClick={logout} title="Cerrar sesión" aria-label="Cerrar sesión">
        <IconCR name="power" size={18} className="nk-logout-icon" />
        <span className="nk-logout-text">Cerrar sesión</span>
      </button>

      <main className="nk-main">
        <div className="nk-welcome">
          <div>
            <span className="nk-eyebrow">Bienvenido</span>
            <h1 className="nk-title">
              {/* Si ya estaba en el store (ej. al volver de un módulo) se muestra sin esperar */}
              {nombreUsuario || (cargandoNombre && <span className="skeleton-cr nk-title-skeleton" aria-label="Cargando usuario" />)}
            </h1>
          </div>
          <div className="nk-meta">{fechaHoy}{ubicacion && ` · ${ubicacion}`}</div>
        </div>
        {/* <section className="nk-section">
          <div className="nk-section-head">
            <span className="nk-section-label">
              <IconCR name="heart" size={16} />
              Favoritos
              <span className="nk-count-pill">{favoritos.length} anclados</span>
            </span>
          </div>
          <div className="nk-fav-grid">
            {favoritos.map((opt) => (
              <FavoritoCard key={opt.id} opt={opt} isActive={selected === opt.id} onClick={irAModulo} />
            ))}
            <button className="nk-fav-add" type="button">
              <span>☆</span>
              Anclar otro módulo
            </button>
          </div>
        </section> */}

        <div className="nk-columns">
          <section className="nk-section">
            <div className="nk-section-head">
              {/* <span className="nk-section-label color-mode-actual">
                <IconCR name="bag" size={16} />
                Módulos empresariales
                <span className="nk-count-pill">
                  {empresariales.length}
                  {totalSeccionesEmpresariales ? ` · ${totalSeccionesEmpresariales} secciones` : ''}
                </span>
              </span> */}
            </div>
            <div className="nk-modulo-grid">
              {empresariales.map((opt) => (
                <ModuloCard key={opt.id} opt={opt} isActive={selected === opt.id} onClick={irAModulo} />
              ))}
            </div>
          </section>

          {/* <aside className="nk-sidebar">
            <section className="nk-section">
              <div className="nk-section-head">
                <span className="nk-section-label">
                  <IconCR name="user" size={16} />
                  Módulos personales
                  <span className="nk-count-pill">{personales.length}</span>
                </span>
              </div>
              <div className="nk-personal-list">
                {personales.map((opt) => (
                  <PersonalItem key={opt.id} opt={opt} isActive={selected === opt.id} onClick={irAModulo} />
                ))}
              </div>
            </section>
          </aside> */}
        </div>
      </main>
    </div>
  );
};

type ItemClickProps = {
  opt: moduloProps;
  isActive: boolean;
  onClick: (m: moduloProps) => void;
};

// const FavoritoCard: React.FC<ItemClickProps> = ({ opt, isActive, onClick }) => {
//   const color = colorPorTexto(opt.modulo.label);
//   // const extra = withExtra(opt);
//   return (
//     <button
//       type="button"
//       className={`nk-fav-card${isActive ? ' is-active' : ''}`}
//       onClick={() => onClick(opt)}
//       style={{ borderColor: isActive ? color.fg : undefined }}
//     >
//       <span className="nk-fav-star">★</span>
//       <span className="nk-icon-badge" style={{ background: color.fg }}>
//         <IconCR name={opt.modulo.icono || 'no-icon'} size={20} />
//       </span>
//       <span className="nk-fav-title">{opt.modulo.label}</span>
//       {/* {opt.modulo.descripcion && <span className="nk-fav-desc">{opt.modulo.descripcion}</span>} */}
//       {/* {extra.badge_texto && <span className="nk-fav-badge" style={{ color: color.fg }}>{extra.badge_texto}aaaa</span>} */}
//     </button>
//   );
// };

const ModuloCard: React.FC<ItemClickProps> = ({ opt, isActive, onClick }) => {
  const extra = withExtra(opt);
  const bloqueado = !!extra.sin_acceso;
  return (
    <button
      type="button"
      className={`nk-mod-card${isActive ? ' is-active' : ''}${bloqueado ? ' is-locked' : ''} card-mode-actual`}
      onClick={() => onClick(opt)}
      disabled={bloqueado}
    >
      <div className="nk-mod-top">
        <span className={`nk-icon-badge nk-icon-badge--sm icono-modulo${bloqueado ? ' icono-modulo--bloqueado' : ''}`}>
          <IconCR name={opt.modulo.icono || 'no-icon'} size={18} className="" />
        </span>
      </div>
      <div className='d-flex flex-column'>
        <span className="nk-mod-title">{opt.modulo.label}</span>
        {
          opt.modulo.descripcion && <span className="nk-mod-desc">{opt.modulo.descripcion}</span>
        }
      </div>
    </button>
  );
};

// const PersonalItem: React.FC<ItemClickProps> = ({ opt, isActive, onClick }) => {
//   const color = colorPorTexto(opt.modulo.label);
//   return (
//     <button type="button" className={`nk-personal-item${isActive ? ' is-active' : ''}`} onClick={() => onClick(opt)}>
//       <span className="nk-icon-badge nk-icon-badge--sm" style={{ background: color.bg, color: color.fg }}>
//         <IconCR name={opt.modulo.icono || 'no-icon'} size={16} />
//       </span>
//       <span className="nk-personal-text">
//         <span className="nk-personal-title">{opt.modulo.label}</span>
//         {opt.modulo.descripcion && <span className="nk-personal-desc">{opt.modulo.descripcion}</span>}
//       </span>
//     </button>
//   );
// };

const nkStyles = `
.nk-home {
  min-height: 100vh;
  color: #1F2421;
}
.nk-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center; /* solo lleva el logo de la empresa, centrado */
  gap: 24px;
  padding: 9px 28px;
}
.nk-logo { display: flex; align-items: center; gap: 10px; }
.nk-buscador {
  display: grid;
  /* Buscador centrado en la columna del medio; íconos alineados a su altura en la de la derecha */
  grid-template-columns: 1fr minmax(0, 720px) 1fr;
  align-items: center;
  gap: 16px;
  padding: 20px 28px 4px;
}
.nk-buscador-campo { grid-column: 2; min-width: 0; }
.nk-header-iconos { grid-column: 3; justify-self: end; }
@media (max-width: 767.98px) {
  .nk-buscador { grid-template-columns: minmax(0, 1fr) auto; gap: 10px; padding: 14px 16px 4px; }
  .nk-buscador-campo { grid-column: 1; }
  .nk-header-iconos { grid-column: 2; }
}

.nk-logout {
  position: fixed; right: 24px; bottom: 24px; z-index: 1030;
  display: inline-flex; align-items: center; gap: 8px;
  height: 44px; padding: 0 18px 0 14px;
  border: none; border-radius: 999px;
  background: var(--bs-primary); cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
}
.nk-logout, .nk-logout * { color: #fff !important; }
.nk-logout:hover { filter: brightness(0.9); transform: translateY(-2px); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3); }
.nk-logout:active { transform: translateY(0); }
.nk-logout-text { font-size: 13px; font-weight: 600; }

.nk-main { max-width: 1320px; margin: 0 40px; padding: 10px; }
.nk-welcome { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px; }
.nk-eyebrow { font-size: 11px; letter-spacing: 0.08em; color: #A6A192; font-weight: 700; text-transform: uppercase; }
.nk-title { font-size: 30px; margin: 4px 0 0; font-weight: 700; }
.nk-title-skeleton { display: inline-block; width: 260px; max-width: 70vw; height: 30px; vertical-align: middle; }
.nk-meta { font-size: 13px; color: #8B8B83; }

.nk-section { margin-bottom: 28px; }
.nk-section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.nk-section-label {
  display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase; color: #1F2421;
}
.nk-section-label--muted { color: #8B8B83; }
.nk-count-pill { font-weight: 500; text-transform: none; color: #A6A192; letter-spacing: 0; }

.nk-fav-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; }
.nk-fav-card, .nk-fav-add {
  position: relative; text-align: center; border-radius: 12px; padding: 16px;
  display: flex; flex-direction: row; gap: 6px; cursor: pointer;
}
.nk-fav-card {
  background: #EEF6F0; border: 1px solid #DCEBDF; min-height: 80px;
}
.nk-fav-card.is-active { box-shadow: 0 0 0 2px rgba(30,122,82,0.25); }
.nk-fav-star { position: absolute; top: 12px; right: 14px; color: #1E7A52; font-size: 13px; }
.nk-fav-title { font-weight: 700; font-size: 14px; margin-top: 2px; }
.nk-fav-desc { font-size: 12px; color: #6E7A72; }
.nk-fav-badge { font-size: 12px; font-weight: 600; margin-top: 4px; }
.nk-fav-add {
  border: 1.5px dashed #DDD8CB; background: transparent; align-items: center; justify-content: center;
  color: #A6A192; font-size: 13px; min-height: 80px;
}
.nk-fav-add span:first-child { font-size: 18px; margin-bottom: 4px; }

// .nk-columns { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
.nk-modulo-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.nk-mod-card {
  text-align: left; background: #fff; border: 1px solid #EBE7DD; border-radius: 12px;
  padding: 14px; display: flex; flex-direction: row; gap: 6px; cursor: pointer; min-height: 104px;
}
.nk-mod-card:hover { border-color: #C9E3D2; }
.nk-mod-card.is-active { border-color: #1E7A52; box-shadow: 0 0 0 1px #1E7A52; }
.nk-mod-card.is-locked { cursor: not-allowed; background: #FBFAF6; color: #A6A192; }
.nk-mod-top { display: flex; align-items: flex-start; justify-content: space-between; }
.nk-mod-title { font-weight: 700; font-size: 16px; line-height: 1.25; color: var(--bs-primary); }
.nk-mod-card.is-locked .nk-mod-title { color: inherit; }
.nk-mod-desc { font-size: 11.5px; color: #8B8B83; }
.nk-count-badge {
  background: #F5F3EC; color: #6E6A5C; font-size: 11px; font-weight: 700;
  border-radius: 999px; padding: 1px 8px;
}
.nk-locked-pill {
  background: #F0EEE6; color: #A6A192; font-size: 10.5px; font-weight: 600;
  border-radius: 999px; padding: 2px 8px;
}

.nk-icon-badge {
  width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; color: #fff;
}
.nk-icon-badge--sm { width: 30px; height: 30px; border-radius: 8px; }

.nk-sidebar { display: flex; flex-direction: column; gap: 20px; }
.nk-personal-list { display: flex; flex-direction: column; gap: 8px; background: #fff; border: 1px solid #EBE7DD; border-radius: 12px; padding: 6px; }
.nk-personal-item {
  display: flex; align-items: center; gap: 10px; background: transparent; border: none; border-radius: 8px;
  padding: 8px; cursor: pointer; text-align: left;
}
.nk-personal-item:hover { background: #F5F3EC; }
.nk-personal-item.is-active { background: #EEF6F0; }
.nk-personal-text { display: flex; flex-direction: column; flex: 1; }
.nk-personal-title { font-size: 13px; font-weight: 600; }
.nk-personal-desc { font-size: 11px; color: #8B8B83; }

@media (max-width: 960px) {
  .nk-columns { grid-template-columns: 1fr; }
  .nk-modulo-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .nk-header { flex-wrap: wrap; }
  .nk-logout { right: 16px; bottom: 16px; width: 48px; height: 48px; padding: 0; justify-content: center; }
  .nk-logout-text { display: none; }
  .nk-modulo-grid { grid-template-columns: 1fr; }
}
`;

export default ModulosHome;