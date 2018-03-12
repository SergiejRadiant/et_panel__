import constants from '../constants/index'

const initialState = {
  isFetched: false,
  message: {},
  errors: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.EDIT_DRIVER_SUCCESS:
      return {
        isFetched: true,
        message: 'Driver is succesfully edited!',
        errors: {}
      }
    case constants.EDIT_DRIVER_REQUEST:
      return {
        done: false,
        message: {}
      }
    case constants.EDIT_DRIVER_FAILURE:
      return {
        isFetched: true,
        message: 'Driver was not edited!',
        errors: action.payload.response
      }
    default:
      return state
  }
}