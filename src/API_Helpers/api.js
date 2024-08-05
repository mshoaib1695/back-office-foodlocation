import axios from 'axios';
import { api_url as API_URL, api_url_reports, api_url_notify, websocket } from '../assets/constants/api_url'


export const create = (payload) => {
  
  return axios({
    url: API_URL + payload.apiname,
    method: 'POST',
    data: payload.data,
    headers: {
      'Authorization': payload.tokenType + ' ' + payload.accessToken,
      'Content-Type': 'application/json'
    }
  })
}
export const deleteFn = (payload) => {
  
  return axios({
    url: API_URL + payload.apiname,
    method: 'DELETE',
    data: payload.data,
    headers: {
      'Authorization': payload.tokenType + ' ' + payload.accessToken,
      'Content-Type': 'application/json'
    }
  })
}
export const notify = (payload) => {
  return axios({
    url: api_url_notify + payload.apiname,
    method: 'POST',
    data: payload.data,
    headers: {
      'Authorization': payload.tokenType + ' ' + payload.accessToken,
      'Content-Type': 'application/json'
    }
  })
}
export const createMultipartAPI = (payload) => {
  return axios({
    url: API_URL + payload.apiname,
    method: 'POST',
    data: payload.data,
    headers: {
      'Authorization': payload.tokenType + ' ' + payload.accessToken,
      'Content-Type': 'multipart/form-data'
    }
  })
}
export const report = (payload) => {
  return axios({
    url: api_url_reports + payload.apiname,
    method: 'POST',
    responseType: 'blob',
    data: payload.data,
    headers: {
      'Authorization': payload.tokenType + ' ' + payload.accessToken,
      'Content-Type': 'application/json'
    }
  })
}
export const gridDataByClient = (payload) => {
  return axios({
    method: 'POST',
    url: API_URL + payload.apiname,
    data: payload.data,
    headers: {
      'Authorization': payload.tokenType + ' ' + payload.accessToken,
      'Content-Type': 'application/json'
    }
  })
}

export const deleteapi = (payload) => {
  return axios({
    url: API_URL + payload.apiname,
    method: 'POST',
    data: payload.data,
    headers: {
      'Authorization': payload.tokenType + ' ' + payload.accessToken,
      'Content-Type': 'application/json'
    }
  })
}
export const parametersListByParaType = (payload) => {
  return axios({
      method: 'GET',
      url: `${API_URL}parametersListByParaType`,
      params: payload.data,
      headers: {
          'Authorization': payload.tokenType + ' ' + payload.accessToken,
          'Content-Type': 'application/json'
      }
  })
}
export const getList = (payload) => {
  return axios({
      method: 'GET',
      url: API_URL + payload.apiname,
      params: payload.data,
      headers: {
          'Authorization': payload.tokenType + ' ' + payload.accessToken,
          'Content-Type': 'application/json'
      }
  })
}
export const postWithPrams = (payload) => {
  return axios({
      method: 'POST',
      url: API_URL + payload.apiname,
      params: payload.data,
      headers: {
          'Authorization': payload.tokenType + ' ' + payload.accessToken,
          'Content-Type': 'application/json'
      }
  })
}
export const websocketAPI = (payload) => {
  let  url = websocket + payload.apiname
 return (url)
}