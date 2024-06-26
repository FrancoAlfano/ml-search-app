import React from 'react';
import styles from './pagination.module.scss';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    let pages = [];
    let startPage, endPage;
    if (totalPages <= 7) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 4) {
        startPage = 1;
        endPage = 7;
      } else if (currentPage + 3 >= totalPages) {
        startPage = totalPages - 6;
        endPage = totalPages;
      } else {
        startPage = currentPage - 3;
        endPage = currentPage + 3;
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className={styles.pagination}>
      <ul>
        {currentPage > 1 && (
          <li>
            <button onClick={() => onPageChange(currentPage - 1)}>
              {'<'} Anterior
            </button>
          </li>
        )}
        <div className={styles.desktopVisible}>
          {pageNumbers[0] > 1 && (
            <>
              <li>
                <button onClick={() => onPageChange(1)}>1</button>
              </li>
              {pageNumbers[0] > 2 && <li className={styles.ellipsis}>...</li>}
            </>
          )}
          {pageNumbers.map(number => (
            <li
              key={number}
              className={number === currentPage ? styles.active : ''}
            >
              <button onClick={() => onPageChange(number)}>{number}</button>
            </li>
          ))}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <li className={styles.ellipsis}>...</li>
              )}
              <li>
                <button onClick={() => onPageChange(totalPages)}>
                  {totalPages}
                </button>
              </li>
            </>
          )}
        </div>
        <li className={`${styles.mobileVisible} ${styles.active}`}>
          <button>{currentPage}</button>
        </li>
        {currentPage < totalPages && (
          <li>
            <button onClick={() => onPageChange(currentPage + 1)}>
              Siguiente {'>'}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
