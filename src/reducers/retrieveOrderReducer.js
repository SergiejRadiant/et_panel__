import constants from '../constants/index'

const initialState = {
  isFetched: false,
  data: {},
  errors: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.RETRIEVE_ORDER_SUCCESS:
      return {
        isFetched: true,
        data: action.payload,
        errors: {}
      }
    case constants.RETRIEVE_ORDER_REQUEST:
      return {
        isFetched: false,
        data: {},
        errors: {}
      }
    case constants.RETRIEVE_ORDER_FAILURE:
      return {
        isFetched: true,
        data: {},
        errors: {}
      }
    default:
      return state
  }
}