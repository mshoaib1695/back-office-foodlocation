import axios from 'axios';
import { api_url as API_URL } from '../assets/constants/api_url'

export const rolesByClient = (payload) => {
    return axios({
        url: API_URL+'rolesByClient',
        method: 'get',
        params: {
          clientId: payload.clientId,
          page: payload.page,
          size: payload.size,
          lang: payload.lang,
          name: payload.name ? payload.name : null,
          nameAr: payload.nameAr ? payload.nameAr : null ,
          description: payload.description ? payload.description : null 
        },
        headers: {
          'Authorization': payload.tokenType+' '+ payload.accessToken,
          'Content-Type': 'application/json'
      }
      })
}
export const roleByID = (payload) => {
    return axios({
        url: API_URL+'roleByID',
        method: 'GET',
        params: {
          id: payload.id,
          lang: payload.lang,
        },
        headers: {
          'Authorization': payload.tokenType+' '+ payload.accessToken,
          'Content-Type': 'application/json'
      }
      })
}
export const deleteRole = (payload) => {
    return axios({
        url: API_URL+'deleteRole',
        method: 'POST',
        data: {
          id:payload.id,
          lang:payload.lang
        },
        headers: {
          'Authorization': payload.tokenType+' '+ payload.accessToken,
          'Content-Type': 'application/json'
      }
      })
}
export const createRole = (payload) => {
    return axios({
        url: API_URL+'createRole',
        method: 'POST',
        data: {
          "lang": payload.lang,
          "name": payload.name,
          "nameAr": payload.nameAr,
          "description": payload.description,
          "client": payload.client
        },
        headers: {
          'Authorization': payload.tokenType+' '+ payload.accessToken,
          'Content-Type': 'application/json'
      }
      })
}
export const updateRole = (payload) => {
    return axios({
        url: API_URL+'updateRole',
        method: 'POST',
        data: {
          "id": payload.id,
          "lang": payload.lang,
          "name": payload.name,
          "nameAr": payload.nameAr,
          "description": payload.description,
          "screenList": payload.screenList,
          "client": payload.client
        },
        headers: {
          'Authorization': payload.tokenType+' '+ payload.accessToken,
          'Content-Type': 'application/json'
      }
      })
}
