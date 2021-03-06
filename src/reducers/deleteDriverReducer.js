import constants from '../constants/index'

const initialState = {
  isFetched: false,
  errors: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.DELETE_DRIVER_SUCCESS:
      return {
        isFetched: true,
        errors: {}
      }
    case constants.DELETE_DRIVER_REQUEST:
      return {
        isFetched: false,
        errors: {}
      }
    case constants.DELETE_DRIVER_FAILURE:
      return {
        isFetched: true,
        errors: {}
      }
    default:
      return state
  }
}