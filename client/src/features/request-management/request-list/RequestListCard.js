import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import {connect} from "react-redux"

export function RequestListCard({requestListData, dispatch}) {
  return (
    <div>
      <Card>
        <CardContent>
          <Typography gutterBottom>                
            Request List Card
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

const mapStateToProps = (state) => ({
  requestListData: state.requestListData,
})

export default connect(mapStateToProps)(RequestListCard)
