import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faArrowRight, faMagnifyingGlass, faArrowLeft, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'
import ReactPlayer from 'react-player'
import axios from 'axios'

import Nav from './nav'
import Loading from './loading'

function Index() {
  const navigate = useNavigate()

  const [daily, setDaily] = useState({
    data: [], images: [], ids: []
  })
  // const [images, setImages] = useState([])
  const [searchSel, setSearchSel] = useState({
    name: '',
    img: ''
  })
  const [searchSeries, setSearchSeries] = useState([])
  const [searchRelated, setSearchRelated] = useState([])
  const [bgVideo, setBgVideo] = useState('')

  const [selectedInfo, setSelectedInfo] = useState({
    id: '',
    name: '',
    img: '',
    content: '',
    distribute: '',
    year_quarter: '',
    age: '',
    genres: []
  })

  const [open , setOpen] = useState(false)
  let PropTitle: string = ""

  const [openSearch, setOpenSearch] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  let searchValue2 = ""

  const [week, setWeek] = useState('')
  const [Load, setLoad] = useState(true)
  const [windowLoad, setWindowLoad] = useState(true)
  const horizontalScrollRef = useRef<null | any>(null)

  const handleNextButtonClick = (nextType: 'prev' | 'next') => {
    if (!horizontalScrollRef.current) return;
      if (nextType === 'prev') {
        horizontalScrollRef.current.scrollTo({
          left: horizontalScrollRef.current.scrollLeft - horizontalScrollRef.current.offsetWidth,
          behavior: 'smooth',
        })
      } else {
        horizontalScrollRef.current.scrollTo({
          left: horizontalScrollRef.current.scrollLeft + horizontalScrollRef.current.offsetWidth,
          behavior: 'smooth',
        })
      }
  }

  const getChangeOnSearch = (title: string) => {
    // setSearchValue(title)
    searchValue2 = title
    setWindowLoad(true)
    getSearch()
    setOpenSearch(true)
  }

  const getInfo = async () => {
    setTimeout(()=>{
      setWindowLoad(false)
    }, 1000)

    const res = await fetch(`/api/info?name=${PropTitle}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json()
    console.log(data)

    let genres_temp: any = []
    for (let i = 0; i < 4; i++) {
      genres_temp.push(data.anime.main_tag[i].name)
    }

    setSelectedInfo({
      id: data.id,
      name: data.anime.name,
      img: data.anime.img,
      content: data.anime.content,
      distribute: data.anime.animation_info.distributed_air_time,
      year_quarter: data.anime.animation_info.air_year_quarter,
      age: data.anime.content_rating,
      genres: genres_temp
    })
  }

  const getSearch = async () => {
    setTimeout(()=>{
      setWindowLoad(false)
    }, 2000)

    const res = await fetch(`/api/search?name=${searchValue2}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await res.json()

    if (data.anime !== 'not found') {
      setSearchSel({
        name: data.anime.name,
        img: data.anime.img
      })

      let genres_temp: any = []
      for (let i = 0; i < data.anime.main_tag.length; i++) {
        genres_temp.push(data.anime.main_tag[i].name)
      }
      setSelectedInfo({
        id: data.anime.id,
        name: data.anime.name,
        img: data.anime.img,
        content: data.anime.content,
        distribute: data.anime.animation_info.distributed_air_time,
        year_quarter: data.anime.animation_info.air_year_quarter,
        age: data.anime.content_rating,
        genres: genres_temp
      })
      setBgVideo(await data.pv)
      console.log(await data.pv)

      setSearchSeries(await data.anime.series_item)
      setSearchRelated(await data.anime.related_item)
      console.log("searching props: ", searchSeries)
    } else {
      setSearchSel({
        name: '검색 결과가 존재하지 않습니다.',
        img: ''
      })
    }
  }

  const getDelDB = async () => {
    const res = await fetch(`/api/db/del`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await res.json()
    console.log(data)
  }

  const addWish = async (id: string) => {
    if (sessionStorage.getItem('Email') != '' && sessionStorage.getItem('Email') != null) {
      const res = await fetch(`/api/db/wish?act=add&id=${id}&email=${sessionStorage.getItem('Email')}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await res.json()
      console.log(data)
    } else { alert('로그인을 진행해주세요.'); navigate('/') }

  }

  const getDaily = async () => {
    const res = await fetch('/api/daily', {
      method: 'GET',
      headers: {
          "Content-Type": "application/json",
      },
    })
    const data = await res.json()
    setDaily({
      data: data.data,
      images: data.imgs,
      ids: data.ids
    })
  }

  useEffect(() => {
    const day = new Date()
    const WeekDay = ['일', '월', '화', '수', '목', '금', '토']
    setWeek(WeekDay[day.getDay()])

    getDaily()

    setTimeout(()=>{
      setLoad(false)
    }, 2000)
  }, [])

  return (
    Load ? <Loading /> :
    <Fragment>
      { open ?
        <div className="window-contain">
          <div>
            <div className="title-window">
              <div className="window-title">{ selectedInfo.name }</div>
              <div className="window-btns">
                <button className='info-in-btn' onClick={() => { setOpen(false); setWindowLoad(true) }}><FontAwesomeIcon className='window-btn' icon={faXmark} /></button>
              </div>
            </div>
            <div className="info-window">
              { windowLoad ?
                <div className="loading-window">
                  {/* <svg className='spinner whitelogo' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg> */}
                  <img className='spinner' src={`images/logo.png`} alt="" />
                </div>
              :
                <Fragment>
                  <div className="main-info">
                    <img className='info-img' src={ selectedInfo.img } alt="" />
                    <div className="">
                      <div className="info-title">{ selectedInfo.name }</div>
                      <div className="tags-info">
                        { selectedInfo.genres.map((el: any, idx: number) => (
                          <div key={idx} className="tag">#{el}</div>
                        )) }
                      </div>
                      <div className="lighter">방영 요일: <strong>{ selectedInfo.distribute }</strong></div>
                      <div className="lighter">출시 구분: <strong>{ selectedInfo.year_quarter }</strong></div>
                      <div className="lighter">장르: <strong>{ selectedInfo.genres[0] } · { selectedInfo.genres[1] }</strong></div>
                      <div className="card-btn-contain">
                        <button className='play' onClick={ () => window.open(`https://laftel.net/item/${selectedInfo.id}`) }>
                          {/* <div className="laftel-logo"></div> */}
                          <img className='laftel-logo' src={`images/laftel.png`} alt="" />
                          <div className="play-text">보러가기</div>
                        </button>
                        <button className='wish' onClick={ () => addWish(selectedInfo.id) }>
                          <FontAwesomeIcon className='wish-logo' icon={faPlus} />
                          <div className="play-text">보고싶다</div>
                        </button>
                        <button className='wish' onClick={ () => addWish(selectedInfo.id) }>
                          <FontAwesomeIcon className='wish-logo' icon={faCheck} />
                          <div className="play-text">정주행 완료</div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="info-content">{ selectedInfo.content }</div>
                </Fragment>
              }
            </div>
          </div>

        </div>
      : null }

      { openSearch ?
        <div className="window-contain">
          <div>
            <div className="search-title-window">
              <div className="window-title">검색 결과</div>
              <div className="window-btns">
                <button className='info-in-btn' onClick={() => { setOpenSearch(false); setWindowLoad(true) }}><FontAwesomeIcon className='window-btn' icon={faXmark} /></button>
              </div>
            </div>
            <div className="search-info-window">
              { windowLoad ?
                <div className="loading-window">
                  {/* <svg className='spinner whitelogo' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg> */}
                  <img className='spinner' src={`images/logo.png`} alt="" />
                </div>
              :
                <div className='search-contain'>
                  <div className="search-el">
                    <div className="search-bg"></div>
                    <ReactPlayer
                      className='react-player'
                      url={bgVideo}
                      width={'94%'}
                      height={'100%'}
                      playing={true}
                      muted={true}
                      controls={false}
                      light={false}
                      pip={false}
                      loop={true}
                    />
                    <div className="search-ui">
                      <img className='search-main-img' src={ selectedInfo.img } alt="" />
                      <div className="">
                        <div className="search-title">{ selectedInfo.name }</div>
                        <div className="search-tags-info">
                          { selectedInfo.genres.map((el: any, idx: number) => (
                            <div key={idx} className="search-tag">#{el}</div>
                          )) }
                        </div>
                        <div className="lighter">방영 요일: <strong>{ selectedInfo.distribute || '정보없음' }</strong></div>
                        <div className="lighter">출시 구분: <strong>{ selectedInfo.year_quarter }</strong></div>
                        <div className="lighter">장르: <strong>{ selectedInfo.genres[0] } · { selectedInfo.genres[1] }</strong></div>
                        <div className="card-btn-contain">
                          <button className='play-search' onClick={ () => window.open(`https://laftel.net/item/${selectedInfo.id}`) }>
                            {/* <div className="laftel-logo"></div> */}
                            <img className='laftel-logo' src={`images/laftel.png`} alt="" />
                            <div className="play-text">보러가기</div>
                          </button>
                          <button className='wish-search' onClick={ () => addWish(selectedInfo.id) }>
                            {/* <div className="laftel-logo"></div> */}
                            <FontAwesomeIcon className='wish-logo' icon={faPlus} />
                            <div className="play-text">보고싶다</div>
                          </button>
                          <button className='wish-search' onClick={ () => addWish(selectedInfo.id) }>
                          <FontAwesomeIcon className='wish-logo' icon={faCheck} />
                          <div className="play-text">정주행 완료</div>
                        </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="search-down">
                    <div className="series-title">같은 시리즈의 작품</div>
                    <div className="series-contain">
                      { searchSeries.map((el: any, idx: number) => (
                          <button key={idx} className="search-card" onClick={() => getChangeOnSearch(el.name)}>
                            <img className='search-card-img' src={ el.images[0].img_url || '' } alt='' />
                            <div className="text-contain">
                              <div className="search-card-title">{ el.name }</div>
                            </div>
                          </button>
                        )) }
                    </div>

                    <div className="series-title">비슷한 작품</div>
                    <div className="series-contain">
                      { searchRelated.map((el: any, idx: number) => (
                          <button key={idx} className="search-card" onClick={() => getChangeOnSearch(el.name)}>
                            <img className='search-card-img' src={ el.images[0].img_url || '' } alt='' />
                            <div className="text-contain">
                              <div className="search-card-title">{ el.name }</div>
                            </div>
                          </button>
                        )) }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

        </div>
      : null }

      <Nav />

      {/* Added Success Notice Window */}

      <main>
        {/* <div className="bg"></div> */}
        <img className='bg' src={`images/bocchi-4x-width.png`} alt="" />

        <div className="bg-info">
          <div className="bg-info-text">이번 분기의 <span className='colored'>인기</span> 애니를 확인해보세요</div>
          <button className="btn">확인하러 가기</button>
        </div>

        {/* Search Bar */}
        <div className="search">
          <input className='search-input' type="text" placeholder='제목으로 검색해보세요' onChange={(e: any) => { searchValue2 = e.target.value }} />
          <button className='search-btn' onClick={() => { setWindowLoad(true); getSearch(); setOpenSearch(true) } }>
            <FontAwesomeIcon className='search-icon' icon={faMagnifyingGlass} />
          </button>
        </div>

        <div className="cards">
          <div className="tests">
            <div className="card-sub">
              <div className="bg-info-text"><strong className='colored'>오늘</strong>의 신작 애니</div>
            </div>
            {/* <button className="change-btn">표시 변경</button> */}
          </div>

          <div className="card-contain-contain">
            <button className='prev' onClick={ () => handleNextButtonClick('prev') }>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div className="card-contain" ref={horizontalScrollRef}>
              { daily.data.map((el: any, idx: number) => (
                <button key={idx} className="card" onClick={ () => { console.log(el.title); PropTitle = el.title; getInfo(); setOpen(true) } }>
                  <img className='card-img' src={ daily.images[idx] || '' } alt='' />
                  <div className="text-contain">
                    <div className="card-title">{ el.title }</div>
                  </div>
                </button>
              )) }
            </div>
            <button className='next' onClick={ () => handleNextButtonClick('next') }>
            <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>

      </main>

      {/* <button onClick={getDelDB}>db 데이터 제거</button> */}
    </Fragment>
  )
}

export default Index