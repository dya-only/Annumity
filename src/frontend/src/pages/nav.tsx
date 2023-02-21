import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

function Nav() {
  const [AccName, setAccName] = useState(typeof window !== 'undefined' ? sessionStorage.getItem('Account') : null)

  return (
    <nav className='_nav_'>
      <Link className='nav-link' to={'/'}>
        <div className="header-title">
          <img className='logo' src={`images/logo.png`} alt={''} />
          <div className="nav-title">애뉴미티</div>
        </div>
      </Link>
      { AccName == "" || AccName == null ?
      <Link to={'/login'}>
        <FontAwesomeIcon className="icon" icon={faRightToBracket} />
      </Link>
      : <button className='signOut' onClick={() => { sessionStorage.setItem("Account", ""); setAccName(""); sessionStorage.setItem("Email", "") }}>
          <div className="user-name">{ AccName }</div>
          <FontAwesomeIcon className="icon-out" icon={faRightFromBracket} />
        </button> }
    </nav>
  )
}

export default Nav