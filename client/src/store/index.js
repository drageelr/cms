import { configureStore } from '@reduxjs/toolkit'
import taskDataReducer from '../features/task-management/taskdataSlice'
import requestListReducer from '../features/request-management/requestListSlice'
import formDataReducer from '../features/form-management/formDataSlice'
import formTemplateReducer from '../features/form-management/formTemplateSlice'


export default configureStore({
  reducer: {
    taskData: taskDataReducer,
    requestListData: requestListReducer,
    formTemplate: formTemplateReducer,
    formData: formDataReducer
  },
})
