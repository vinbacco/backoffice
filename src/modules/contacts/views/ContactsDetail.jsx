/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import {
  CForm, CCol, CFormInput, CRow, CFormTextarea, CInputGroupText, CInputGroup, CFormLabel,
} from '@coreui/react';
import toast from 'react-hot-toast';

import ContactCategoriesService from 'src/services/api/ContactCategoriesService';
import CitiesService from 'src/services/api/CitiesService';
import ContactsService from 'src/services/api/ContactsService';

import AppDetail from 'src/components/ui/Detail/AppDetail';
import AppLoadingSpinner from 'src/components/ui/AppLoadingSpinner';
import Gallery from 'src/components/ui/Images/Gallery';
import composeErrorFormType from 'src/utils/composeErrorFormType';
import AppMultiData from 'src/components/ui/MultiData/AppMultiData';
import WinesForm from './Wines/WinesForm';

function ContactsDetail() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, error: null });
  const {
    control, handleSubmit, reset, getValues, setValue, formState: { errors },
  } = useForm({
    defaultValues: {
      business_name: '',
      contact_category_id: '',
      holder: '',
      foundation_year: '',
      certified_email: '',
      registered_address: '',
      registered_city_id: '',
      registered_zip_code: '',
      vat_code: '',
      commercial_ref_name: '',
      commercial_ref_phone: '',
      commercial_ref_email: '',
      attributes: {
        wines: [],
      },
    },
  });
  const [contactMediaContents, setContactMediaContents] = useState([]);
  const [contactWineMediaContents, setContactWineMediaContents] = useState([]);

  const formatModel = (response) => {
    const contactResponseData = { ...response?.data || {} };
    const contactModelData = {};
    contactModelData.business_name = contactResponseData.business_name;
    contactModelData.contact_category_id = contactResponseData.contact_category_id;
    contactModelData.holder = contactResponseData.holder;
    contactModelData.foundation_year = contactResponseData.foundation_year;
    contactModelData.certified_email = contactResponseData.certified_email;
    contactModelData.registered_address = contactResponseData.registered_address;
    contactModelData.registered_city_id = contactResponseData.registered_city_id;
    contactModelData.registered_zip_code = contactResponseData.registered_zip_code;
    contactModelData.vat_code = contactResponseData.vat_code;
    contactModelData.commercial_ref_name = contactResponseData.commercial_ref_name;
    contactModelData.commercial_ref_phone = contactResponseData.commercial_ref_phone;
    contactModelData.commercial_ref_email = contactResponseData.commercial_ref_email;
    contactModelData.attributes = contactModelData?.attributes || {
      wines: [],
    };
    contactModelData.media_contents = contactModelData?.media_contents || [];

    return contactModelData;
  };

  useEffect(() => {
    if (id !== null && typeof id !== 'undefined') {
      const contactService = new ContactsService();
      const okGetDetails = (response) => {
        const contactModelData = formatModel(response);

        reset(contactModelData);
        setState({ ...state, loading: false });
        if (
          Array.isArray(contactModelData.media_contents)
          && contactModelData.media_contents.length > 0
        ) {
          setContactMediaContents([...contactModelData.media_contents.filter((current) => current.type === 'contact_image').sort((a, b) => a.order - b.order)]);
          setContactWineMediaContents([...contactModelData.media_contents.filter((current) => current.type === 'contact_wine_image').sort((a, b) => a.order - b.order)]);
        }
      };

      const koGetDetails = (error) => {
        const errorMessage = error?.data?.message || 'Nessun errore';
        setState({ ...state, loading: false, error: errorMessage });
        throw new Error(errorMessage);
      };

      contactService.getItem(id, okGetDetails, koGetDetails);
    }
  }, []);

  const loadContactCategories = () => new Promise((resolve) => {
    const contactCategoriesService = new ContactCategoriesService();
    const okGetContactCategories = (response) => {
      let responseData = [];
      if (Array.isArray(response.data) && response.data.length > 0) {
        responseData = response.data.map((currentItem) => (
          { value: currentItem._id, label: currentItem.category_name }
        ));
      }
      resolve(responseData);
    };
    const koGetContactCategories = () => resolve([]);
    const filters = {
      paginate: 5,
      page: 1,
    };
    contactCategoriesService.getList({
      filters,
      okCallback: (res) => okGetContactCategories(res),
      koCallback: (err) => koGetContactCategories(err),
    });
  });

  const loadCities = () => new Promise((resolve) => {
    const citiesService = new CitiesService();
    const okGetCities = (response) => {
      let responseData = [];
      if (Array.isArray(response.data) && response.data.length > 0) {
        responseData = response.data.map((currentItem) => (
          { value: currentItem._id, label: currentItem.city_name }
        ));
      }
      resolve(responseData);
    };
    const koGetCities = () => resolve([]);
    const filters = {
      paginate: 5,
      page: 1,
    };
    citiesService.getList({
      filters,
      okCallback: (res) => okGetCities(res),
      koCallback: (err) => koGetCities(err),
    });
  });

  const saveAction = (type) => {
    const savePromise = new Promise((resolve, reject) => {
      const okEditCallback = (response) => {
        const contactModelData = formatModel(response);
        reset(contactModelData);
        if (
          Array.isArray(contactModelData.media_contents)
          && contactModelData.media_contents.length > 0
        ) {
          setContactMediaContents([...contactModelData.media_contents.filter((current) => current.type === 'contact_image').sort((a, b) => a.order - b.order)]);
          setContactWineMediaContents([...contactModelData.media_contents.filter((current) => current.type === 'contact_wine_image').sort((a, b) => a.order - b.order)]);
        }
        setState({ ...state, loading: false, model: contactModelData });
        resolve();
      };

      const koEditCallback = (response) => {
        setState({ loading: false, error: response?.error });
        reject();
      };

      const contactService = new ContactsService();
      const formData = getValues();
      switch (type) {
        case 'publish':
          resolve(); // TODO: Azione pubblica
          break;
        case 'publishNow':
          resolve(); // TODO: Azione pubblica ora
          break;
        case 'save':
        default:
          contactService.updateItem(id, formData, okEditCallback, koEditCallback);
      }
    });

    toast.promise(savePromise, {
      loading: 'Attendere, salvando le modifiche...',
      success: 'Dato modificato con successo!',
      error: 'Ops, si è verificato un errore!',
    }, {
      success: {
        duration: 5000,
      },
      error: {
        duration: 5000,
      },
    });
  };

  const insertWine = (data, formProps) => {
    const newModel = { ...getValues() };
    const formatData = { ...data };
    delete formatData.id;
    if (!newModel.attributes) newModel.attributes = { wines: [] };
    if (!newModel.attributes.wines) newModel.attributes.wines = [];
    newModel.attributes.wines.push(formatData);
    setValue('attributes', newModel.attributes);
    setState({ ...state, model: newModel });
    formProps.closeModal();
  };

  const editWine = (data, formProps) => {
    const newModel = { ...getValues() };
    if (typeof data.id === 'number' && data.id >= 0) {
      const formatData = { ...data };
      delete formatData.id;
      newModel.attributes.wines[data.id] = (formatData);
      setValue('attributes', newModel.attributes);
      setState({ ...state, model: newModel });
    }
    formProps.closeModal();
  };

  const deleteWine = (data) => {
    const newModel = { ...getValues() };
    if (typeof data.id === 'number' && data.id >= 0) {
      newModel.attributes.wines.splice(data.id, 1);
      setValue('attributes', newModel.attributes);
      setState({ ...state, model: newModel });
    }
  };

  if (state.loading === true) return <AppLoadingSpinner />;

  if (state.error) return <p>NO DATA</p>;

  return (
    <CForm>
      <AppDetail
        saveAction={saveAction}
        name={getValues('business_name')}
        tabsHeaders={[
          {
            index: 'main-tab',
            label: 'Dati principali',
          },
          {
            index: 'other-tab',
            label: 'Vini ed immagini',
          },
        ]}
        tabsContents={
          [
            {
              index: 'main-tab',
              content: (
                <CRow className="g-3">
                  <CCol md={6}>
                    <Controller
                      name="business_name"
                      defaultValue=""
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <CFormInput
                          invalid={!!errors.business_name}
                          feedback={errors?.business_name
                            ? composeErrorFormType(errors.business_name)
                            : null}
                          type="text"
                          id="contact-business_name"
                          label="Nome cantina"
                          placeholder="Inserisci nome cantina"
                          {... field}
                        />
                      )}
                    />
                  </CCol>
                  <CCol md={6}>
                    <Controller
                      name="contact_category_id"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <>
                          <CFormLabel htmlFor="new-contact-category">Categoria contatto</CFormLabel>
                          <AsyncSelect
                            inputId="new-contact-category"
                            isClearable
                            defaultOptions
                            loadOptions={loadContactCategories}
                            {...field}
                          />
                          {errors.contact_category_id ? <div className="invalid-feedback d-block">{composeErrorFormType(errors.contact_category_id)}</div> : null}
                        </>
                      )}
                    />
                  </CCol>
                  <CCol md={6}>
                    <Controller
                      name="holder"
                      defaultValue=""
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <CFormInput
                          invalid={!!errors.holder}
                          feedback={errors?.holder ? composeErrorFormType(errors.holder) : null}
                          type="text"
                          id="contact-holder"
                          label="Titolare/i"
                          placeholder="Inserisci titolare/i"
                          {... field}
                        />
                      )}
                    />
                  </CCol>
                  <CCol md={6}>
                    <Controller
                      name="foundation_year"
                      defaultValue=""
                      control={control}
                      rules={{ required: true, pattern: /^\d{4}$/i }}
                      render={({ field }) => (
                        <CFormInput
                          invalid={!!errors.foundation_year}
                          feedback={errors?.foundation_year
                            ? composeErrorFormType(errors.foundation_year, 'Devono essere 4 cifre numeriche')
                            : null}
                          type="number"
                          id="contact-foundation_year"
                          label="Anno di fondazione"
                          placeholder="Inserisci anno di fondazione"
                          {... field}
                        />
                      )}
                    />
                  </CCol>
                  <CCol md={6}>
                    <Controller
                      name="certified_email"
                      defaultValue=""
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <CFormInput
                          invalid={!!errors.certified_email}
                          feedback={errors?.certified_email
                            ? composeErrorFormType(errors.certified_email)
                            : null}
                          type="email"
                          id="contact-certified_email"
                          label="PEC"
                          placeholder="Inserisci PEC"
                          {... field}
                        />
                      )}
                    />
                  </CCol>
                  <CCol md={6}>
                    <Controller
                      name="registered_address"
                      defaultValue=""
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <CFormInput
                          invalid={!!errors.registered_address}
                          feedback={errors?.registered_address
                            ? composeErrorFormType(errors.registered_address)
                            : null}
                          type="text"
                          id="contact-registered_address"
                          label="Indirizzo (sede legale)"
                          placeholder="Inserisci indirizzo"
                          {... field}
                        />
                      )}
                    />
                  </CCol>
                  <CCol md={6}>
                    <Controller
                      name="registered_city_id"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <>
                          <CFormLabel htmlFor="new-contact-registered_city_id">Città (sede legale)</CFormLabel>
                          <AsyncSelect
                            inputId="new-contact-registered_city_id"
                            isClearable
                            defaultOptions
                            loadOptions={loadCities}
                            {...field}
                          />
                          {errors.registered_city_id ? <div className="invalid-feedback d-block">{composeErrorFormType(errors.registered_city_id)}</div> : null}
                        </>
                      )}
                    />
                  </CCol>
                  <CCol md={6}>
                    <Controller
                      name="registered_zip_code"
                      defaultValue=""
                      control={control}
                      rules={{ required: true, pattern: /^\d{5}$/i }}
                      render={({ field }) => (
                        <CFormInput
                          invalid={!!errors.registered_zip_code}
                          feedback={errors?.registered_zip_code
                            ? composeErrorFormType(errors.registered_zip_code, 'Devono essere 5 cifre numeriche')
                            : null}
                          type="number"
                          id="contact-registered_zip_code"
                          label="CAP (sede legale)"
                          placeholder="Inserisci CAP"
                          {... field}
                        />
                      )}
                    />
                  </CCol>
                  <CCol md={6}>
                    <Controller
                      name="vat_code"
                      defaultValue=""
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <CFormInput
                          invalid={!!errors.vat_code}
                          feedback={errors?.vat_code ? composeErrorFormType(errors.vat_code) : null}
                          type="text"
                          id="contact-vat_code"
                          label="Codice fiscale"
                          placeholder="Inserisci codice fiscale"
                          {... field}
                        />
                      )}
                    />
                  </CCol>
                  <CCol md={6}>
                    <Controller
                      name="commercial_ref_name"
                      defaultValue=""
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <CFormInput
                          invalid={!!errors.commercial_ref_name}
                          feedback={errors?.commercial_ref_name
                            ? composeErrorFormType(errors.commercial_ref_name)
                            : null}
                          type="text"
                          id="contact-commercial_ref_name"
                          label="Nome e Cognome rif. Commerciale"
                          placeholder="Inserisci riferimento commerciale"
                          {... field}
                        />
                      )}
                    />
                  </CCol>
                  <CCol md={6}>
                    <Controller
                      name="commercial_ref_phone"
                      defaultValue=""
                      control={control}
                      rules={{ required: true, pattern: /^[+]?\d{3,}$/i }}
                      render={({ field }) => (
                        <CFormInput
                          invalid={!!errors.commercial_ref_phone}
                          feedback={errors?.commercial_ref_phone
                            ? composeErrorFormType(errors.commercial_ref_phone)
                            : null}
                          type="text"
                          id="contact-commercial_ref_phone"
                          label="Cellulare rif. Commerciale"
                          placeholder="Inserisci cellulare rif. commerciale"
                          {... field}
                        />
                      )}
                    />
                  </CCol>
                  <CCol md={6}>
                    <Controller
                      name="commercial_ref_email"
                      defaultValue=""
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <CFormInput
                          invalid={!!errors.commercial_ref_email}
                          feedback={errors?.commercial_ref_email
                            ? composeErrorFormType(errors.commercial_ref_email)
                            : null}
                          type="email"
                          id="contact-commercial_ref_email"
                          label="Email rif. Commerciale"
                          placeholder="Inserisci Email rif. Commerciale"
                          {... field}
                        />
                      )}
                    />
                  </CCol>
                </CRow>
              ),
            },
            {
              index: 'other-tab',
              content: (
                <>
                  <AppMultiData
                    className="mb-4"
                    title="Vini"
                    item="Vino"
                    modalSize="xl"
                    formId="vino-cantina"
                    createFormComponent={(CreateFormProps) => WinesForm({
                      formId: 'create_vino-cantina',
                      submit: (data) => insertWine(data, CreateFormProps),
                      parentProps: {
                        show: CreateFormProps.show,
                      },
                    })}
                    editFormComponent={(EditFormProps) => WinesForm({
                      formId: 'edit_vino-cantina',
                      submit: (data) => editWine(data, EditFormProps),
                      parentProps: {
                        show: EditFormProps.show,
                        target: EditFormProps.target,
                      },
                    })}
                    deleteFunction={(deleteProps) => deleteWine({
                      id: deleteProps.target,
                    })}
                    data={state?.model?.attributes?.wines || null}
                    columns={[
                      { index: 'name', type: 'text' },
                      { index: 'type', type: 'text' },
                    ]}
                  />
                  <CRow className="g-3">
                    <CCol>
                      <Gallery
                        contentId={id}
                        contentType="contact_image"
                        Service={ContactsService}
                        title="Galleria della Cantina"
                        data={contactMediaContents}
                        onUpdate={(imagesArray) => setContactMediaContents(imagesArray)}
                      />
                      <Gallery
                        contentId={id}
                        contentType="contact_wine_image"
                        Service={ContactsService}
                        title="Galleria dei vini"
                        data={contactWineMediaContents}
                        onUpdate={(imagesArray) => setContactWineMediaContents(imagesArray)}
                      />
                    </CCol>
                  </CRow>
                </>
              ),
            },
          ]
        }
      />
    </CForm>
  );
}

export default ContactsDetail;
