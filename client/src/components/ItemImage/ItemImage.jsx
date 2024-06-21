import Image from 'next/image';
import './ItemImage.scss';

const ItemImage = ({ src, alt, size }) => {
  const sizes = {
    small: { width: 180, height: 180 },
    large: { width: 680, height: 680 }
  };

  const { width, height } = sizes[size] || sizes.small;

  return (
    <Image
      className={size=='large' ? "item-image-large" : "item-image"}
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={100}
      priority={true}
    />
  );
};

export default ItemImage;
