/* eslint-disable react/forbid-prop-types */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CButton,
  CCol,
  CFormInput,
  CFormLabel,
  CImage,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react';
import AppLoadingSpinner from '../AppLoadingSpinner';

const ImageWithPreview = ({
  title, label, data, onUpdate, Service, contentId, contentType,
}) => {
  const sectionService = new Service();
  const [newImageFile, setNewImageFile] = useState(undefined);
  const [insertState, setInsertState] = useState({
    error: null, executing: false, success: null, show: false,
  });
  const [deleteState, setDeleteState] = useState({
    error: null, executing: false, success: null, show: false, target: null,
  });
  const inputRef = useRef(null);

  const handleOnUpload = () => {
    const newInsertState = { ...insertState };
    newInsertState.show = true;
    newInsertState.executing = true;
    setInsertState(newInsertState);
    const mediaContentData = {
      file: newImageFile,
      type: contentType,
    };
    const okUploadMediaContent = (loadResponse) => {
      setNewImageFile(undefined);
      inputRef.current.value = null;
      newInsertState.executing = false;
      newInsertState.success = true;
      onUpdate({ response: loadResponse, job: 'upload' });
      setInsertState(newInsertState);
    };
    const koUploadMediaContent = (error) => {
      newInsertState.executing = false;
      newInsertState.success = false;
      newInsertState.error = error;
      setInsertState(newInsertState);
    };

    if (data !== null && data.child_id !== null) {
      sectionService
        .updateMediaContent(
          contentId,
          data.child_id,
          mediaContentData,
          okUploadMediaContent,
          koUploadMediaContent,
        );
    } else {
      sectionService
        .addMediaContent(
          contentId,
          mediaContentData,
          okUploadMediaContent,
          koUploadMediaContent,
        );
    }
  };

  const deleteMediaContent = () => {
    if (data !== null && data.child_id !== null) {
      setDeleteState({ ...deleteState, executing: true });
      const okDeleteMediaContent = () => {
        onUpdate({ job: 'delete' });
        setDeleteState({ ...deleteState, executing: false, success: true });
      };
      const koDeleteMediaContent = (error) => {
        setDeleteState({
          ...deleteState, executing: false, success: false, error,
        });
      };
      return sectionService
        .deleteMediaContent(contentId, data.child_id, okDeleteMediaContent, koDeleteMediaContent);
    }
    return null;
  };

  const renderDeleteModal = () => {
    let renderLabel = "Sei sicuro di voler eliminare l'immagine? Questa azione non può essere annullata.";
    if (deleteState.success === true) {
      renderLabel = 'Operazione completata con successo.';
    } else if (deleteState.success === false) {
      renderLabel = "Si è verificato un errore nell'esecuzione dell'operazione.";
    }
    return (
      <CModal backdrop="static" visible={deleteState.show}>
        <CModalHeader closeButton={false}>
          <CModalTitle>Eliminare immagine</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {deleteState.executing === true ? <AppLoadingSpinner /> : renderLabel}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            disabled={deleteState.executing === true}
            onClick={() => (
              setDeleteState({
                ...deleteState, target: null, show: false,
              })
            )}
          >
            {deleteState.success === null ? 'Annulla' : 'Chiudi'}
          </CButton>
          {deleteState.success === null && (
            <CButton color="primary" disabled={deleteState.executing === true} onClick={() => deleteMediaContent()}>Si</CButton>
          )}
        </CModalFooter>
      </CModal>
    );
  };

  const renderInsertModal = () => {
    let renderLabel = '';
    if (insertState.success === true) {
      renderLabel = 'Operazione completata con successo.';
    } else if (insertState.success === false) {
      renderLabel = "Si è verificato un errore nell'esecuzione dell'operazione.";
    }
    return (
      <CModal backdrop="static" visible={insertState.show}>
        <CModalHeader closeButton={false}>
          <CModalTitle>Carica immagine</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {insertState.executing === true ? <AppLoadingSpinner /> : renderLabel}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            disabled={insertState.executing === true}
            onClick={() => (
              setInsertState({
                ...insertState, show: false,
              })
            )}
          >
            {insertState.success === null ? 'Annulla' : 'Chiudi'}
          </CButton>
        </CModalFooter>
      </CModal>
    );
  };

  const handleOnChange = () => {
    setNewImageFile(inputRef.current.files[0]);
  };

  return (
    <>
      <div className="pb-4">
        <h4>{title}</h4>
        <CRow className="g-3">
          <CCol md="auto" sm={12}>
            <span className="div-image-preview-placeholder">
              {!!data && !!data.path && (<CImage className="div-image-preview" src={data?.path || ''} />)}
            </span>
          </CCol>
          <CCol md="auto" sm={12}>
            <CFormLabel htmlFor="formFileImageGallery">{label}</CFormLabel>
            <CInputGroup>
              <CFormInput aria-describedby="uploadImage" ref={inputRef} type="file" id="formFileImageGallery" onChange={handleOnChange} accept="image/*" />
              <CButton
                disabled={typeof newImageFile === 'undefined'}
                type="button"
                color="primary"
                id="uploadImage"
                onClick={handleOnUpload}
              >
                Carica
              </CButton>
              <CButton
                disabled={data === null || data.child_id === null}
                type="button"
                color="danger"
                id="deleteImage"
                onClick={() => (
                  setDeleteState({
                    ...deleteState,
                    show: true,
                    success: null,
                    error: null,
                  })
                )}
              >
                Elimina
              </CButton>
            </CInputGroup>
          </CCol>
        </CRow>
      </div>
      {renderInsertModal()}
      {renderDeleteModal()}
    </>
  );
};

ImageWithPreview.propTypes = {
  Service: PropTypes.func.isRequired,
  contentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  contentType: PropTypes.string.isRequired,
  data: PropTypes.any,
  title: PropTypes.string,
  label: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
};

ImageWithPreview.defaultProps = {
  data: null,
  title: 'Galleria',
  label: 'Inserisci qui la tua immagine',
};

export default ImageWithPreview;
