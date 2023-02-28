import { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

function Nav() {
  const [ScrollY, setScrollY] = useState(0)
  const [navStatus, setNavStatus] = useState('navtwo')
  const [logoStatus, setLogoStatus] = useState('logodark')
  const [titleStatus, setTitleStatus] = useState('nav-title')
  const [signStatus, setSignStatus] = useState('user-name')
  const [iconStatus, setIconStatus] = useState('icon')
  const [iconStatusOut, setIconStatusOut] = useState('icon-out')
  
  const [dropDownStatus, setDropDownStatus] = useState('dropdown-leave')

  const [AccName, setAccName] = useState(typeof window !== 'undefined' ? sessionStorage.getItem('Account') : null)

  const navigate = useNavigate()
  const toMyPage = () => {
    navigate('/mypage')
  }

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
            <div className="dropdown-mypage dropdown-item" onClick={ toMyPage }>마이페이지</div>
            <div className="dropdown-logout dropdown-item" onClick={() => { sessionStorage.setItem("Account", ""); setAccName(""); sessionStorage.setItem("Email", "") }}>로그아웃</div>
          </div>
        </button> }
    </nav>
  )
}

export default Nav