import constants from '../constants/index'

const initialState = {
  isFetched: false,
  errors: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.EDIT_ORDER_SUCCESS:
      return {
        isFetched: true,
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
        errors: {}
      }
    default:
      return state
  }
}