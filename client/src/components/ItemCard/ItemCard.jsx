import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../../utils/formatCurrency';
import ItemImage from '../ItemImage/ItemImage';
import './ItemCard.scss';

const ItemCard = ({ item }) => {
  return (
    <Link className="item-card flex items-center" href={`/items/${item.id}`}>
      <div className="image-container">
        <ItemImage src={item.picture} alt={item.title} size="small" />
      </div>
      <div className="item-details">
        <div className="text-lg mb-4">
          {formatCurrency(item.price.amount, item.price.currency)}
          {item.free_shipping && (
            <span className="free-shipping-icon">
              <FontAwesomeIcon icon={faTruck} />
            </span>
          )}
        </div>
        <div className="item-title">{item.title}</div>
      </div>
      <div className="text-gray-500 item-location">{item.location}</div>
    </Link>
  );
};

export default ItemCard;
