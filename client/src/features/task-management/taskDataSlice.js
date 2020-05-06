import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiCaller } from '../../helpers'

/**
  A temporary initial state has been created to test with the components and render meaningful
  on the screen. The action creators in the reducer are responsible for implementing the changes 
  that the user makes when editing the task.
*/

const initialState = {
  archiveList: [],
  checkList: [],
  taskList: [], 
  checklistAssignees: [],
  isPending: false,
  error: null
}

export const fetchTaskManager = createAsyncThunk(
  'taskData/fetchTaskManager',
  async (_, { getState, rejectWithValue }) => {
    const { isPending } = getState().taskData
    if (isPending != true) {
      return
    }
    return await apiCaller('/api/task-manager/fetch', {}, 200, 
    (data) =>(data), 
    rejectWithValue)  
  }
)

export const fetchTask = createAsyncThunk(
  'taskData/fetchTask',
  async (archiveObj, { getState, rejectWithValue }) => {
    const {taskId, ownerId} = archiveObj

    const { isPending } = getState().taskData
    if (isPending != true) {
      return
    } 

    return await apiCaller('/api/task-manager/task/fetch', { taskId }, 200, 
    (data) => ({data, archiveObj}), 
    rejectWithValue)  
  }
)

export const fetchCheckList = createAsyncThunk(
  'taskData/fetchCheckList',
  async (idObj, { getState, rejectWithValue }) => {
    const { isPending } = getState().taskData
    if (isPending != true) {
      return
    } 
    const { ownerId, submissionId } = idObj
    
    return await apiCaller('/api/form/fetch-checklist', { submissionId }, 200, 
    (data) => ({data, idObj}), rejectWithValue)    
  }
)

export const fetchArchiveManager = createAsyncThunk(
  'taskData/fetchArchiveManager',
  async (_, { getState, rejectWithValue }) => {
    const { isPending } = getState().taskData
    if (isPending != true) {
      return
    } 

    return await apiCaller('/api/task-manager/fetch-archive', {}, 200, 
    (data) => (data), rejectWithValue)
  }
)

export const createRequestTask = createAsyncThunk( // GIVES INTERNAL SERVER ERROR
  'taskData/createRequestTask',
  async (reqTaskObject, { getState, rejectWithValue }) => {
    const { title, description, submissionId, ownerId, statusId } = reqTaskObject
    const checklistIds = getState().taskData.checklistAssignees

    return await apiCaller('/api/task-manager/task/req/create', {
      task: {
        title,
        description,
        submissionId,
        ownerId,
        statusId,
        checklistIds
      }
    }, 201, 
    (data) => ({data, reqTaskObject}), 
    rejectWithValue)  
  }
)

export const createCustomTask = createAsyncThunk(
  'taskData/createCustomTask',
  async (cusTaskObject, { rejectWithValue }) => {
    const { title, description, ownerId, statusId } = cusTaskObject

    return await apiCaller('/api/task-manager/task/cus/create', {
      task: {
        title: title,
        description: description,
        ownerId: ownerId,
        statusId: statusId
      }
    }, 201, 
    (data) => ({data, cusTaskObject}), 
    rejectWithValue)
  }
)

export const createNewLog = createAsyncThunk(
  'taskData/createNewLog',
  async (logObj, { rejectWithValue }) => {
    const { taskId, creatorId, logText } = logObj
  
    return await apiCaller('/api/task-manager/log/add', {
      taskId: taskId,
      description: logText
    }, 201, 
    (data) => ({data, logObj}), 
    rejectWithValue)  
  }
)

export const moveTask = createAsyncThunk(
  'taskData/moveTask',
  async (editTaskObject, { rejectWithValue }) => {
    const { taskId, srcColumnId, dstColumnId } = editTaskObject

    return await apiCaller(taskId[0] === 'r' ? '/api/task-manager/task/req/edit' : '/api/task-manager/task/cus/edit', {
      task: {
        taskId: taskId,
        ownerId: Number(dstColumnId)
      }
    }, 200, 
    (data) => ({data, editTaskObject}), 
    rejectWithValue)
  }
)

