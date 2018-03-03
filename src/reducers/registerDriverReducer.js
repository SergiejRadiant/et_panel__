import constants from '../constants/index'

const initialState = {
  isFetched: false,
  message: {},
  errors: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.REGISTER_DRIVER_SUCCESS:
      return {
        isFetched: true,
        message: 'Driver is succesfully registered!',
        errors: {}
      }
    case constants.REGISTER_DRIVER_REQUEST:
      return {
        isFetched: false,
        message: {}
      }
    case constants.REGISTER_DRIVER_FAILURE:
      return {
        isFetched: true,
        message: 'Driver was not registered!',
        errors: {}
      }
    default:
      return state
  }
}