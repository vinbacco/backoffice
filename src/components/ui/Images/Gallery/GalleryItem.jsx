import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CButton, CImage } from '@coreui/react';
import { cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

function GalleryItem(props) {
  const {
    setCurrentPreview, setDeleteState, changeImageName, currentData, deleteState, changeTitle,
  } = props;
  const [currentChangeName, setCurrentChangeName] = useState(currentData.filename);

  return (
    <span className="gallery-item">
      <CImage onClick={() => setCurrentPreview({ id: `image-item-${currentData.child_id}`, data: currentData })} className="gallery-item-image" thumbnail src={currentData.path} />
      <CButton
        className="gallery-item-delete"
        color="danger"
        size="sm"
        onClick={() => (
          setDeleteState({
            ...deleteState,
            target: currentData.child_id,
            show: true,
            success: null,
            error: null,
          })
        )}
      >
        <CIcon icon={cilX} />
      </CButton>
      {changeTitle === true && (
      <input
        className="gallery-item-text"
        type="text"
        value={currentChangeName}
        onFocus={() => setCurrentChangeName(currentData.filename)}
        onChange={(event) => setCurrentChangeName(event.target.value)}
        onBlur={(event) => changeImageName(currentData.child_id, event.target.value)}
      />
      )}
    </span>
  );
}

GalleryItem.propTypes = {
  setCurrentPreview: PropTypes.func.isRequired,
  setDeleteState: PropTypes.func.isRequired,
  changeImageName: PropTypes.func.isRequired,
  currentData: PropTypes.shape({
    child_id: PropTypes.string || '',
    path: PropTypes.string || '',
    filename: PropTypes.string || '',
  }).isRequired,
  deleteState: PropTypes.shape({
    error: PropTypes.string || null,
    executing: PropTypes.bool || false,
    success: PropTypes.string || null,
    show: PropTypes.bool || false,
    target: PropTypes.string || null,
  }).isRequired,
  changeTitle: PropTypes.bool.isRequired,
};

export default GalleryItem;
