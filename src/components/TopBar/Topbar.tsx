import React from 'react'
import IconCR from '@/components/Icons/IconCR';
import { useNavigate } from 'react-router-dom';
import { useTitleStore } from '@/components/PageBreadCumb/useTitleStore';
import { useThemeStore } from '@/components/TopBar/useThemeStore';
type props = {
onOpenSideBar:()=>void;
}
export const Topbar = ({onOpenSideBar}:props) => {
  const navigate = useNavigate()
  const onOpenHome = ()=>{
    navigate('/home')
  }
  const title = useTitleStore((state) => state.title);
  const { theme, toggleTheme } = useThemeStore();
  return (
    <header className="sticky-top-bar topbar">
      {/* LEFT */}
      <div className="topbar__left">
        <button className="topbar__icon" onClick={()=>onOpenSideBar()}>
            <IconCR name='barburger' />
        </button>
        Usuario {'>'} {title}
      </div>
      {/* RIGHT */}
      <div className="topbar__right">
        <button
          className="topbar__icon me-2"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo nocturno'}
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo nocturno'}
        >
          <IconCR name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
        </button>
        <button onClick={()=>onOpenHome()}>Mis modulos</button>
      </div>
    </header>
  );
}
