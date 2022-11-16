import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  CForm,
  CRow,
  CCol,
  CFormInput,
} from '@coreui/react';
// SERVICES
import FeedsService from 'src/services/api/FeedsService';
import { showSuccessToast, showErrorToast } from 'src/redux/slices/app.slice';

const FeedsDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      name: '',
      code: '',
    },
  });
  const [state, setState] = useState({
    loading: true,
    model: null,
  });

  const feedsService = new FeedsService();

  const onSubmit = (data) => {
    const okEditCallback = (response) => {
      useState({ loading: false, model: { ...response.data } });
      dispatch(showSuccessToast({ msg: 'Dato modificato con successo!' }));
    };

    const koEditCallback = (response) => {
      useState({ loading: false, error: response.error });
      dispatch(showErrorToast({ msg: 'Ops, si è verificato un errore nella maodifica!' }));
    };

    feedsService.addItem(data, okEditCallback, koEditCallback);
  };

  useEffect(() => {
    if (id) {
      const okGetCallback = (response) => {
        setValue('name', response.data.name);
        setValue('code', response.data.code);
      };

      const koGetCallback = (error) => {
        const errorMessage = error?.data?.message || 'Nessun errore';
        setState({ ...state, loading: false, error: errorMessage });
        throw new Error(errorMessage);
      };

      feedsService.getItem(id, okGetCallback, koGetCallback);
    }
  }, [id]);

  return (
    <section id="feeds-detail">
      <CRow className="mb-4">
        <CCol>
          <h2>Modifica feed</h2>
        </CCol>
      </CRow>
      <CForm
        className="row g-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <CRow>
          <CCol md={6}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <CFormInput
                  {...field}
                />
              )}
            />
          </CCol>
          <div className="mb-3" />
        </CRow>
        <CRow>
          <CCol md={6}>
            <Controller
              name="code"
              control={control}
              defaultValue={state?.model?.code}
              render={({ field }) => (
                <CFormInput
                  {...field}
                />
              )}
            />
          </CCol>
        </CRow>
      </CForm>
    </section>
  );
};

export default FeedsDetail;
