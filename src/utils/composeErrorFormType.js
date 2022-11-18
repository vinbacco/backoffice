const composeErrorFormType = (error, feedback = '') => {
  if (error?.type) {
    switch (error.type) {
      case 'pattern':
        return `Il formato non è valido${feedback.length > 0 ? `; ${feedback}` : ''}`;
      case 'required':
      default:
        return 'Questo campo è obbligatorio';
    }
  }
  return 'Errore nel campo';
};

export default composeErrorFormType;
