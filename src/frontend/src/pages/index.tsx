import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faArrowRight, faMagnifyingGlass, faArrowLeft, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'
import ReactPlayer from 'react-player'

import Nav from './nav'
import Loading from './loading'

function Index() {
  const log = console.log
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
  const [notiStatus, setNotiStatus] = useState('notice-contain-hidden')
  const [notiValue, setNotiValue] = useState('요청을 완료했습니다.')
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

    if (data.anime != "not found") {
      setSearchSel({
        name: data.anime.name,
        img: data.anime.img
      })

      setSearchSeries(await data.anime.series_item)
      setSearchRelated(await data.anime.related_item)

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

      console.log("searching props: ", searchSeries)
    } else {
      setSearchSel({
        name: '검색 결과가 존재하지 않습니다.',
        img: ''
      })
      setSearchSeries([])
      setSearchRelated([])
    }
  }

  // const getDelDB = async () => {
  //   const res = await fetch(`/api/db/del`, {
  //     method: 'GET',
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })

  //   const data = await res.json()
  //   console.log(data)
  // }

  const addWish = async (id: string) => {
    if (sessionStorage.getItem('Email') != '' && sessionStorage.getItem('Email') != null) {
      const res = await fetch(`/api/db/wish?act=add&id=${id}&email=${sessionStorage.getItem('Email')}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await res.json()
      console.log(data.message)

      setNotiValue('요청을 완료했습니다.')
      setNotiStatus('notice-contain')
      setTimeout(() => { setNotiStatus('notice-contain-hidden') }, 2000)
    } else { 
      setNotiValue('로그인이 필요합니다.')
      setNotiStatus('notice-contain')
      setTimeout(() => { setNotiStatus('notice-contain-hidden') }, 2000)
    }

  }

  const addWatched = async (id: string) => {
    if (sessionStorage.getItem('Email') != '' && sessionStorage.getItem('Email') != null) {
      const res = await fetch(`/api/db/watched?act=add&id=${id}&email=${sessionStorage.getItem('Email')}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await res.json()
      console.log(data.message)

      setNotiValue('요청을 완료했습니다.')
      setNotiStatus('notice-contain')
      setTimeout(() => { setNotiStatus('notice-contain-hidden') }, 2000)
    } else { 
      setNotiValue('로그인이 필요합니다.')
      setNotiStatus('notice-contain')
      setTimeout(() => { setNotiStatus('notice-contain-hidden') }, 2000)
    }

  }

  const getDaily = async () => {
    const res = await fetch('/api/daily', {
      method: 'GET',
      headers: {
          "Content-Type": "application/json",
      },
    })
    const data = await res.json()
    log(data)
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

      <div className={ notiStatus }>
        <div className="notice-window">{ notiValue }</div>
      </div>

      {/* Daily Window */}
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
                        <button className='wish' onClick={ () => addWatched(selectedInfo.id) }>
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

      {/* Search Window */}
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
                    <img className='m-search-main-img' src={ selectedInfo.img } alt="" />
                    <div className="search-ui">
                      <img className='search-main-img' src={ selectedInfo.img } alt="" />
                      <div className="search-main-texts">
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
                          <button className='wish-search' onClick={ () => addWatched(selectedInfo.id) }>
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
                      { searchSel.name != "not found" ?
                        ( searchSeries.map((el: any, idx: number) => (
                            <button key={idx} className="search-card" onClick={() => getChangeOnSearch(el.name)}>
                              <img className='search-card-img' src={ el.images[0].img_url || el.img } alt='' />
                              <div className="text-contain">
                                <div className="search-card-title">{ el.name }</div>
                              </div>
                            </button>
                        )) )
                      : null }
                    </div>

                    <div className="series-title">비슷한 작품</div>
                    <div className="series-contain">
                      { searchSel.name != "not found" ?
                        ( searchRelated.map((el: any, idx: number) => (
                          <button key={idx} className="search-card" onClick={() => getChangeOnSearch(el.name)}>
                            <img className='search-card-img' src={ el.images[0].img_url || el.img } alt='' />
                            <div className="text-contain">
                              <div className="search-card-title">{ el.name }</div>
                            </div>
                          </button>
                        )) )
                      : null }
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