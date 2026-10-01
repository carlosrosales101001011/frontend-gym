import logo from '@/assets/img/logo-empresa.jpg'

/** Panel del logo: el JPG tiene fondo negro sólido, por eso el panel es negro puro (#000) */
export const LoginBrand = () => {
  return (
    <aside className="login-brand">
      {/* Franjas decorativas inclinadas, como la cursiva del logo */}
      <span className="login-brand__franja login-brand__franja--1" aria-hidden />
      <span className="login-brand__franja login-brand__franja--2" aria-hidden />
      <span className="login-brand__franja login-brand__franja--3" aria-hidden />
      <img src={logo} alt="Tribu1 - Centro de entrenamiento" className="login-brand__logo"/>
    </aside>
  )
}
