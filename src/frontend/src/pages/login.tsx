import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'

import Nav from './nav'

const pub = process.env.PUBLIC_URL

declare global {
  interface Window {
    Kakao: any
  }
}

function Login() {
  const navigate = useNavigate()
  const [account, setAccount] = useState('')

  const getGoogleOAuth = useGoogleLogin({
    onSuccess: async (tokenResponse: any) => {

      await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      })
      .then(async (res: { data: { name: string, email: string } }) => {
        const db_res = await axios.get(`http://localhost:3000/api/db/create?email=${res.data.email}&name=${res.data.name}`)
        const data = await db_res.data

        if (!await data.res) {
          alert("다시 만나서 반가워요, " + res.data.name + "님!")
          sessionStorage.setItem('Account', res.data.name)
          sessionStorage.setItem('Email', res.data.email)
          navigate('/')
        } else {
          alert("환영합니다, " + res.data.name + "님!")
          sessionStorage.setItem('Account', res.data.name)
          sessionStorage.setItem('Email', res.data.email)
          navigate('/')
        }

        // alert(`name: ${res.data.name}\nemail: ${res.data.email}`)
      }).catch(() => {
        alert("oAuth token expired")
      })
    },
    onError: (errorResponse: any) => console.log(errorResponse)
  })

  const getKakaoOAuth = () => {
    const jsKey = "1f4c19bd0b7f3b52583a8dc2acd8ac99"
    const Kakao = window.Kakao
    
    if (Kakao && !Kakao.isInitialized()) {
      Kakao.init(jsKey)
      console.log(Kakao.isInitialized())
    }

    Kakao.Auth.login({
      success() {
        Kakao.API.request({
          url: "/v2/user/me",
          async success(res: any) {
            const kakaoAccount = res.kakao_account

            // const db_res = await axios.get(`http://localhost:3000/api/db/create?email=${res.data.email}&name=${res.data.name}`)
            // const data = await db_res.data

            // if (!await data.res) {
            //   alert("다시 만나서 반가워요, " + res.data.name + "님!")
            //   sessionStorage.setItem('Account', res.data.name)
            //   sessionStorage.setItem('Email', res.data.email)
            //   navigate('/')
            // } else {
            //   alert("환영합니다, " + res.data.name + "님!")
            //   sessionStorage.setItem('Account', res.data.name)
            //   sessionStorage.setItem('Email', res.data.email)
            //   navigate('/')
            // }

            console.log('login successful by kakao, ' + await kakaoAccount.profile.id)
            sessionStorage.setItem('Account', kakaoAccount.profile.nickname)
            navigate('/')
          },
          fail(error: any) {
            console.log(error)
          },
        })
      },
      fail(error: any) {
        console.log(error)
      },
    })
  }

  return (
    <Fragment>

      <Nav />

      <main className='flex-el'>
        <div className="sign-title">
          <img className='sign-title-logo' src={`${pub}/images/logo.png`} alt='' />
          Log in
        </div>

        <div className="oAuth">
          <button className='google-btn' onClick={() => getGoogleOAuth()}>
            <img className='google-logo' src={`${pub}/images/google.png`} alt={''} />
            <div className="oauth-btn-text">구글로 로그인</div>
          </button>

          <button className='kakao-btn' onClick={() => getKakaoOAuth()}>
            <img className='kakao-logo' src={`${pub}/images/kakao.png`} alt={''} />
            <div className="oauth-btn-text">카카오로 로그인</div>
          </button>
        </div>

        { account ?
          <div className="card">
            <div className="">로그인 되었습니다</div>
            <button onClick={() => setAccount('false')}>로그아웃</button>
          </div>
        : null }
      </main>

    </Fragment>
  )
}
export default Login