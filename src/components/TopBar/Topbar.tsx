import React from 'react'
import IconCR from '@/components/Icons/IconCR';
import { useTitleStore } from '@/components/PageBreadCumb/useTitleStore';
import { LogoEmpresa } from '@/components/LogoEmpresa/LogoEmpresa';
import { MisModulos } from '@/components/TopBar/MisModulos';
import { IconosTopbar } from '@/components/TopBar/IconosTopbar';
import { NombreModulo } from '@/components/TopBar/NombreModulo';
import { NombreUsuario } from '@/components/TopBar/NombreUsuario';
import { BuscadorGlobal } from '@/components/BuscadorGlobal/BuscadorGlobal';
type props = {
onOpenSideBar:()=>void;
/** Con el sidebar abierto el logo va en el sidebar; cerrado, aquí */
isOpenSideBar?: boolean;
}
export const Topbar = ({onOpenSideBar, isOpenSideBar = false}:props) => {
  const title = useTitleStore((state) => state.title);
  return (
    <header className="sticky-top-bar topbar">
      {/* LEFT */}
      <div className="topbar__left">
        <button className="topbar__icon" onClick={()=>onOpenSideBar()}>
            <IconCR name='barburger' />
        </button>
        {!isOpenSideBar && <LogoEmpresa alto={32} />}
        <NombreModulo /> {'>'} {title}
        {/* Mismo buscador del Home (pantallas y clientes); Ctrl+K lo enfoca */}
        <div className="topbar__buscador">
          <BuscadorGlobal compacto />
        </div>
      </div>
      {/* RIGHT */}
      <div className="topbar__right">
        <NombreUsuario />
        <IconosTopbar />
        <MisModulos />
      </div>
    </header>
  );
}
