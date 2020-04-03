const list = [
  'https://cdn-health.zhongan.com/magiccube/resources/lQMxZqLl5j.jpg',
  'https://cdn-health.zhongan.com/magiccube/resources/3NcItGwodJ.jpg',
  'https://cdn-health.zhongan.com/magiccube/resources/daQ5acqiZE.gif',
  'https://cdn-health.zhongan.com/magiccube/resources/CNCdj2u8NV.jpg',
];

export const getImgProps = () => {
  const index = Math.floor(Math.random() * (list.length - 0.001));
  const backgroundImage = `url(${list[index]})`;

  return {
    style: { backgroundImage },
  };
};
