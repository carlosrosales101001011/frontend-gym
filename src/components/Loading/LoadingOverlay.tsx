import { Oval } from 'react-loader-spinner'

type Props = {
  texto: string;
  show?: boolean;
}

export const LoadingOverlay = ({ texto, show = true }: Props) => {
  if (!show) return null;
  return (
    <div className='loading-overlay' role='status' aria-live='polite'>
      <div className='loading-overlay-content'>
        <Oval
          height={60}
          width={60}
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
