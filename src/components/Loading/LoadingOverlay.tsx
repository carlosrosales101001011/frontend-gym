import { Oval } from 'react-loader-spinner'

type Props = {
  texto: string;
  show?: boolean;
  /** Cubre solo su contenedor (que debe tener position: relative) en vez de toda la pantalla */
  interno?: boolean;
}

export const LoadingOverlay = ({ texto, show = true, interno = false }: Props) => {
  if (!show) return null;
  // Dentro de una card el spinner es más chico para que quepa
  const tamano = interno ? 32 : 60;
  return (
    <div className={`loading-overlay ${interno ? 'loading-overlay--interno' : ''}`} role='status' aria-live='polite'>
      <div className='loading-overlay-content'>
        <Oval
          height={tamano}
          width={tamano}
          color="#2b00ff"
          secondaryColor="#ffffff"
          strokeWidth={2}
          strokeWidthSecondary={2}
          ariaLabel='oval-loading'
          visible={true}
        />
        <span className='loading-overlay-text'>{texto}</span>
      </div>
    </div>
  )
}
