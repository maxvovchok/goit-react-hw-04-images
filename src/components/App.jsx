import Notiflix from 'notiflix';

import { ImageGallery } from './imageGallery/ImageGallery';
import { Searchbar } from './searchbar/Searchbar';
import { getImages } from 'services/getImages';
import { Button } from './button/Button';
import { useState, useEffect, useRef } from 'react';

export const App = () => {


  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isEmpty, setIsEmpty] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  const prevStateRef = useRef(null);

  const handleFormSubmit = async search => {
    setImages([]);
    setSearch(search);
    setIsEmpty(false);
    setShowBtn(false);
    setPage(1);
    setIsLoading(false);
  };

  useEffect(() => {
    if (
      prevStateRef.current &&
      (prevStateRef.current.search !== search ||
        prevStateRef.current.page !== page)
    ) {
      setIsLoading(true);

      getImages(search, page)
        .then(({ hits: photos, totalHits: total_results }) => {
          if (photos.length === 0) {
            setIsEmpty(true);
            Notiflix.Notify.failure(
              `❌ Sorry, there ${search}  are no images matching your search query. Please try again.`
            );
            return;
          }
          setImages(prevImages => [...prevImages, ...photos]);
          setShowBtn(page < Math.ceil(total_results / 12));
        })
        .catch(error => {
          Notiflix.Notify.failure(`❌ ${error.message}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    prevStateRef.current = { search, page };
  }, [search, page]);

  const handleClick = () => setPage(page => page + 1);

  return (
    <div>
      <Searchbar onSubmit={handleFormSubmit} />
      {images && <ImageGallery children={images} />}
      {showBtn && <Button onClick={handleClick} />}
      {isLoading ? Notiflix.Loading.standard() : Notiflix.Loading.remove()}
    </div>
  );
};
