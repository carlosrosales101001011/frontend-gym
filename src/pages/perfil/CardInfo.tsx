import noAvatar from '@/assets/img/user-no-avatar.jpg'

export const CardInfo = () => {
  return (
    <div className='d-flex flex-column '>
      <img src={noAvatar} className='mx-auto mb-3' style={{height: '80px'}}/>
        <div className='my-1 text-center'>
          <span className='fs-4 color-mode-actual'>{'Carlos Rosales Morales'}</span>
        </div>
        <div className='my-3'>
          <div className='fw-bold'>Email:</div>
          <span className='text-break'>{`carlosrosales21092002@hotmail.com`} </span>
        </div>
        <div className='my-3'>
          <div className='fw-bold'>Telefono:</div>
          <span className='text-break'>{'933102718'}</span>
        </div>
    </div>
  )
}
