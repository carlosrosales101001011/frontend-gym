import { capitalizar } from "@/helpers/capitalize";
import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { LogoEmpresa } from "@/components/LogoEmpresa/LogoEmpresa";

type Props = {
  items: MenuItemType[];
  isOpenSideBar:boolean;
};

export type MenuItemType = {
  id_modulouser: number;
  id_seccion: number;

  seccion: {
    id: number;
    subSeccion: string;
    label: string;
    url: string;
  };
};

const LeftSidebar: React.FC<Props> = ({ items }) => {
  const urlPath = location.pathname;
  // Los enlaces usan la url del módulo de la URL (/:url_modulo/:seccion)
  const { url_modulo } = useParams();
  const rutaSeccion = (item: MenuItemType) => `/${url_modulo}/${item.seccion.url}`;

  // AGRUPAR POR SUBSECTION
  const groupedItems = useMemo(() => {
    return items.reduce<Record<string, MenuItemType[]>>((acc, item) => {
      const key = item.seccion.subSeccion;

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(item);

      return acc;
    }, {});
  }, [items]);
  return (
    <aside className="w-100 h-100">
      {/* Con el sidebar abierto el logo va aquí; cerrado, en el topbar */}
      <div className="sidebar__logo">
        <LogoEmpresa alto={40} />
      </div>
      {Object.entries(groupedItems).map(([subSeccion, sections]) => {
        return (
          <div key={subSeccion}>
            {/* HEADER */}
            <div
              className="menu-link cursor-default flex justify-between items-center cursor text-uppercase mt-4 text-white"
              style={{fontSize: '13px'}}
            >
                {subSeccion}
            </div>

            {/* ITEMS */}
            <div className="d-flex flex-column">
              {sections.map(item => (
                  <Link
                    key={`${item.id_modulouser}-${item.id_seccion}-${item.seccion.id}`}
                    to={rutaSeccion(item)}
                    reloadDocument={rutaSeccion(item)===urlPath ? false : true}
                    className={`text-white fw-bold sidebar-link ${rutaSeccion(item)===urlPath ? 'sidebar-link-focus' : ''} `}
                    style={{textDecoration: 'none'}}
                  >
                    {capitalizar(item.seccion.label)}
                  </Link>
              ))}
            </div>
          </div>
        );
      })}
    </aside>
  );
};

export default LeftSidebar;