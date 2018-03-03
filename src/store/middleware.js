import { isRSAA, apiMiddleware } from 'redux-api-middleware';

import { refreshAccessToken } from '../actions/index'
import { refreshToken, isAccessTokenExpired } from '../reducers/authReducer'
import constants from '../constants/index'


export function createApiMiddleware() {
  let postponedRSAAs = []

  return ({ dispatch, getState }) => {
    const rsaaMiddleware = apiMiddleware({ dispatch, getState })
    
    return (next) => (action) => {
      const nextCheckPostoned = (nextAction) => {
        
        if (nextAction.type === constants.TOKEN_RECEIVED) {
          next(nextAction);
          postponedRSAAs.forEach((postponed) => {
            rsaaMiddleware(next)(postponed)
          })
          postponedRSAAs = []
        } else {

          next(nextAction)
        }
      }
      
      if (isRSAA(action)) {
  
        const state = getState(),
          token = refreshToken(state)

        if (token && isAccessTokenExpired(state)) {
          postponedRSAAs.push(action)
         
          if (postponedRSAAs.length === 1) {
            return rsaaMiddleware(nextCheckPostoned)(refreshAccessToken(token))
          } else {
            return
          }
        }

        return rsaaMiddleware(next)(action);
      }

      return next(action);
    }
  }
}

export default createApiMiddleware();