import React from 'react'
import { Outlet } from 'react-router-dom'

export const ModuloLayout = () => {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Outlet/>
    </div>
  )
}
