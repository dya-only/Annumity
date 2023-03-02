import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'
import ReactPlayer from 'react-player'

import Nav from './nav_default'

function MyPage() {

  const [week, setWeek] = useState('')
  const [infoSection, setInfoSection] = useState('wish')
  const [isWishBtn, setIsWishBtn] = useState('mp_wish')
  const [isWatchedBtn, setIsWatchedBtn] = useState('')
  const [pageLoading, setPageLoading] = useState(true)

  const WishBtnEvent = () => {
    setInfoSection('wish')
    setIsWishBtn('mp_wish')
    setIsWatchedBtn('')
  }
  const WatchedBtnEvent = () => {
    setInfoSection('watched')
    setIsWatchedBtn('watched')
    setIsWishBtn('')
  }

  const getUserDB = async () => {
    const res = await fetch(`/api/db/view?email=${sessionStorage.getItem('Email')}`, {
      method: 'GET',
      headers: {
          "Content-Type": "application/json",
      },
    })
    const data = await res.json()

    console.log(data)
  }

  useEffect(() => {
    const day = new Date()
    const WeekDay = ['일', '월', '화', '수', '목', '금', '토']
    setWeek(WeekDay[day.getDay()])

    getUserDB()

    setIsWishBtn('mp_wish')
    setTimeout(() => setPageLoading(false), 1000);
  }, [])

  return (
    <Fragment>
      <Nav />

      <main className='mypage_main'>

        {/* Profile Component */}
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

        {/* Info Section */}
        <div className="section-selector">
          <button className={`section-btn ${isWishBtn}`} onClick={WishBtnEvent}>보고싶다</button>
          <button className={`section-btn ${isWatchedBtn}`} onClick={WatchedBtnEvent}>정주행완료</button>
        </div>
        { infoSection == 'wish' ?
          <div className="wish-contents">
            wish Contents
          </div>
        :
          <div className="watched-contents">
            watched Contents
          </div>
        }
      </main>
    </Fragment>
  )
}

export default MyPage