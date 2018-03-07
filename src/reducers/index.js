import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as burgerMenu } from 'redux-burger-menu'
import authReducer, * as fromAuth from './authReducer.js'
import deleteDriverReducer from './deleteDriverReducer'
import deleteOrderReducer from './deleteOrderReducer'
import registerDriverReducer from './deleteOrderReducer'
import registerOrderReducer from './registerOrderReducer'
import retrieveDriverReducer from './retrieveDriverReducer'
import retrieveDriversReducer from './retrieveDriversReducer'
import retrieveOrderReducer from './retrieveOrderReducer'
import retrieveOrdersReducer from './retrieveOrdersReducer'
import setScheduleReducer from './setScheduleReducer'
import editOrderReducer from './editOrderReducer'


const rootReducer = combineReducers({
    auth: authReducer,
    router: routerReducer,
    burgerMenu,
    deleteDriverReducer,
    deleteOrderReducer,
    registerDriverReducer,
    registerOrderReducer,
    retrieveDriverReducer,
    retrieveDriversReducer,
    retrieveOrderReducer,
    retrieveOrdersReducer,
    setScheduleReducer,
    editOrderReducer
})


export const isAuthenticated =
    state => fromAuth.isAuthenticated(state.auth)
export const accessToken =
    state => fromAuth.accessToken(state.auth)
export const isAccessTokenExpired =
    state => fromAuth.isAccessTokenExpired(state.auth)
export const refreshToken =
    state => fromAuth.refreshToken(state.auth)
export const isRefreshTokenExpired =
    state => fromAuth.isRefreshTokenExpired(state.auth)
export const authErrors =
    state => fromAuth.errors(state.auth)


export function withAuth(headers = {}) {
    return (state) => ({
        ...headers,
        'Authorization': `JWT ${accessToken(state)}`
    })
}


export default rootReducer