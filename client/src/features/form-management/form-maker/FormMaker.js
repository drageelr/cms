import React from 'react'
import FormMakerBar from './FormMakerBar'
import Properties from './Properties'
import Section from './Section'
import {connect} from 'react-redux'

function FormMaker({formTemplate}) {
  return (
    <div>
      <Properties isItem={false}/>
      <FormMakerBar title={formTemplate.title} />
    </div>
  )
}

const mapStateToProps = (state) => ({
  formTemplate: state.formTemplate,
})

export default connect(mapStateToProps) (FormMaker)