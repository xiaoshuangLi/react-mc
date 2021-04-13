const list = [
  'https://cdn-health.zhongan.com/magiccube/resources/lQMxZqLl5j.jpg',
  'https://cdn-health.zhongan.com/magiccube/resources/3NcItGwodJ.jpg',
  'https://cdn-health.zhongan.com/magiccube/resources/daQ5acqiZE.gif',
  'https://cdn-health.zhongan.com/magiccube/resources/CNCdj2u8NV.jpg',
];

export const getRandom = (max) => {
  return Math.floor(Math.random() * (max + 0.999999));
};

export const getRandomItem = (array = []) => {
  const index = getRandom(array.length - 1);

  return array[index];
};

export const getImgProps = () => {
  const index = getRandom(list.length - 1);
  const backgroundImage = `url(${list[index]})`;

  return {
    style: { backgroundImage },
  };
};