export const moveSubTask = createAsyncThunk(
  'taskData/moveSubTask',
  async (subTaskObject, { getState, rejectWithValue }) => {
    const { mainTaskId } = subTaskObject
    
    let taskList1 = getState().taskData.taskList
    let subTaskList = []
    taskList1.map((task, index) => {
      if (task.taskId === mainTaskId) {
        subTaskList = getState().taskData.taskList[index].subtasks
      }
    })
    
    let tempSubList = []
    
    subTaskList.map(obj => {
      tempSubList.push({
        subtaskId: obj.subtaskId,
        assigneeId: obj.assigneeId,
        description: obj.description, 
        check: obj.check
      })
    })

    return await apiCaller('/api/task-manager/task/req/edit', {
      task: {
        taskId: mainTaskId,
        subtasks: tempSubList
      }
    }, 200, 
    (data) => ({data, mainTaskId}), 
    rejectWithValue)
  }
)

export const deleteSubTask = createAsyncThunk(
  'taskData/deleteSubTask',
  async (subTaskObject, { getState, rejectWithValue }) => {
    const { mainTaskId, subTaskList } = subTaskObject
    let tempSubList = []
    
    subTaskList.map(obj => {
      tempSubList.push({
        subtaskId: obj.subtaskId,
        assigneeId: obj.assigneeId,
        description: obj.description, 
        check: false
      })
    })

    return await apiCaller('/api/task-manager/task/req/edit', {
      task: {
        taskId: mainTaskId,
        subtasks: tempSubList
      }
    }, 200, 
    (data) => ({data, mainTaskId}), 
    rejectWithValue)
  }
)

export const taskOwnerChange = createAsyncThunk(
  'taskData/taskOwnerChange',
  async (ownerChangeObj, { rejectWithValue }) => {
    const { taskId, owner } = ownerChangeObj
    console.log(ownerChangeObj) 

    return await apiCaller(taskId[0] === 'r' ? '/api/task-manager/task/req/edit' : '/api/task-manager/task/cus/edit', {
      task: {
        taskId: taskId,
        ownerId: Number(owner)
      }
    }, 200, 
    (data) => ({data, ownerChangeObj}), 
    rejectWithValue)
  }
)

export const updateTitle = createAsyncThunk(
  'taskData/updateTitle',
  async (titleObj, { rejectWithValue }) => {
    const { taskId, newTitle } = titleObj

    return await apiCaller(taskId[0] === 'r' ? '/api/task-manager/task/req/edit' : '/api/task-manager/task/cus/edit', {
      task: {
        taskId: taskId,
        title: newTitle
      }
    }, 200, 
    (data) => ({data, titleObj}), 
    rejectWithValue)
  }
)

export const updateDescription = createAsyncThunk(
  'taskData/updateDescription',
  async (descObj, { rejectWithValue }) => {
    const { taskId, desc } = descObj
    
    return await apiCaller(taskId[0] === 'r' ? '/api/task-manager/task/req/edit' : '/api/task-manager/task/cus/edit', {
      task: {
        taskId: taskId,
        description: desc
      }
    }, 200, 
    (data) => ({data, descObj}), 
    rejectWithValue)
  }
)

export const changeTaskStatus = createAsyncThunk(
  'taskData/changeTaskStatus',
  async (statusObj, { rejectWithValue }) => {
    const { taskId, statusId } = statusObj
    
    return await apiCaller(taskId[0] === 'r' ? '/api/task-manager/task/req/edit' : '/api/task-manager/task/cus/edit', {
      task: {
        taskId: taskId,
        statusId: statusId
      }
    }, 200, 
    (data) => ({data, statusObj}), 
    rejectWithValue)   
  }
)

export const archiveTask = createAsyncThunk(
  'taskData/archiveTask',
  async (archiveObj, { rejectWithValue }) => {
    const { taskId, ownerId } = archiveObj
    
    return await apiCaller(taskId[0] === 'r' ? '/api/task-manager/task/req/edit' : '/api/task-manager/task/cus/edit', {
      task: {
        taskId: taskId,
        archive: true
      }
    }, 200, 
    (data) => ({data, archiveObj}), 
    rejectWithValue)   
  }
)

