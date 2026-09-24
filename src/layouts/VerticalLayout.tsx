import { Topbar } from '@/components/TopBar/Topbar'
import { Outlet } from 'react-router-dom'
import LeftSidebar from '@/layouts/LeftSidebar'
import {  useState } from 'react'
import { type SeccionType } from '@/routes/hook/useUserModuloStore'
type StateSideBar={
    isOpen: boolean;
}
type Props={
    misSecciones:SeccionType[];
}
const SIDEBAR_BREAKPOINT = 1250
export const VerticalLayout = ({misSecciones}:Props) => {
    const [isOpenSideBar, setisOpenSideBar] = useState<StateSideBar>(() => ({
        isOpen: window.innerWidth >= SIDEBAR_BREAKPOINT
    }))
    const onOpenSideBar = ()=>{
        setisOpenSideBar({isOpen: !isOpenSideBar.isOpen})
    }
    const onCloseSideBar = ()=>{
        setisOpenSideBar({isOpen: false})
    }
  return (
    <div>
        <div className={`d-flex flex-row sidebar ${isOpenSideBar.isOpen ? 'open' : 'closed'}`}>
            <LeftSidebar isOpenSideBar={isOpenSideBar.isOpen} items={misSecciones}/>
        </div>
        {isOpenSideBar.isOpen && (
            <div className="sidebar-overlay" onClick={onCloseSideBar}/>
        )}
        <div className={`principal-view ${isOpenSideBar.isOpen ? 'shift' : ''}`}>
            <Topbar onOpenSideBar={onOpenSideBar}/>
                <Outlet/>
        </div>
    </div>
  )
}
