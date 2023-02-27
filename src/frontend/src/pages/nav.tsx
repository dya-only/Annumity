import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

function Nav() {
  const [ScrollY, setScrollY] = useState(0)
  const [navStatus, setNavStatus] = useState('navinit')
  const [logoStatus, setLogoStatus] = useState('logoinit')
  const [titleStatus, setTitleStatus] = useState('nav-title-white')
  const [signStatus, setSignStatus] = useState('user-name-white')
  const [iconStatus, setIconStatus] = useState('icon-white')
  const [iconStatusOut, setIconStatusOut] = useState('icon-out-white')
  
  const [dropDownStatus, setDropDownStatus] = useState('dropdown-leave')

  const [AccName, setAccName] = useState(typeof window !== 'undefined' ? sessionStorage.getItem('Account') : null)

  const handleFollow = () => {
    setScrollY(window.pageYOffset)

    if (ScrollY > 100 && ScrollY < 500) {
      setNavStatus("navone")
      setLogoStatus("logodark")
      setTitleStatus("nav-title")
      setIconStatus("icon")
      setIconStatusOut("icon-out")
      setSignStatus("user-name")
    } else if (ScrollY > 500) {
      setNavStatus("navtwo")
    } else {
      setNavStatus("navinit")  // use scroll down view
      setLogoStatus("logoinit")
      setTitleStatus("nav-title-white")
      setIconStatus("icon-white")
      setIconStatusOut("icon-out-white")
      setSignStatus("user-name-white")
    }
  }

  useEffect(() => {
    const watch = () => {
      window.addEventListener('scroll', handleFollow)
    }
    watch()
    return () => {
      window.removeEventListener('scroll', handleFollow)
    }
  })

  return (
    <nav className={ navStatus }>
      <Link className='nav-link' to={'/'}>
        <div className="header-title">
          <img className={ logoStatus } src={`images/logo.png`} alt={''} />
          <div className={ titleStatus }>애뉴미티</div>
        </div>
      </Link>
      { AccName == "" || AccName == null ?
      <Link to={'/login'}>
        <FontAwesomeIcon className={ iconStatus } icon={faRightToBracket} />
      </Link>
      : <button className='signOut' onMouseEnter={() => { setDropDownStatus('dropdown-enter') }} onMouseLeave={() => { setDropDownStatus('dropdown-leave') }}>
          <div className={ signStatus }>{ AccName }</div>
          {/* <FontAwesomeIcon className={ iconStatusOut } icon={faRightFromBracket} /> */}
          <div className={ dropDownStatus }>
            <div className="dropdown-mypage dropdown-item">마이페이지</div>
            <div className="dropdown-logout dropdown-item" onClick={() => { sessionStorage.setItem("Account", ""); setAccName(""); sessionStorage.setItem("Email", "") }}>로그아웃</div>
          </div>
        </button> }
    </nav>
  )
}

export default Nav