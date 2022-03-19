function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const appService = {
  numberWithCommas: numberWithCommas,
}

export default appService;