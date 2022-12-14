/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
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
import ImagePlaceholder from 'src/assets/images/placeholder.png';
import AppLoadingSpinner from '../../AppLoadingSpinner';
import GalleryItem from './GalleryItem';

const Gallery = ({
  title, label, data, instructions, onUpdate, Service, contentId, contentType, changeTitle,
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

  const changeImageName = (imageId, newName) => {
    const imageIndexArray = data.findIndex((currentImage) => currentImage.child_id === imageId);
    const imageData = data.find((currentImage) => currentImage.child_id === imageId);
    if (
      typeof imageData !== 'undefined' &&
      imageIndexArray >= 0 &&
      imageData.filename !== newName
    ) {
      const updatePromise = new Promise((resolve, reject) => {
        setComponentDisable(true);
        const newImageData = { ...imageData };
        newImageData.filename = newName;
        const okChangeNameMediaContent = (loadResponse) => {
          const newArray = [...data];
          newArray[imageIndexArray] = { ...loadResponse.data };
          onUpdate(newArray);
          setComponentDisable(false);
          resolve();
        };

        const koChangeNameMediaContent = (error) => {
          setComponentDisable(false);
          reject();
        };

        sectionService
          .updateMediaContentData(
            contentId,
            imageId,
            newImageData,
            okChangeNameMediaContent,
            koChangeNameMediaContent,
          );
      });

      toast.promise(updatePromise, {
        loading: 'Attendere, salvando nome dell\'immagine...',
        success: 'Nome dell\'immagine salvato con successo!',
        error: 'Ops, si ?? verificato un errore nel cambio nome!',
      }, {
        success: {
          duration: 5000,
        },
        error: {
          duration: 5000,
        },
      });
    }
  };

  const processData = (incomingData) => incomingData.map((currentData) => ({
    id: `image-item-${currentData.child_id}`,
    content: (
      <GalleryItem
        changeTitle={changeTitle}
        currentData={currentData}
        setCurrentPreview={setCurrentPreview}
        changeImageName={changeImageName}
        deleteState={deleteState}
        setDeleteState={setDeleteState}
      />
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
    return result.map((currentItem, index) => {
      const newItem = { ...currentItem };
      newItem.order = index;
      return newItem;
    });
  };

  const grid = 8;

  const getItemStyle = (isDragging, draggableStyle, itemId) => {
    let backgroundColor = 'grey';
    if (currentPreview !== null && currentPreview.id === itemId) {
      backgroundColor = 'green';
    } else if (isDragging) {
      backgroundColor = 'lightgreen';
    }
    return ({
      // some basic styles to make the items look a bit nicer
      userSelect: 'none',
      padding: grid * 2,
      margin: `0 0 ${grid}px 0`,
      borderRadius: 15,
      // change background colour if dragging
      background: backgroundColor,
      // styles we need to apply on draggables
      ...draggableStyle,
    });
  };

  const getListStyle = () => ({
    background: 'lightgrey',
    padding: grid,
    width: 200,
    minHeight: '100%',
    margin: 'auto',
    borderRadius: 15,
  });

  const processChangeOrder = (newOrder) => {
    const savePromise = new Promise((resolve, reject) => {
      const newArray = [];
      const orderArray = [];
      newOrder.forEach((current) => {
        const currentData = { ...current.data };
        currentData.order = current.order;
        newArray.push(currentData);
        orderArray.push({ media_content_id: currentData.child_id, order: currentData.order });
      });
      setComponentDisable(true);
      const okChangeOrderMediaContent = (loadResponse) => {
        setComponentDisable(false);
        resolve();
        onUpdate(newArray);
      };
      const koChangeOrderMediaContent = (error) => {
        setGalleryState({ items: processData(data) });
        setComponentDisable(false);
        reject();
      };
      sectionService
        .orderMediaContent(
          contentId,
          orderArray,
          okChangeOrderMediaContent,
          koChangeOrderMediaContent,
        );
    });

    toast.promise(savePromise, {
      loading: 'Attendere, salvando ordinamento delle immagini...',
      success: 'Ordinamento delle immagini salvato con successo!',
      error: 'Ops, si ?? verificato un errore!',
    }, {
      success: {
        duration: 5000,
      },
      error: {
        duration: 5000,
      },
    });
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
    let renderLabel = "Sei sicuro di voler eliminare l'immagine? Questa azione non pu?? essere annullata.";
    if (deleteState.success === true) {
      renderLabel = 'Operazione completata con successo.';
    } else if (deleteState.success === false) {
      renderLabel = "Si ?? verificato un errore nell'esecuzione dell'operazione.";
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
      renderLabel = "Si ?? verificato un errore nell'esecuzione dell'operazione.";
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

  useEffect(() => {
    if (!!galleryState.items.length && galleryState.items.length > 0) {
      let currentPreviewIndex = -1;
      if (currentPreview !== null) {
        currentPreviewIndex = galleryState.items.findIndex(
          (currentGallery) => currentGallery.id === currentPreview.id,
        );
        if (currentPreviewIndex === -1) setCurrentPreview(galleryState.items[0]);
      } else {
        setCurrentPreview(galleryState.items[0]);
      }
    } else if (currentPreview !== null) setCurrentPreview(null);
  }, [galleryState.items]);

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
              <div className={`mt-2 div-gallery-drag-drop${componentDisable === true ? ' disabled' : ''}`}>
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
                                  item.id,
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
            <h6 className="mt-4">Preview</h6>
            <div className="div-gallery-preview-container">
              <CImage className="div-gallery-preview" src={currentPreview?.data?.path || ImagePlaceholder} />
            </div>
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
  changeTitle: PropTypes.bool,
};

Gallery.defaultProps = {
  data: [],
  title: 'Galleria',
  label: 'Inserisci qui la tua immagine',
  instructions: "Trascina e rilascia le immagini per cambiare l'ordine",
  changeTitle: false,
};

export default Gallery;
