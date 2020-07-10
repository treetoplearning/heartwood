import React from "react"
import Loadable from 'react-loadable'

const LoadableCallendar=Loadable({loader:()=>import('../components/lessoncalendar'),
    loading() {
        return <div className="w-screen min-h-screen bg-base"></div>
      }})

export default () => <><LoadableCallendar/></>
