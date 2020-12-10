import {
  all,
  fork,
  put,
  takeEvery,
  takeLatest,
  call,
} from 'redux-saga/effects';
import axios from 'axios';
import {
  LOAD_USER_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_OUT_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
} from '../reducers/user';

function loginAPI(loginData) {
  // 서버에 요청을 보내는 부분
  return axios.post('/user/login', loginData, { withCredentials: true });
}

function* login(action) {
  try {
    // yield call(loginAPI);
    const result = yield call(loginAPI, action.data);
    yield put({
      // put은 dispatch 동일
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    // loginAPI 실패
    console.error(e);
    yield put({
      type: LOG_IN_FAILURE,
    });
  }
}

function* watchLogIn() {
  yield takeEvery(LOG_IN_REQUEST, login);
}

function signUpAPI(signUpData) {
  // 서버에 요청을 보내는 부분
  return axios.post('http://localhost:3065/api/user', signUpData);
}

function* signUp(action) {
  try {
    yield call(signUpAPI, action.data); // action.data라는 inputdmf signUpAPI 로 전달해준다
    yield put({
      // put은 dispatch 동일
      type: SIGN_UP_SUCCESS,
    });
  } catch (e) {
    // loginAPI 실패
    console.error(e);
    yield put({
      type: SIGN_UP_FAILURE,
      error: e,
    });
  }
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

function logOutAPI() {
  // 서버에 요청을 보내는 부분
  return axios.post(
    '/user/logout',
    {},
    {
      withCredentials: true,
    }
  );
}

function* logOut() {
  try {
    // yield call(logOutAPI);
    yield call(logOutAPI);
    yield put({
      // put은 dispatch 동일
      type: LOG_OUT_SUCCESS,
    });
  } catch (e) {
    // loginAPI 실패
    console.error(e);
    yield put({
      type: LOG_OUT_FAILURE,
      error: e,
    });
  }
}

function* watchLogOut() {
  yield takeEvery(LOG_OUT_REQUEST, logOut);
}

function loadUserAPI() {
  // 서버에 요청을 보내는 부분
  return axios.get('/user/', {
    withCredentials: true,
  });
}

function* loadUser() {
  try {
    // yield call(loadUserAPI);
    const result = yield call(loadUserAPI);
    yield put({
      // put은 dispatch 동일
      type: LOAD_USER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    // loginAPI 실패
    console.error(e);
    yield put({
      type: LOAD_USER_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUser() {
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

export default function* userSaga() {
  yield all([
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchLoadUser),
    fork(watchSignUp),
  ]);
}
// take(api) : api라는 action이 들어올때까지 기다리는것.
// takeLatest : 이전 요청중 끝나지 않은게 있다면 이전요청을 취소한다.
// 액션을 여러번 신청하면 가장 마지막 요청만 처리한다.
// takeEvery(action, function) : while(true) 같은 역할을 해줌. action 들어오면 function실행.
// while(true)를 쓸지 takeEvery 를 쓸지는 취향차이.
// call : 함수의 동기요청. 응답이 받아질때까지 기다린 뒤에 put함 / fork : 함수의 비동기요청.
