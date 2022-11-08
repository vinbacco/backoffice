const utils = {
  buildPathWithQueryParams: (path, params) => {
    let newPath = path;
    let paramsKeys = Object.keys(params);
    paramsKeys.forEach((currentParamKey, index) => {
      if (index === 0) newPath = `${newPath}?${currentParamKey}=${params[currentParamKey]}`
      else newPath = `${newPath}&${currentParamKey}=${params[currentParamKey]}`
    });
    return newPath;
  },
}

export default utils;
