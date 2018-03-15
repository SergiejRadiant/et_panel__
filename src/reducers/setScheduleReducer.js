import constants from '../constants/index'


const initialState = {
  isFetched: false,
  errors: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_SCHEDULE_SUCCESS:
      return {
        isFetched: true,
        errors: {}
      }
    case constants.SET_SCHEDULE_REQUEST:
      return {
        isFetched: false,
        errors: {}
      }
    case constants.SET_SCHEDULE_FAILURE:
      return {
        isFetched: true,
        errors: action.payload.response
      }
    default:
      return state
  }
}