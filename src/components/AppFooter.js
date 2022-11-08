import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">
          CoreUI
        </a>
        <span className="ms-1">&copy; {new Date().getFullYear()} RUSHNET.S.r.l.</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
