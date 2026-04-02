export const getFormattedPricePsf = (floorSize: string, price: number) => {
  const numericSize = parseFloat(floorSize);
  const psf = isNaN(numericSize) || numericSize === 0 ? 0 : price / numericSize;

  return `RM ${psf.toFixed(2)} psf`;
}

export const getFormattedPrice = (price: number) => {
  return `RM ${price.toLocaleString()}`;
}

export const getUserInitials = (name: string) => {
    const splitName = name.split(" ");

    return (`${splitName[0][0]} ${splitName[1] ? splitName[1][0] : ''}`).toUpperCase();
}