const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-UK").format(num);
};

export { formatNumber };
