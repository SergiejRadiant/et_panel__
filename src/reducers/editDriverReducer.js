import constants from '../constants/index'

const initialState = {
  done: false,
  message: {},
  errors: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.EDIT_DRIVER_SUCCESS:
      return {
        done: true,
        message: 'Driver is succesfully registered!',
        errors: {}
      }
    case constants.EDIT_DRIVER_REQUEST:
      return {
        done: false,
        message: {}
      }
    case constants.EDIT_DRIVER_FAILURE:
      return {
        done: true,
        message: 'Driver was not registered!',
        errors: {}
      }
    default:
      return state
  }
}