/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React, { Component, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CButton, CCol, CFormInput, CFormLabel, CImage, CInputGroup, CRow,
} from '@coreui/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

/**
 * TODO:
 * - Verificare il cambio di contenuto quando una nuova immagine viene inserita
 * - Verificare il cambio di contenuto quando un'immagine esistente viene cancellata
 * - Assicurarsi che il cambio ordine delle immagine sorge effetto nel salvataggio del contenuto
 */

const Gallery = ({
  title, label, data, instructions, onUpload, onChangeOrder,
}) => {
  const [currentPreview, setCurrentPreview] = useState(null);
  const [newImageFile, setNewImageFile] = useState(undefined);
  const inputRef = useRef(null);

  const deleteImage = (imageChildId) => {
    alert(`You want to delete image ${imageChildId}`);
  };

  const processData = () => data.map((currentData) => ({
    id: `image-item-${currentData.child_id}`,
    content: (
      <span className="gallery-item">
        <CImage onClick={() => setCurrentPreview(currentData.path)} className="gallery-item-image" thumbnail src={currentData.path} />
        <CButton className="gallery-item-delete" color="danger" size="sm" onClick={() => deleteImage(currentData.child_id)}>
          <CIcon icon={cilX} />
        </CButton>
      </span>
    ),
    data: currentData,
  }));

  const [galleryState, setGalleryState] = useState({
    items: processData(),
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
    onChangeOrder(newArray);
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
    onUpload(newImageFile);
  };

  return (
    <div className="pt-4 pb-4">
      <h4>{title}</h4>
      <CRow className="mt-4">
        <CCol lg={4} md={6} sm={12}>
          <CFormLabel htmlFor="formFileImageGallery">{label}</CFormLabel>
          <CInputGroup>
            <CFormInput aria-describedby="uploadNewImage" ref={inputRef} type="file" id="formFileImageGallery" onChange={handleOnChange} accept="image/*" />
            <CButton disabled={typeof newImageFile === 'undefined'} type="button" color="primary" id="uploadNewImage" onClick={handleOnUpload}>Carica</CButton>
          </CInputGroup>
        </CCol>
      </CRow>
      <CRow className="mt-4">
        <CCol lg={4} md={6} sm={12}>
          <div className="mt-4">
            <small>{instructions}</small>
            <div className="mt-2 div-gallery-drag-drop">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(droppableProvided, droppableSnapshot) => (
                    <div
                      {...droppableProvided.droppableProps}
                      ref={droppableProvided.innerRef}
                      style={getListStyle(droppableSnapshot.isDraggingOver)}
                    >
                      {galleryState.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
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
  );
};

Gallery.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  title: PropTypes.string,
  label: PropTypes.string,
  instructions: PropTypes.string,
  onChangeOrder: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
};

Gallery.defaultProps = {
  data: [],
  title: 'Galleria',
  label: 'Inserisci qui la tua immagine',
  instructions: "Trascina e rilascia le immagini per cambiare l'ordine",
};

export default Gallery;
