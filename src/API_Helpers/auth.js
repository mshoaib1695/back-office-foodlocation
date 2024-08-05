import axios from 'axios';
import { api_url as API_URL } from '../assets/constants/api_url'

export const auth_login = (payload) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: API_URL + 'auth/signin',
            data: payload
        })
            .then(response => {
                resolve(response.data)
            })
            .catch(err => {
                console.error(err)
                reject(err)
            })
    })
}
export const get_client_by_id = (payload) => {
    return axios({
        method: 'GET',
        url: API_URL + 'clientByID',
        params: {
            clientId: payload.clientId,
            lang: payload.lang
        },
        headers: {
            'Authorization': payload.tokenType + ' ' + payload.accessToken,
            'Content-Type': 'application/json'
        }
    })


}
export const clients_list = (payload) => {
    return axios({
        method: 'GET',
        url: `${API_URL}clientsList`,
        headers: {
            'Authorization':payload.tokenType + ' ' + payload.accessToken,
            'Content-Type': 'application/json'
        }
    })
}

export const validateToken = (payload) => {
    return  axios({
        method: 'POST',
        url: API_URL + "auth/validateToken",
        data: {
          bearerToken: payload.tokenType + ' ' + payload.accessToken
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
}