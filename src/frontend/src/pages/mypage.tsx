import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPlus, faCheck, faEraser } from '@fortawesome/free-solid-svg-icons'
import ReactPlayer from 'react-player'

import Nav from './nav_default'

function MyPage() {

  const [week, setWeek] = useState('')
  const [infoSection, setInfoSection] = useState('')
  const [isWishBtn, setIsWishBtn] = useState('')
  const [isWatchedBtn, setIsWatchedBtn] = useState('')
  const [pageLoading, setPageLoading] = useState(true)
  const [wishList, setWishList] = useState([])
  const [watchedList, setWatchedList] = useState([])
  
  let searchValue2: string = ""
  let PropTitle: string = ""
  const [bgVideo, setBgVideo] = useState('')
  const [openSearch, setOpenSearch] = useState(false)
  const [windowLoad, setWindowLoad] = useState(true)
  const [searchSel, setSearchSel] = useState({
    name: '',
    img: ''
  })
  const [searchSeries, setSearchSeries] = useState([])
  const [searchRelated, setSearchRelated] = useState([])
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

    const res = await fetch(`http://ec2-54-180-133-86.ap-northeast-2.compute.amazonaws.com/api/search?name=${searchValue2}`, {
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

  const WishBtnEvent = () => {
    setInfoSection('wish')
    setIsWishBtn('myp_wish')
    setIsWatchedBtn('')
  }
  const WatchedBtnEvent = () => {
    setInfoSection('watched')
    setIsWatchedBtn('watched')
    setIsWishBtn('')
  }

  const removeSearch = async (id: string) => {
    const res = await fetch(`http://ec2-54-180-133-86.ap-northeast-2.compute.amazonaws.com/api/db/wish?act=remove&id=${id}&email=${sessionStorage.getItem('Email')}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await res.json()
    console.log(data.message)
  }

  const getUserDB = async () => {
    const res = await fetch(`http://ec2-54-180-133-86.ap-northeast-2.compute.amazonaws.com/api/db/view?email=${sessionStorage.getItem('Email')}`, {
      method: 'GET',
      headers: {
          "Content-Type": "application/json",
      },
    })
    const data = await res.json()

    console.log(data.wishDATA[0])

    setWishList(data.wishDATA)
    setWatchedList(data.watchedDATA)
  }

  useEffect(() => {
    const day = new Date()
    const WeekDay = ['일', '월', '화', '수', '목', '금', '토']
    setWeek(WeekDay[day.getDay()])

    getUserDB()
    setTimeout(() => setPageLoading(false), 3000);
  }, [])

  return (
    <Fragment>

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
                          <button className='remove-search' onClick={() => removeSearch(selectedInfo.id)}>
                            {/* <div className="laftel-logo"></div> */}
                            <FontAwesomeIcon className='wish-logo' icon={faEraser} />
                            <div className="play-text">리스트에서 삭제</div>
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

        { !pageLoading ?
          ( infoSection == 'wish' ?
            <div className="section-contain">
              <div className="section-contents">
                { wishList.map((el: any, idx: number) => (
                  <button key={idx} className="mypage-card" onClick={() => getChangeOnSearch(el.anime.name)}>
                    <img className='mypage-card-img' src={ el.anime.img || '' } alt='' />
                    <div className="mypage-card-title">{ el.anime.name }</div>

                    {/* <button className='remove-btn' onClick={() => removeSearch(el.anime.id)}>
                      <FontAwesomeIcon className='remove-btn-icon' icon={faEraser} />
                    </button> */}
                  </button>
                )) }
              </div>
            </div>
          :
            ( infoSection == 'watched' ?
              <div className="section-contents">
                { watchedList.map((el: any, idx: number) => (
                  <button key={idx} className="mypage-card" onClick={() => getChangeOnSearch(el.anime.name)}>
                  <img className='mypage-card-img' src={ el.anime.img || '' } alt='' />
                  <div className="mypage-card-title">{ el.anime.name }</div>
                </button>
                )) }
              </div>
            : <div className="section-contents">버튼을 클릭해주세요.</div>
            )
          )
        : <div className="myp_loading">
            <img className='spinner' src={`images/logo.png`} alt="" />
          </div> }
      </main>
    </Fragment>
  )
}

export default MyPage