import axios from 'axios';
import { api_url as API_URL } from '../assets/constants/api_url'

export const parametersListByParaType = (payload) => {
    return axios({
        method: 'GET',
        url: `${API_URL}parametersListByParaType`,
        params: {
            paraType: payload.paraType,
            lang: payload.lang
        },
        headers: {
            'Authorization': payload.tokenType + ' ' + payload.accessToken,
            'Content-Type': 'application/json'
        }
    })
}

export const parametersByClient = (payload) => {
    return axios({
        url: API_URL+'parametersByClient',
        method: 'POST',
        data: {
          clientId: payload.clientId,
          page: payload.page,
          size: payload.size,
          lang: payload.lang,
          sortColumn: payload.sortColumn,
          sortOrder: payload.sortOrder,
          name: payload.name ? payload.name : null,
          nameAr: payload.nameAr ? payload.nameAr : null ,
          paraCode: payload.paraCode ? payload.paraCode : null ,
          paraType: payload.paraType ? payload.paraType : null ,
          description: payload.description ? payload.description : null 
        },
        headers: {
          'Authorization': payload.tokenType+' '+ payload.accessToken,
          'Content-Type': 'application/json'
      }
      })
}
export const deleteParameters = (payload) => {
    return axios({
        url: API_URL+'deleteParameters',
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

export const parametersList = (payload) => {
    return axios({
    method: 'GET',
    url: API_URL+'parametersList',
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
export const createParameters = (payload) => {
    return axios({
        url: API_URL+'createParameters',
        method: 'POST',
        data: payload.data,
        headers: {
          'Authorization': payload.tokenType+' '+ payload.accessToken,
          'Content-Type': 'application/json'
      }
      })
}
export const updateParameters = (payload) => {
    return axios({
        url: API_URL+'updateParameters',
        method: 'POST',
        data: payload.data,
        headers: {
          'Authorization': payload.tokenType+' '+ payload.accessToken,
          'Content-Type': 'application/json'
      }
      })
}