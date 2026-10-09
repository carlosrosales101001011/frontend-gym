import { FaUser, FaHome, FaCog, FaCheck, FaTimes, FaQuestion, FaLock } from "react-icons/fa";
import { MdDashboard, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight, MdOutlineImageNotSupported } from "react-icons/md";
import type { IconType } from 'react-icons';
import { LuArrowDown, LuArrowUp, LuArrowUpDown } from "react-icons/lu";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { IoDuplicateOutline, IoReload } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { BiExport } from "react-icons/bi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AiOutlineFilter } from "react-icons/ai";
import { FaRegSnowflake } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { MdFavoriteBorder } from "react-icons/md";
import { LuShoppingBasket } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { BsBoxes } from "react-icons/bs";
import { FaSquarePollVertical } from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { GoTasklist } from "react-icons/go";
import { GrSystem } from "react-icons/gr";
import { TiShoppingBag } from "react-icons/ti";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineBarChart, MdOutlineDarkMode, MdOutlineLightMode, MdOutlineNotifications, MdOutlineTableChart, MdPowerSettingsNew } from "react-icons/md";
import { PiCirclesFourFill } from "react-icons/pi";
import { MdWifi, MdWifi2Bar, MdWifiOff } from "react-icons/md";
import { MdZoomIn, MdZoomOut, MdRotateLeft, MdRotateRight } from "react-icons/md";
import { MdCardMembership, MdOutlineFolder, MdOutlineComment, MdOutlineContactPhone } from "react-icons/md";
import { MdOutlineFileDownload, MdOutlineFileUpload } from "react-icons/md";
import { FaRegFile, FaRegFileExcel, FaRegFileImage, FaRegFilePdf, FaRegFileWord } from "react-icons/fa";
import { MdStar, MdStarBorder, MdPushPin, MdOutlinePushPin, MdDragIndicator, MdOutlineViewList, MdAccessTime, MdCardGiftcard } from "react-icons/md";

export type IconName =
  | "user"
  | "home"
  | "settings"
  | "dashboard"
  | 'arrowUpDown'
  | 'arrowUp'
  | 'arrowDown'
  | 'doubleArrowLeft'
  | 'doubleArrowRight'
  | 'arrowRight'
  | 'arrowLeft'
  | 'delete'
  | 'edit'
  | 'copy'
  | 'updating'
  | 'threeDotsVertical'
  | 'plus'
  | 'exports'
  | 'eye'
  | 'eyeOff'
  | 'filtro'
  | 'freeze'
  | 'barburger'
  | 'search'
  | 'heart'
  | 'sales'
  | 'users'
  | 'apple'
  | 'boxes'
  | 'reporte'
  | 'email'
  | 'check'
  | 'emailCorp'
  | 'task'
  | 'configSistem'
  | 'bag'
  | 'calendar'
  | 'no-icon'
  | 'trash'
  | 'times'
  | 'question'
  | 'sun'
  | 'moon'
  | 'modulos'
  | 'power'
  | 'notificaciones'
  | 'grafica'
  | 'tabla'
  | 'lock'
  | 'wifi'
  | 'wifiLento'
  | 'wifiOff'
  | 'zoomIn'
  | 'zoomOut'
  | 'rotateLeft'
  | 'rotateRight'
  | 'membresia'
  | 'carpeta'
  | 'comentarios'
  | 'contactoTelefono'
  | 'descargar'
  | 'subir'
  | 'archivo'
  | 'archivoPdf'
  | 'archivoImagen'
  | 'archivoWord'
  | 'archivoExcel'
  | 'estrella'
  | 'estrellaVacia'
  | 'fijado'
  | 'fijadoVacio'
  | 'arrastrar'
  | 'secciones'
  | 'reloj'
  | 'regalo';

const icons: Record<IconName, IconType> = {
  user: FaUser,
  home: FaHome,
  settings: FaCog,
  dashboard: MdDashboard,
  arrowUpDown: LuArrowUpDown,
  arrowUp: LuArrowUp,
  arrowDown: LuArrowDown,
  doubleArrowLeft: MdKeyboardDoubleArrowLeft,
  doubleArrowRight: MdKeyboardDoubleArrowRight,
  arrowLeft: MdKeyboardArrowLeft,
  arrowRight: MdKeyboardArrowRight,
  delete: FaRegTrashCan,
  edit: FaEdit,
  copy: IoDuplicateOutline,
  updating: IoReload,
  threeDotsVertical: BsThreeDotsVertical,
  plus: GoPlus,
  exports: BiExport,
  eye: FaEye,
  eyeOff: FaEyeSlash,
  filtro: AiOutlineFilter,
  freeze: FaRegSnowflake,
  barburger: FaBars,
  search: IoSearch,
  heart: MdFavoriteBorder,
  sales: LuShoppingBasket,
  users: FaUsers,
  apple: FaApple,
  boxes: BsBoxes,
  reporte: FaSquarePollVertical,
  email: MdOutlineMail,
  check: FaCheck,
  emailCorp: MdEmail,
  task: GoTasklist,
  configSistem: GrSystem,
  bag: TiShoppingBag,
  calendar: FaRegCalendarAlt,
  'no-icon': MdOutlineImageNotSupported,
  trash: FaRegTrashAlt,
  times: FaTimes,
  question: FaQuestion,
  sun: MdOutlineLightMode,
  moon: MdOutlineDarkMode,
  modulos: PiCirclesFourFill,
  power: MdPowerSettingsNew,
  notificaciones: MdOutlineNotifications,
  grafica: MdOutlineBarChart,
  tabla: MdOutlineTableChart,
  lock: FaLock,
  wifi: MdWifi,
  wifiLento: MdWifi2Bar,
  wifiOff: MdWifiOff,
  zoomIn: MdZoomIn,
  zoomOut: MdZoomOut,
  rotateLeft: MdRotateLeft,
  rotateRight: MdRotateRight,
  membresia: MdCardMembership,
  carpeta: MdOutlineFolder,
  comentarios: MdOutlineComment,
  contactoTelefono: MdOutlineContactPhone,
  descargar: MdOutlineFileDownload,
  subir: MdOutlineFileUpload,
  archivo: FaRegFile,
  archivoPdf: FaRegFilePdf,
  archivoImagen: FaRegFileImage,
  archivoWord: FaRegFileWord,
  archivoExcel: FaRegFileExcel,
  estrella: MdStar,
  estrellaVacia: MdStarBorder,
  fijado: MdPushPin,
  fijadoVacio: MdOutlinePushPin,
  arrastrar: MdDragIndicator,
  secciones: MdOutlineViewList,
  reloj: MdAccessTime,
  regalo: MdCardGiftcard,
};

type Props = {
  name: IconName;
  size?: number;
  className?: string;
};

export default function IconCR({ name,
  size = 20,
  className='icon-mode-actual' }: Props) {
  const Icon = icons[name]||icons['no-icon'];
  return <Icon size={size} className={className} />;
}

