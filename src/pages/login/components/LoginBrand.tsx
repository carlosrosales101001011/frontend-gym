import noLogo from '@/assets/img/logo-empresa.jpg'

export const LoginBrand = () => {
  return (
    <aside className="login-brand">
      <div className="login-brand__content" >
        <img src={noLogo} alt="Logo" className="login-brand__logo"/>
      </div>
    </aside>
  )
}
