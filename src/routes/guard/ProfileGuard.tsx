import {  Outlet, useLocation, useParams } from "react-router-dom";
import { useUserModuloStore } from "@/routes/hook/useUserModuloStore";
type props = {
    gestion: string;
}
export const ProfileGuard = ({gestion}:props) => {
  console.log({g: `/sss`});
  const { uid_mod } = useParams();
  const location = useLocation();
  const [, , urlSeccion, uid_perfil] = location.pathname.split('/');
  const { hasSeccion } = useUserModuloStore();
  return (
    <>
      <Outlet/>
    </>
  )
}


