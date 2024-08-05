import loginAction from '../../actions/auth'
 
export const login = (state = {userLogedIn: false, userRole: "admin"}, action) => {
  switch (action.type) {
    case loginAction.LOGIN_WITH_EMAIL: {
      return { ...state, ...action.payload }
    }
    case loginAction.CHANGE_ROLE: {
      return { ...state, userRole: action.userRole }
    }
    case loginAction.CHANGE_CLIENT: {
      return { ...state, client: {...state.client, clientId: action.payload} }
    }
    case loginAction.LOGOUT: {
      return {userLogedIn: false, userRole: "admin"}
    }
    default: {
      return state
    }
  }
}
