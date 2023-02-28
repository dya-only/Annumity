import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'
import ReactPlayer from 'react-player'

import Nav from './nav_default'

function Index() {
  // const navigate = useNavigate()

  const [week, setWeek] = useState('')

  useEffect(() => {
    const day = new Date()
    const WeekDay = ['일', '월', '화', '수', '목', '금', '토']
    setWeek(WeekDay[day.getDay()])
  }, [])

  return (
    <Fragment>
      <Nav />

      <main className='mypage_main'>
        <div className="profile">
          <div className="profile_card">
            <img className='profile_bg_img' src={`images/maxresdefault.jpg`} alt="" />
            <img className='profile_img' src={`images/bg.png`} alt="" />
            <div className="profile_text">
              <div className="profile_name">{ sessionStorage.getItem('Account') || '로그인' }</div>
              <div className="profile_email">{ sessionStorage.getItem('Email') || '해줘요' }</div>
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  )
}

export default Index