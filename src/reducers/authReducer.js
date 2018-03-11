import constants from '../constants/index'

const initialState = {
  access: undefined,
  refresh: undefined,
  exp: undefined,
  start_ext: undefined,
  errors: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.LOGIN_SUCCESS:
      return {
        access: {
          token: action.payload.token,
          user: action.payload.user,
          exp: action.payload.exp,
          start_exp: (new Date()).getTime()
        },
        refresh: {
          token: action.payload.token,
          user: action.payload.user,
          exp: action.payload.exp,
          start_exp: (new Date()).getTime()
        },
        errors: {}
      }
    case constants.TOKEN_RECEIVED:
      return {
        ...state,
        access: {
          token: action.payload.token,
          user: action.payload.user,
          exp: action.payload.exp,
          start_exp: (new Date()).getTime()
        }
      }
    case constants.LOGIN_FAILURE:
    case constants.TOKEN_FAILURE:
      return {
        access: undefined,
        refresh: undefined,
        exp: undefined,
        errors: action.payload.response
      }
    default:
      return state
  }
}

export function accessToken(state) {
  if (state.access) {
    return state.access.token
  }
}

export function refreshToken(state) {
  if (state.auth.refresh) {
    return state.auth.refresh.token
  }
}

export function isAccessTokenExpired(state) {
  
  if (state.auth.access && state.auth.access.exp) {
    return state.auth.access.start_exp - (new Date()).getTime() < parseInt(state.auth.access.exp, 10) * 1000
  }
  return true
}
export function isRefreshTokenExpired(state) {
  if (state.access && state.access.token !== "") {
    return { user: state.access.user, isAdmin: state.access.user.is_admin, isAuthenticated: true }
  }

  return { isAuthenticated: false }
}
export function isAuthenticated(state) {
  return isRefreshTokenExpired(state)
}
export function errors(state) {
  return state.errors
}

