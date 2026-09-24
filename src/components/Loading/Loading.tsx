import { Modal } from 'react-bootstrap'
import { Oval } from 'react-loader-spinner'
export const Loading = ({show=true}) => {
  return (
    <Modal show={show} size='sm' centered>
        <div className='d-flex align-items-center justify-content-center'>
            <Oval
                height={80}
                width={80}
                color="#2b00ff"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor="#ffffff"
                strokeWidth={2}
                strokeWidthSecondary={2}
                />
        </div>
    </Modal>
  )
}
