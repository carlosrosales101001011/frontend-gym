import { capitalizar } from "@/helpers/capitalize";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";

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
                    to={`/${item.id_modulouser}/${item.seccion.url}`}
                    reloadDocument={`/${item.id_modulouser}/${item.seccion.url}`===urlPath ? false : true}
                    className={`text-white fw-bold sidebar-link ${`/${item.id_modulouser}/${item.seccion.url}`===urlPath ? 'sidebar-link-focus' : ''} `}
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