const taskdata = createSlice({
  name: 'taskData',
  initialState: initialState,
  reducers: {
    addTaskAssignees: (state, action) => {
      const {taskId, value} = action.payload
      
      state.tasks[taskId].assigneeList.push(value)
    },
    
    deleteTaskAssignee: (state, action) => {
      const {taskId, person} = action.payload
      
      state.tasks[taskId].assigneeList.map(name =>{
        if(name === person) {
          var filteredAry = state.tasks[taskId].assigneeList.filter(function(e) { return e !== name })
          state.tasks[taskId].assigneeList = filteredAry
        }
      })
    },

    subTaskDisplay: (state, action) => {
      const {taskId} = action.payload

      state.taskList.map(subtaskObj => {
        if (subtaskObj.taskId === taskId) { // get the subtask Obj from the task list
          state.taskList.map(taskObj => {
            if (taskObj.taskId === subtaskObj.assTaskId) { // get the task obj from task list to which the sub task is associated
              taskObj.subtasks.map(assSubTask => {
                if (assSubTask.taskId === taskId) { // get the subtask from the task that is same as the current subtask
                  // assSubTask.check = false
                  subtaskObj.check = false
                }
              })
            }
          })
        }
      })
    },

    editSubTask: (state, action) => {
      const {subTaskId, srcColumnId, dstColumnId} = action.payload

      let taskId = ""
      let subI = -1 // subtask index (which is in the main taskList)
      let subSubI = -1 // subtask index (which is in the main task's subtask list)
      let taskIndex = -1 // main task index
      
      state.taskList.map((task, index) => {
        if (task.taskId === subTaskId) { // get the subtask in the taskList
          subI = index
        }
      })

      taskId = state.taskList[subI].assTaskId // main task Id
      state.taskList[subI].ownerId = Number(dstColumnId) // change the subtasks ownerId - outside the task
      state.taskList[subI].assigneeId = Number(dstColumnId) // change the subtask assigneeId - outside the task

      state.taskList.map((task, index) => {
        if (task.taskId === taskId) {
          taskIndex = index
          task.subtasks.forEach((subTask, index) => {
            if (subTask.taskId === subTaskId) {
              subSubI = index
            }
          })
        }
      })

      state.taskList[taskIndex].subtasks[subSubI].ownerId = Number(dstColumnId) 
      state.taskList[taskIndex].subtasks[subSubI].assigneeId = Number(dstColumnId) 
    },

    moveTaskSync: (state, action) => {
      const editTaskObject = action.payload

      state.taskList.forEach(taskObj => {
        if(taskObj.taskId === editTaskObject.taskId) {
          taskObj.ownerId = Number(action.payload.dstColumnId)
        }
      })
    },

    clearError: (state, action) => {
      state.error = null
    }
  },

  extraReducers: {
    [fetchTaskManager.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchTaskManager.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false

        state.taskList = action.payload.taskList

        state.taskList.map(taskObj => {
          if (taskObj.taskId[0] === 'r' && taskObj.subtasks.length !== 0) {
            taskObj.subtasks.map((subObj, index) => {
              let subTaskObj = {
                taskId: `s${subObj.subtaskId}`,
                subtaskId: subObj.subtaskId,
                assTaskId: taskObj.taskId,
                ownerId: subObj.assigneeId,
                assigneeId: subObj.assigneeId,
                description: subObj.description,
                check: subObj.check
              }
              taskObj.subtasks[index] = subTaskObj
              state.taskList.push(subTaskObj)
            })
          }
        })
      }
    },
    [fetchTaskManager.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [fetchCheckList.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },

    [fetchCheckList.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        const {idObj, data} = action.payload
        state.checkList = data.checklists

        state.checklistAssignees = data.checklists.map(checklistItem => ({
            checklistId: checklistItem.checklistId, 
            assigneeId: idObj.ownerId
          })
        )
      }
    },
    
    [fetchCheckList.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [fetchArchiveManager.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchArchiveManager.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.archiveList = action.payload.data.taskList
      }
    },
    [fetchArchiveManager.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [fetchTask.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchTask.fulfilled]: (state, action) => { // works for unarchive too as it fetches and pushes the task obj to the list
      const {data, archiveObj} = action.payload

      console.log(data)
      state.taskList.push(data.task)

      state.archiveList.map(arcObj => {
        if(arcObj.taskId === archiveObj.taskId) {
          arcObj.archive = false
        }
      })

      var filteredAry = state.archiveList.filter(function(e) { return e.taskId !== archiveObj.taskId })
      state.archiveList = filteredAry
    },
    [fetchTask.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [createRequestTask.fulfilled]: (state, action) => {
      const {data, reqTaskObject} = action.payload
      let subTaskList = []
      data.subtasks.map(subTask => {
        let subTaskObj = {
          taskId: `s${subTask.subtaskId}`,
          subtaskId: subTask.subtaskId,
          assTaskId: data.taskId,
          ownerId: subTask.assigneeId,
          assigneeId: subTask.assigneeId,
          description: subTask.description,
          check: true
        }
        subTaskList.push(subTaskObj)
        state.taskList.push(subTaskObj)
      })

      state.taskList.push({
        taskId: data.taskId,
        logs: data.logs,
        subTasks: subTaskList,
        ...reqTaskObject
      })
      state.error = 'Request Task Created'
    },
    [createRequestTask.rejected]: (state, action) => {
      state.error = action.payload
    },

    [createCustomTask.fulfilled]: (state, action) => {
      state.taskList.push({
        taskId: action.payload.data.taskId,
        logs: action.payload.data.logs,
        ...action.payload.cusTaskObject
      })
      state.error = 'Custom Task Created'
    },
    [createCustomTask.rejected]: (state, action) => {
      state.error = action.payload
    },

    [createNewLog.fulfilled]: (state, action) => {
      const { data, logObj } = action.payload
      
      state.taskList.map(taskObj => {
        if(taskObj.taskId === logObj.taskId) {
          taskObj.logs.push({
            logId: data.logId,
            creatorId: logObj.creatorId,
            description: logObj.logText,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          })
        }
      })
    },

    [createNewLog.rejected]: (state, action) => {
      state.error = action.payload
    },

    [moveTask.fulfilled]: (state, action) => {
      const {data, editTaskObject} = action.payload

      state.taskList.forEach(taskObj => {
        if(taskObj.taskId === editTaskObject.taskId) {
          taskObj.logs.push(data.newLog)
        }
      })
    },

    [moveTask.rejected]: (state, action) => {
      state.error = action.payload
    },

    [moveSubTask.fulfilled]: (state, action) => {
      const { data, mainTaskId } = action.payload
      
      state.taskList.map(taskObj => {
        if(taskObj.taskId === mainTaskId) {
          taskObj.logs.push(data.newLog)
        }
      })
    },
    [moveSubTask.rejected]: (state, action) => {
      state.error = action.payload
    },

    [deleteSubTask.fulfilled]: (state, action) => {
      const { data, mainTaskId } = action.payload
      
      // state.taskList.map(taskObj => {
      //   if(taskObj.taskId === mainTaskId) {
      //     taskObj.logs.push(data.newLog)
      //   }
      // })
    },
    [deleteSubTask.rejected]: (state, action) => {
      state.error = action.payload
    },

    [taskOwnerChange.fulfilled]: (state, action) => {
      const {data, ownerChangeObj} = action.payload
      
      state.taskList.map(taskObj => {
        if (taskObj.taskId === ownerChangeObj.taskId) {
          taskObj.ownerId = ownerChangeObj.owner
          taskObj.logs.push(data.newLog)
        }
      })
    },
    [taskOwnerChange.rejected]: (state, action) => {
      state.error = action.payload
    },

    [updateTitle.fulfilled]: (state, action) => {
      const {data, titleObj} = action.payload
      
      state.taskList.map(taskObj => {
        if (taskObj.taskId === titleObj.taskId) {
          taskObj.title = titleObj.newTitle
          taskObj.logs.push(data.newLog)
        }
      })
    },
    [updateTitle.rejected]: (state, action) => {
      state.error = action.payload
    },

    [updateDescription.fulfilled]: (state, action) => {
      const {data, descObj} = action.payload

      state.taskList.map(taskObj => {
        if (taskObj.taskId === descObj.taskId) {
          taskObj.description = descObj.desc
          taskObj.logs.push(data.newLog)
        }
      })
    },
    [updateDescription.rejected]: (state, action) => {
      state.error = action.payload
    },

    [changeTaskStatus.fulfilled]: (state, action) => {
      const {data, statusObj} = action.payload

      state.taskList.map(taskObj => {
        if(taskObj.taskId === statusObj.taskId) {
          taskObj.statusId = statusObj.statusId
          taskObj.logs.push(data.newLog)
        }
      })
    },
    [changeTaskStatus.rejected]: (state, action) => {
      state.error = action.payload
    },

    [archiveTask.fulfilled]: (state, action) => {
      const {data, archiveObj} = action.payload

      state.taskList.map(task => {
        if(task.taskId === archiveObj.taskId) {
          task.archive = true
          state.archiveList.push(task)
          task.logs.push(data.newLog)
        }
      })
    },
    [archiveTask.rejected]: (state, action) => {
      state.error = action.payload
    },
  }
})

export const {
  addTaskAssignees,
  deleteTaskAssignee,
  subTaskDisplay, 
  editSubTask,
  moveTaskSync,
  clearError
} = taskdata.actions

export default taskdata.reducer