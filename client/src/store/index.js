import { configureStore } from '@reduxjs/toolkit'
import taskDataReducer from '../features/task-management/taskdataSlice'
import taskStatusDetailsReducer from '../features/account-settings/taskStatusDetailsSlice'
import societyDataReducer from '../features/account-settings/societyDataSlice'

export default configureStore({
  reducer: {
    taskData: taskDataReducer,
    taskStatusDetails: taskStatusDetailsReducer,
    societyData: societyDataReducer
  },
})
