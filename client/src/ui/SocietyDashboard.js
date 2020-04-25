import React from 'react'
import SocietyFormList from '../features/form-management/form-list/SocietyFormList'
import SocietyFormSubmissionList from '../features/request-management/SocietyFormSubmissionList'

export default function SocietyDashboard() {

  return (
    <div>
      <SocietyFormSubmissionList userId="lumun"/>
      <SocietyFormList/>
    </div>
  )
}