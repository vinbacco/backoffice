import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CButton, CCol, CFormInput, CFormLabel, CImage, CInputGroup, CRow,
} from '@coreui/react';

const ImageWithPreview = ({
  title, label, data, onUpload,
}) => {
  const [newImageFile, setNewImageFile] = useState(undefined);
  const inputRef = useRef(null);

  const handleOnChange = () => {
    setNewImageFile(inputRef.current.files[0]);
  };

  const handleOnUpload = () => {
    onUpload(newImageFile);
  };

  return (
    <div className="pb-4">
      <h4>{title}</h4>
      <CRow className="g-3">
        <CCol md="auto" sm={12}>
          <CImage className="div-image-preview" src={data?.path || null} />
        </CCol>
        <CCol md="auto" sm={12}>
          <CFormLabel htmlFor="formFileImageGallery">{label}</CFormLabel>
          <CInputGroup>
            <CFormInput aria-describedby="uploadNewImage" ref={inputRef} type="file" id="formFileImageGallery" onChange={handleOnChange} accept="image/*" />
            <CButton disabled={typeof newImageFile === 'undefined'} type="button" color="primary" id="uploadNewImage" onClick={handleOnUpload}>Carica</CButton>
          </CInputGroup>
        </CCol>
      </CRow>
    </div>
  );
};

ImageWithPreview.propTypes = {
  data: PropTypes.shape({
    path: PropTypes.string,
    filename: PropTypes.string,
  }) || null,
  title: PropTypes.string,
  label: PropTypes.string,
  onUpload: PropTypes.func.isRequired,
};

ImageWithPreview.defaultProps = {
  data: null,
  title: 'Immagine',
  label: 'Inserisci qui la tua immagine',
};

export default ImageWithPreview;
