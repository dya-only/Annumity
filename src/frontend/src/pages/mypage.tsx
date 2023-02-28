import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'
import ReactPlayer from 'react-player'

import Nav from './nav'

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

      <main>
        <div className="">my page</div>
        <div className="">즐거운 { week }요일 입니다.</div>
      </main>
    </Fragment>
  )
}

export default Index