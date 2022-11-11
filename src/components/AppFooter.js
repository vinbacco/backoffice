import React from 'react';
import { CFooter } from '@coreui/react';

function AppFooter() {
  return (
    <CFooter>
      <div>
        <span className="ms-1">
          &copy;
          {new Date().getFullYear()}
          {' '}
          RUSHNET.S.r.l.
        </span>
      </div>
    </CFooter>
  );
}

export default React.memo(AppFooter);
