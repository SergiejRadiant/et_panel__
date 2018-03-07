import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers/index'
import constants from '../constants/index'


export const login = (data) => ({
  [RSAA]: {
    endpoint: 'http://89.223.28.252:8000/ru/ext_api/v0/api-token-auth/',
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    types: [
      constants.LOGIN_REQUEST, constants.LOGIN_SUCCESS, constants.LOGIN_FAILURE
    ]
  }
})


export const refreshAccessToken = (token) => ({
  [RSAA]: {
    endpoint: 'http://89.223.28.252:8000/ru/ext_api/v0/api-token-refresh/',
    method: 'POST',
    body: JSON.stringify({ token: token }),
    headers: { 'Content-Type': 'application/json' },
    types: [
      constants.TOKEN_REQUEST, constants.TOKEN_RECEIVED, constants.TOKEN_FAILURE
    ]
  }
})


export const retrieveDrivers = () => ({
  [RSAA]: {
    endpoint: 'http://89.223.28.252:8000/ru/ext_api/v0/drivers/',
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    types: [
      constants.RETRIEVE_DRIVERS_REQUEST, constants.RETRIEVE_DRIVERS_SUCCESS, constants.RETRIEVE_DRIVERS_FAILURE
    ]
  }
})


export const registerDriver = (data) => ({
  [RSAA]: {
    endpoint: 'http://89.223.28.252:8000/ru/ext_api/v0/drivers/',
    method: 'POST',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
    types: [
      constants.REGISTER_DRIVERS_REQUEST, constants.REGISTER_DRIVERS_SUCCESS, constants.REGISTER_DRIVERS_FAILURE
    ]
  }
})


export const retrieveDriver = (driverId) => ({
  [RSAA]: {
    endpoint: `http://89.223.28.252:8000/ru/ext_api/v0/drivers/${driverId}/`,
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    types: [
      constants.RETRIEVE_DRIVER_REQUEST, constants.RETRIEVE_DRIVER_SUCCESS, constants.RETRIEVE_DRIVER_FAILURE
    ]
  }
})


export const deleteDriver = (driverId) => ({
  [RSAA]: {
    endpoint: `http://89.223.28.252:8000/ru/ext_api/v0/drivers/${driverId}/`,
    method: 'DELETE',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    types: [
      constants.DELETE_DRIVER_REQUEST, constants.DELETE_DRIVER_SUCCESS, constants.DELETE_ORDER_FAILURE
    ]
  }
})


export const retrieveOrders = () => ({
  [RSAA]: {
    endpoint: 'http://89.223.28.252:8000/ru/ext_api/v0/orders/',
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    types: [
      constants.RETRIEVE_ORDERS_REQUEST, constants.RETRIEVE_ORDERS_SUCCESS, constants.RETRIEVE_ORDERS_FAILURE
    ]
  }
})


export const registerOrder = (data) => ({
  [RSAA]: {
    endpoint: 'http://89.223.28.252:8000/ru/ext_api/v0/orders/',
    method: 'POST',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
    types: [
      constants.REGISTER_ORDERS_REQUEST, constants.REGISTER_ORDERS_SUCCESS, constants.REGISTER_ORDERS_FAILURE
    ]
  }
})


export const retrieveOrder = (orderId) => ({
  [RSAA]: {
    endpoint: `http://89.223.28.252:8000/ru/ext_api/v0/orders/${orderId}/`,
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    types: [
      constants.RETRIEVE_ORDER_REQUEST, constants.RETRIEVE_ORDER_SUCCESS, constants.RETRIEVE_ORDER_FAILURE
    ]
  }
})


export const deleteOrder = (orderId) => ({
  [RSAA]: {
    endpoint: `http://89.223.28.252:8000/ru/ext_api/v0/orders/${orderId}/`,
    method: 'DELETE',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    types: [
      constants.DELETE_ORDER_REQUEST, constants.DELETE_ORDER_SUCCESS, constants.DELETE_ORDER_FAILURE
    ]
  }
})


export const setDriver = (data) => ({
  [RSAA]: {
    endpoint: `http://89.223.28.252:8000/ru/ext_api/v0/orders/${data.id}/`,
    method: 'PATCH',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
    types: [
      constants.SET_DRIVER_REQUEST, constants.SET_DRIVER_SUCCESS, constants.SET_DRIVER_FAILURE
    ]
  }
})

export const setSchedule = (data, scheduleId) => ({
  [RSAA]: {
    endpoint: `http://89.223.28.252:8000/ru/ext_api/v0/add-workdays/${scheduleId}`,
    method: 'POST',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
    types: [
      constants.SET_SCHEDULE_REQUEST, constants.SET_SCHEDULE_SUCCESS, constants.SET_SCHEDULE_FAILURE
    ]
  }
})

export const editDriver = (data, driverId) => ({
  [RSAA]: {
    endpoint: `http://89.223.28.252:8000/ru/ext_api/v0/edit-driver/${driverId}`,
    method: 'POST',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
    types: [
      constants.EDIT_DRIVER_REQUEST, constants.EDIT_DRIVER_SUCCESS, constants.EDIT_DRIVER_FAILURE
    ]
  }
})

export const editOrder = (data) => ({
  [RSAA]: {
    endpoint: `http://89.223.28.252:8000/ru/ext_api/v0/orders/${data.id}/`,
    method: 'PATCH',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
    types: [
      constants.EDIT_ORDER_REQUEST, constants.EDIT_ORDER_SUCCESS, constants.EDIT_ORDER_FAILURE
    ]
  }
})