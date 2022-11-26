/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React, { Component, useRef, useState } from 'react';
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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import AppLoadingSpinner from '../AppLoadingSpinner';

/**
 * TODO:
 * - Verificare il cambio di contenuto quando una nuova immagine viene inserita
 * - Verificare il cambio di contenuto quando un'immagine esistente viene cancellata
 * - Assicurarsi che il cambio ordine delle immagine sorge effetto nel salvataggio del contenuto
 */

const Gallery = ({
  title, label, data, instructions, onUpdate, Service, contentId, contentType,
}) => {
  const sectionService = new Service();
  const [currentPreview, setCurrentPreview] = useState(null);
  const [newImageFile, setNewImageFile] = useState(undefined);
  const inputRef = useRef(null);
  const [componentDisable, setComponentDisable] = useState(false);
  const [insertState, setInsertState] = useState({
    error: null, executing: false, success: null, show: false,
  });
  const [deleteState, setDeleteState] = useState({
    error: null, executing: false, success: null, show: false, target: null,
  });

  const processData = (incomingData) => incomingData.map((currentData) => ({
    id: `image-item-${currentData.child_id}`,
    content: (
      <span className="gallery-item">
        <CImage onClick={() => setCurrentPreview(currentData.path)} className="gallery-item-image" thumbnail src={currentData.path} />
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
      </span>
    ),
    data: currentData,
  }));

  const [galleryState, setGalleryState] = useState({
    items: processData(data),
  });

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const grid = 8;

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    borderRadius: 15,
    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',
    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const getListStyle = () => ({
    background: 'lightgrey',
    padding: grid,
    width: 200,
    minHeight: '100%',
    margin: 'auto',
    borderRadius: 15,
  });

  const processChangeOrder = (newOrder) => {
    const newArray = [];
    newOrder.forEach((current) => newArray.push(current.data));
    onUpdate(newArray);
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const items = reorder(
      galleryState.items,
      result.source.index,
      result.destination.index,
    );
    setGalleryState({ items });
    processChangeOrder(items);
  };

  const handleOnChange = () => {
    setNewImageFile(inputRef.current.files[0]);
  };

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
      const newData = [...data];
      newData.push(loadResponse.data);
      setGalleryState({ items: processData(newData) });
      onUpdate(newData);
      setInsertState(newInsertState);
    };
    const koUploadMediaContent = (error) => {
      newInsertState.executing = false;
      newInsertState.success = false;
      newInsertState.error = error;
      setInsertState(newInsertState);
    };
    sectionService
      .addMediaContent(contentId, mediaContentData, okUploadMediaContent, koUploadMediaContent);
  };

  const deleteMediaContent = (mediaId) => {
    setDeleteState({ ...deleteState, executing: true });
    const okDeleteMediaContent = () => {
      const newData = [...data];
      const mediaIndex = newData.findIndex((currentMedia) => currentMedia.child_id === mediaId);
      newData.splice(mediaIndex, 1);
      setGalleryState({ items: processData(newData) });
      onUpdate(newData);
      setDeleteState({ ...deleteState, executing: false, success: true });
    };
    const koDeleteMediaContent = (error) => {
      setDeleteState({
        ...deleteState, executing: false, success: false, error,
      });
    };
    return sectionService
      .deleteMediaContent(contentId, mediaId, okDeleteMediaContent, koDeleteMediaContent);
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
            <CButton color="primary" disabled={deleteState.executing === true} onClick={() => deleteMediaContent(deleteState.target)}>Si</CButton>
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

  return (
    <>
      <div className="pt-4 pb-4">
        <h4>{title}</h4>
        <CRow className="mt-4">
          <CCol lg={4} md={6} sm={12}>
            <CFormLabel htmlFor="formFileImageGallery">{label}</CFormLabel>
            <CInputGroup>
              <CFormInput aria-describedby="uploadNewImage" ref={inputRef} type="file" id="formFileImageGallery" onChange={handleOnChange} accept="image/*" />
              <CButton
                disabled={typeof newImageFile === 'undefined' || insertState.executing}
                type="button"
                color="primary"
                id="uploadNewImage"
                onClick={handleOnUpload}
              >
                Carica
              </CButton>
            </CInputGroup>
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <CCol lg={4} md={6} sm={12}>
            <div className="mt-4">
              <small>{instructions}</small>
              <div className="mt-2 div-gallery-drag-drop">
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable" isDropDisabled={componentDisable}>
                    {(droppableProvided, droppableSnapshot) => (
                      <div
                        {...droppableProvided.droppableProps}
                        ref={droppableProvided.innerRef}
                        style={getListStyle(droppableSnapshot.isDraggingOver)}
                      >
                        {galleryState.items.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                            isDragDisabled={componentDisable}
                          >
                            {(draggableProvided, draggableSnapshot) => (
                              <div
                                ref={draggableProvided.innerRef}
                                {...draggableProvided.draggableProps}
                                {...draggableProvided.dragHandleProps}
                                style={getItemStyle(
                                  draggableSnapshot.isDragging,
                                  draggableProvided.draggableProps.style,
                                )}
                              >
                                {item.content}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {droppableProvided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          </CCol>
          <CCol lg={8} md={6} sm={12}>
            <h6 className="mt-4">Preview immagine scelta</h6>
            <CImage className="div-gallery-preview" src={currentPreview} />
          </CCol>
        </CRow>
      </div>
      {renderInsertModal()}
      {renderDeleteModal()}
    </>
  );
};

Gallery.propTypes = {
  Service: PropTypes.func.isRequired,
  contentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  contentType: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.any),
  title: PropTypes.string,
  label: PropTypes.string,
  instructions: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
};

Gallery.defaultProps = {
  data: [],
  title: 'Galleria',
  label: 'Inserisci qui la tua immagine',
  instructions: "Trascina e rilascia le immagini per cambiare l'ordine",
};

export default Gallery;
