import axios from 'axios';
import { api_url as API_URL } from '../assets/constants/api_url'

export const usersByClient = (payload) => {
    return axios({
        url: API_URL+'usersByClient',
        method: 'get',
        params: {
          clientId: payload.clientId,
          page: payload.page,
          size: payload.size,
          lang: payload.lang
        },
        headers: {
          'Authorization': payload.tokenType+' '+ payload.accessToken,
          'Content-Type': 'application/json'
      }
      })
}

export const deleteUser = (payload) => {
    return axios({
        url: API_URL+'deleteUser',
        method: 'POST',
        data: {
          clientId:payload.id,
          lang:payload.lang
        },
        headers: {
          'Authorization': payload.tokenType+' '+ payload.accessToken,
          'Content-Type': 'application/json'
      }
      })
}
export const posTerminalsList = (payload) => {
    return axios({
    method: 'GET',
    url: API_URL+'posTerminalsList',
    params:{
      clientId: payload.clientId ,
      lang: payload.lang
    },
    headers: {
      'Authorization': payload.tokenType+' '+ payload.accessToken,
      'Content-Type': 'application/json'
    }
  })
}
export const createUser = (payload) => {
    return axios({
      method: 'POST',
      url: API_URL+'createUser',
      data: payload.data,
      headers: {
          'Authorization': payload.tokenType+' '+ payload.accessToken,
          'Content-Type': 'multipart/form-data'
      }
  })
}
export const updateProfileImg = (payload) => {
    return axios({
      method: 'POST',
      url: API_URL+'updateProfileImg',
      data: payload.data,
      headers: {
          'Authorization': payload.tokenType+' '+ payload.accessToken,
          'Content-Type': 'multipart/form-data'
      }
  })
}
export const updateUser = (payload) => {
    return axios({
      method: 'POST',
      url: API_URL+'updateUser',
      data: payload.data,
      headers: {
          'Authorization': payload.tokenType+' '+ payload.accessToken,
          'Content-Type': 'application/json'
        }
  })
}

