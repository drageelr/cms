import { configureStore } from '@reduxjs/toolkit'
import taskDataReducer from '../features/task-management/taskdataSlice'

export default configureStore({
  reducer: {
    taskData: taskDataReducer,
  },
})
