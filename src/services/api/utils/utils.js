const utils = {
  buildPathWithQueryParams: (path, params) => {
    let newPath = path;
    const paramsKeys = Object.keys(params);
    paramsKeys.forEach((currentParamKey, index) => {
      if (index === 0) newPath = `${newPath}?${currentParamKey}=${params[currentParamKey]}`;
      else newPath = `${newPath}&${currentParamKey}=${params[currentParamKey]}`;
    });
    return newPath;
  },
  /**
   * Esempio:
   * Utils.formatCurrency({
        number: parseFloat(NUMBER_TO_FORMAT)
     })
   */
  formatCurrency: ({ locale, currency, number }) => {
    const formatter = new Intl.NumberFormat(
      locale || 'it-IT',
      {
        style: 'currency',
        currency: currency || 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    );
    return formatter.format(number);
  },
};

export default utils;
