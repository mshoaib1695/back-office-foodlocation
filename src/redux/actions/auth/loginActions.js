import _ from 'lodash';

import { auth_login, get_client_by_id } from '../../../API_Helpers/auth'
import { parametersListByParaType } from '../../../API_Helpers/parameters'
import { getImage } from '../../../API_Helpers/getImage'
import { toast } from "react-toastify"

export const CHANGE_ROLE = 'CHANGE_ROLE';
export const LOGIN_WITH_EMAIL = 'LOGIN_WITH_EMAIL';
export const LOGOUT = 'LOGOUT';
export const CHANGE_CLIENT = 'CHANGE_CLIENT';

export const loginAction = payload => {
  return dispatch => dispatch({ type: LOGIN_WITH_EMAIL, payload })
}
export const logoutAction = payload => {
  return dispatch => dispatch({ type: LOGOUT })
}
export const changeClient = payload => {
  return dispatch => dispatch({ type: CHANGE_CLIENT, payload })
}

export const login = (body) => (dispatch) => {
  auth_login(body)
    .then(res => { 

      get_client_by_id({
        tokenType: res.tokenType,
        accessToken: res.accessToken,
        clientId: res.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
      })
        .then(taxres => {
          let tax = taxres.data.object
          if (typeof (res) == 'string') {
            toast.error(res)
          }
          else {
            let user = {
              accessToken: res.accessToken,
              isCashMgmt: res.isCashMgmt,
              isInclusiveTax: res.isInclusiveTax,
              isManager: res.isManager,
              isOnlineTerminal: res.isOnlineTerminal,
              isPosUser: res.isPosUser,
              name: res.name,
              posTerminalId: res.posTerminalId,
              deliveryPersonId: res.deliveryPersonId,
              tokenType: res.tokenType,
              userId: res.userId
            }
            let client = {
              orderType: res.orderType,
              branchId: res.branchId,
              clientId: res.clientId,
              client: res.clientId,
              clientlogo: res.clientlogo,
              logoContentType: res.logoContentType,
              tax: tax ? tax.tax : null,
              name: tax ? tax.name : null,
            }
            let roles = res.roles
            var screeensList = [...res.screensList]
            var tokenType = res.tokenType
            var accessToken = res.accessToken

            parametersListByParaType({
              paraType: 'SCREEN_GROUP',
              lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
              tokenType: tokenType,
              accessToken: accessToken
            })
              .then(res => { 

                let array2 = []
                for (let i = 0; i <= screeensList.length - 1; i++) {
                  for (let j = 0; j <= res.data.length - 1; j++) {
                    res.data[j].name = res.data[j].name.toLowerCase()
                    if (screeensList[i].screenGroup === res.data[j].id) {
                      let a = Object.assign(res.data[j])
                      let b = Object.assign(screeensList[i])
                      let c = { ...a, ...b }
                      array2.push(c)
                    }
                  }
                }
                var grouped = ''
                grouped = _.mapValues(_.groupBy(array2, 'screenGroup'),
                  clist => clist.map(array => _.omit(array, 'screenGroup')),
                );
                getImage({
                  clientName: client.name,
                  imageName: client.clientlogo,
                  imageContent: client.logoContentType,
                })
                  .then(img => {
                    client.img = img
                    dispatch({ payload: {screeensList: grouped, user, roles, client, userLogedIn: true }, type:"LOGIN_WITH_EMAIL"})

                    // dispatch(loginAction({ screeensList: grouped, user, roles, client, userLogedIn: true }))
                  })
                  .catch(() => {
                    dispatch({ payload: {screeensList: grouped, user, roles, client, userLogedIn: true }, type:"LOGIN_WITH_EMAIL"})
                  })
              }
              )
          }
        })

    })
    .catch((err) => {
      if (JSON.parse(JSON.stringify(err)).response) {
        toast.error(JSON.parse(JSON.stringify(err)).res.message)
      } else {
        toast.error("Connection Timed out")
      }
      // dispatch(loginFailedAction(err))
    });
}
