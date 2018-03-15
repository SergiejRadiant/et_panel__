import constants from '../constants/index'

const initialState = {
  isFetched: false,
  message: {},
  errors: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.REGISTER_ORDER_SUCCESS:
      return {
        isFetched: true,
        message: 'Order is succesfully created!',
        errors: {}
      }
    case constants.REGISTER_ORDER_REQUEST:
      return {
        isFetched: false,
        message: {}
      }
    case constants.REGISTER_ORDER_FAILURE:
      return {
        isFetched: true,
        message: 'Order was not created!',
        errors: action.payload.response
      }
    default:
      return state
  }
}