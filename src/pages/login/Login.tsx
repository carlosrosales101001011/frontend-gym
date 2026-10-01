import IconCR from '@/components/Icons/IconCR'
import { useThemeStore } from '@/components/TopBar/useThemeStore'
import { LoginBrand } from '@/pages/login/components/LoginBrand'
import { LoginForm } from '@/pages/login/components/LoginForm'

/** El panel del logo siempre es negro; el formulario sigue el modo nocturno/claro */
export const Login = () => {
  const { theme, toggleTheme } = useThemeStore()
  const labelTema = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo nocturno'

  return (
    <div className="login">
      <LoginBrand/>
      <main className="login__main">
        <button
          type="button"
          className="login__theme"
          onClick={toggleTheme}
          title={labelTema}
          aria-label={labelTema}
        >
          <IconCR name={theme === 'dark' ? 'sun' : 'moon'} size={18}/>
        </button>
        <LoginForm/>
        <footer className="login__footer">© {new Date().getFullYear()} Tribu1 · Centro de entrenamiento</footer>
      </main>
    </div>
  )
}
