import styles from './Modal.module.css';
import { useEffect } from 'react';

export const Modal = ({ imageUrl, closeModal, handleCloseModal }) => {
  const handleClick = e => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    const handleKeyPress = e => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleCloseModal]);

  return (
    <div className={styles.overlay} onClick={handleClick}>
      <div className={styles.modal}>
        <img src={imageUrl} alt="" />
      </div>
    </div>
  );
};
