import constants from '../constants/index'

const initialState = {
  isFetched: false,
  message: {},
  errors: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.EDIT_ORDER_SUCCESS:
      return {
        isFetched: true,
        message: 'Order is succesfully edited!',
        errors: {}
      }
    case constants.EDIT_ORDER_REQUEST:
      return {
        isFetched: false,
        errors: {}
      }
    case constants.EDIT_ORDER_FAILURE:
      return {
        isFetched: true,
        message: 'Order was not edited!',
        errors: {}
      }
    default:
      return state
  }
}