/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CButton, CCol, CFormInput, CImage, CRow,
} from '@coreui/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const Gallery = ({ title, label, data }) => {
  const [currentPreview, setCurrentPreview] = useState(null);

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
    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',
    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const getListStyle = () => ({
    background: 'lightgrey',
    padding: grid,
    width: 200,
    margin: 'auto',
  });

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
  };

  return (
    <div className="pt-4 pb-4">
      <h4>{title}</h4>
      <CRow className="mt-4">
        <CCol lg={4} md={6} sm={12}>
          <CFormInput type="file" id="formFileMultiple" label={label} multiple />
        </CCol>
      </CRow>
      <CRow className="mt-4">
        <CCol lg={4} md={6} sm={12}>
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
};

Gallery.defaultProps = {
  data: [],
  title: 'Galleria',
  label: 'Inserisci qui la tua immagine',
};

export default Gallery;
