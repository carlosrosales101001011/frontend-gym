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
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

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
  | 'lock';

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
  lock: FaLock
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

