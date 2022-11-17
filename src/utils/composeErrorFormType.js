const composeErrorFormType = (error) => {
  if (error?.type) {
    switch (error.type) {
      case 'required':
      default:
        return 'Questo campo è obbligatorio';
    }
  }
  return 'Errore nel campo';
};

export default composeErrorFormType;
