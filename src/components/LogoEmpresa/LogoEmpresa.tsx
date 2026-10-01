import logo from '@/assets/img/logo-empresa.jpg'

type LogoEmpresaProps = {
  /** Alto de la píldora en px (el ancho se ajusta solo) */
  alto?: number
  className?: string
}

/**
 * Logo de la empresa para barras (Topbar, header de módulos).
 * El JPG tiene fondo negro sólido: va dentro de una píldora negra para que en modo claro se vea intencional,
 * y se recorta el margen negro de arriba/abajo (object-fit: cover) para que el texto se lea en poco alto.
 * Estilos en assets/scss/custom/components/_LogoEmpresa.scss.
 */
export const LogoEmpresa = ({ alto = 32, className = '' }: LogoEmpresaProps) => (
  <span className={`logo-empresa ${className}`} style={{ height: alto, width: Math.round(alto * 3.6) }}>
    <img src={logo} alt="Tribu1 - Centro de entrenamiento" className="logo-empresa__img" />
  </span>
)
