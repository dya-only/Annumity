import { Fragment, useEffect } from 'react'
export default function Loading() {

  useEffect(() => {
    sessionStorage.setItem('InfoWindow', 'false')
  }, [])

  return (
    <Fragment>
      <div className="loading">
        <img className='spinner' src={`images/logo.png`} alt="" />
      </div>
    </Fragment>
  )
}