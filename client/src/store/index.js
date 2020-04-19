import { configureStore } from '@reduxjs/toolkit'
import taskDataReducer from '../features/task-management/taskDataSlice'
import requestListReducer from '../features/request-management/requestListSlice'

export default configureStore({
  reducer: {
    taskData: taskDataReducer,
    requestListData: requestListReducer,
  },
})
