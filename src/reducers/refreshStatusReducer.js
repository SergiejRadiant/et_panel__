import constants from '../constants/index'

const initialState = {
  isFetched: false,
  errors: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.REFRESH_STATUS_SUCCESS:
      return {
        isFetched: true,
        errors: {}
      }
    case constants.REFRESH_STATUS_REQUEST:
      return {
        isFetched: false,
        errors: {}
      }
    case constants.REFRESH_STATUS_FAILURE:
      return {
        isFetched: true,
        errors: {}
      }
    default:
      return state
  }
}