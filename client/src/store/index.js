import { configureStore } from '@reduxjs/toolkit'
import taskDataReducer from '../features/task-management/taskdataSlice'
import requestListReducer from '../features/request-management/requestListSlice'

export default configureStore({
  reducer: {
    taskData: taskDataReducer,
    requestListData: requestListReducer
  },
})
