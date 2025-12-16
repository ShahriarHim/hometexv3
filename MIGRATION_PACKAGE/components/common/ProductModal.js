import React, { useState, useEffect, useRef, useContext } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { FaArrowLeft, FaArrowRight, FaStar } from 'react-icons/fa';
import { useRouter } from 'next/router';
import CartContext from '@/context/CartContext';
import styles from '@/styles/ProductModal.module.css';
import Invoice from '../invoice/Invoice';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Link from 'next/link';

export async function getServerSideProps(context) {
  let id = context.query.id;
  const res = await fetch(
    `${Constants.BASE_URL}/api/products-details-web/` + id
  );
  const product = await res.json();

  return {
    props: {
      product,
    },
  };
}

const ProductModal = ({ product, onClose }) => {
  const { addItemToCart } = useContext(CartContext);
  const [productQty, setProductQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('38');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [showInvoice, setShowInvoice] = useState(false);
  const [showShippingInfo, setShowShippingInfo] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const modalRef = useRef();
  const router = useRouter();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const addToCartHandler = () => {
    addItemToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.primary_photo,
      quantity: productQty,
      in_stock: product.stock,
      supplier_id: product.supplier_id,
      sku: product.sku,
      total_price: parseFloat(product.price) * productQty,
      size: selectedSize,
      color: selectedColor,
    });
    onClose();
  };

  const increaseQuantity = () => {
    setProductQty((prevQty) => Math.min(prevQty + 1, product.stock));
  };

  const decreaseQuantity = () => {
    setProductQty((prevQty) => Math.max(prevQty - 1, 1));
  };

  const handleQuantityChange = (e) => {
    const newQty = Math.min(Math.max(parseInt(e.target.value, 10) || 1, 1), product.stock);
    setProductQty(newQty);
  };

  const toggleInvoice = () => {
    setShowInvoice(!showInvoice);
  };

  const handleShippingInfoChange = (e) => {
    setShowShippingInfo(e.target.checked);
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  if (!product) return null;

  return (
    <div className={styles.overlay}>
      <div ref={modalRef} className={styles.modal}>
      <div className={styles.modalHeader}>
  <div className={styles.headerLeft}>
  <button className={styles.closeButton} onClick={onClose}>
      <RiCloseLine size="24" />
    </button>
    <button className={styles.invoiceButton} onClick={toggleInvoice}>
      Generate Invoice ⬇
    </button>
  </div>
  <div className={styles.headerRight}>

    <button className={styles.printButton} onClick={() => window.print()}>
      Print
    </button>
    <div className={styles.checkboxContainer}>
      <input
        type="checkbox"
        id="shippingInfo"
        checked={showShippingInfo}
        onChange={handleShippingInfoChange}
      />
      <label htmlFor="shippingInfo" className={styles.checkboxLabel}>
        Include delivery and shipping info
      </label>
    </div>
  </div>
</div>

        {showInvoice && (
          <div className={styles.invoice}>
            <Invoice
              order={{
                id: 123456,
                date: 'May 16, 2023',
                customer: {
                  name: 'John Doe',
                  email: 'john.doe@example.com',
                  address: '1234 Street, City, Country',
                },
              }}
              lineItems={[
                {
                  id: 1,
                  name: product.name,
                  quantity: productQty,
                  price: product.price,
                },
              ]}
            />
          </div>
        )}
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.description}>
              <h2 className={styles.productTitle}>{product.name}</h2>
              <div className={styles.descriptionText}>
                <div
                  className={`${styles.text} ${showFullDescription ? styles.fullText : styles.shortText}`}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
                <span onClick={toggleDescription} className={styles.showMore}>
                  {showFullDescription ? 'Show Less' : 'Show More'}
                </span>
              </div>
            </div>

            <div className={styles.center}>
              <h1 className={styles.title}>Product Details</h1>
              <img src={product.primary_photo} alt={product.name} className={styles.shoe} />
              <div className={styles.price}>
                <h1>{product.price}</h1>
              </div>
            </div>
            <div className={styles.details}>
              <div className={styles.info}>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={product.stock > 0}
                    readOnly
                    className="form-checkbox text-blue-500"
                  />
                  <span className="ml-2 text-gray-700">
                    In Stock {product.stock}
                  </span>
                </div>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((star, index) => (
                    <FaStar
                      key={index}
                      color={index < product.rating ? "#ffc107" : "#e4e5e9"}
                      className="mr-1"
                    />
                  ))}
                </div>
                <div className={styles.colorContainer}>
                  <h3 className={styles.subTitle}>Color</h3>
                  <div className={styles.colors}>
                    {['blue', 'red', 'green', 'orange', 'black'].map((color) => (
                      <span
                        key={color}
                        className={`${styles.color} ${selectedColor === color ? styles.active : ''}`}
                        onClick={() => setSelectedColor(color)}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className={styles.sizeContainer}>
                  <h3 className={styles.subTitle}>Size</h3>
                  <div className={styles.sizes}>
                    {['King', 'Extra King', 'Single', 'Double'].map((size) => (
                      <span
                        key={size}
                        className={`${styles.size} ${selectedSize === size ? styles.active : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.quantityContainer}>
                  <h3 className={styles.subTitle}>Quantity</h3>
                  <div className={styles.quantity}>
                    <button onClick={decreaseQuantity} className={styles.quantityButton}>-</button>
                    <input
                      type="number"
                      className={styles.quantityInput}
                      min="1"
                      max={product.stock}
                      step="1"
                      value={productQty}
                      onChange={handleQuantityChange}
                    />
                    <button onClick={increaseQuantity} className={styles.quantityButton}>+</button>
                  </div>
                </div>
                <button className={styles.addToCart} onClick={addToCartHandler}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
