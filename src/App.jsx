import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Navbar from './components/Navbar.jsx';


const API_URL = 'https://api.unsplash.com/search/photos';
const IMAGES_PER_PAGE = 20;

function App() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('home');

 
  const fetchImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setErrorMsg('');
        setLoading(true);
        const { data } = await axios.get(
          `${API_URL}?query=${
            searchInput.current.value
          }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${
            import.meta.env.VITE_API_KEY
          }`
        );
        setImages(data.results);
        setTotalPages(data.total_pages);
        setLoading(false);
      }
    } catch (error) {
      setErrorMsg('Error fetching images. Try again later.');
      console.log(error);
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    resetSearch();
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  };

  /*---add fav option---*/ 
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  });

  /*--download */
  const [downloaded, setDownloaded] = useState(() => {
    return JSON.parse(localStorage.getItem("downloads")) || [];
  });
  /*end download */

  const toggleFavorite = (image) => {
    const isFav = favorites.some((fav) => fav.id === image.id);
    let updatedFavorites;
  
    if (isFav) {
      updatedFavorites = favorites.filter((fav) => fav.id !== image.id);
    } else {
      updatedFavorites = [...favorites, image];
    }
  
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };
  
  /*---end favourite option---*/ 

  /*download start*/
  const handleDownload = (image) => {
    const link = document.createElement('a');
    link.href = image.urls.full;
    link.download = `image-${image.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    const alreadyDownloaded = downloaded.some((img) => img.id === image.id);
    if (!alreadyDownloaded) {
      const updatedDownloads = [...downloaded, image];
      setDownloaded(updatedDownloads);
      localStorage.setItem("downloads", JSON.stringify(updatedDownloads));
    }
  };
  /*end download */
  const removeDownloaded = (image) => {
    const updatedDownloads = downloaded.filter((img) => img.id !== image.id);
    setDownloaded(updatedDownloads);
    localStorage.setItem("downloads", JSON.stringify(updatedDownloads));
  };
  


  return (
    <div className='container'>
      <Navbar setView={setView} />

      {view === 'home' && (
        <>
          <h1 className='title'>SearchPix</h1>
          {errorMsg && <p className='error-msg'>{errorMsg}</p>}
          <div className='search-section'>
            <Form onSubmit={handleSearch}>
              <Form.Control
                type='search'
                placeholder='Type something to search...'
                className='search-input'
                ref={searchInput}
              />
            </Form>
          </div>
          <div className='filters'>
            <div onClick={() => handleSelection('nature')}>Nature</div>
            <div onClick={() => handleSelection('Animals')}>Animals</div>
            <div onClick={() => handleSelection('Architecture')}>Architecture</div>
            <div onClick={() => handleSelection('Technology')}>Technology</div>
          </div>
          {loading ? (
            <p className='loading'>Loading...</p>
          ) : (
            <>
              <div className='images'>
                {images.map((image) => (
                  <div key={image.id} className='image-card'>
                    <img
                      src={image.urls.small}
                      alt={image.alt_description}
                      className='image'
                    />
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button
                      onClick={() => handleDownload(image)}
                       className='download-btn'
                    >
                       Download
                    </button>

                      <button
                        onClick={() => toggleFavorite(image)}
                        className='download-btn'
                        style={{ backgroundColor: favorites.some(fav => fav.id === image.id) ? '#7676d7' : '#7676d7' }}
                      >
                        {favorites.some(fav => fav.id === image.id) ? '🤍 Favorited' : '🤍 Favorite'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className='buttons'>
                {page > 1 && (
                  <Button onClick={() => setPage(page - 1)}>Previous</Button>
                )}
                {page < totalPages && (
                  <Button onClick={() => setPage(page + 1)}>Next</Button>
                )}
              </div>
            </>
          )}
        </>
      )}

      {view === 'favorites' && (
        <>
          <h1 className='title'>Favorite Images</h1>
          <div className='images'>
            {favorites.length > 0 ? (
              favorites.map((image) => (
                <div key={image.id} className='image-card'>
                  <img
                    src={image.urls.small}
                    alt={image.alt_description}
                    className='image'
                  />
                  <a
                    href={image.urls.full}
                    download={`image-${image.id}.jpg`}
                    className='download-btn'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Download
                  </a>
                  <button className='download-btn' onClick={() => toggleFavorite(image)}>
                    ★
                  </button>
                </div>
              ))
            ) : (
              <p className='loading'>No favorite images.</p>
            )}
          </div>
        </>
      )}

{view === 'downloads' && (
  <>
    <h1 className='title'>Downloaded Images</h1>
    <div className='images'>
      {downloaded.length > 0 ? (
        downloaded.map((image) => (
          <div key={image.id} className='image-card'>
            <img
              src={image.urls.small}
              alt={image.alt_description}
              className='image'
            />
            <button
              onClick={() => handleDownload(image)}
              className='download-btn'
            >
              Download Again
            </button>
            <button
          className='download-btn'
          onClick={() => removeDownloaded(image)}
          style={{ backgroundColor: '#ff4d4d' }}
        >
          🗑 Remove
        </button>
          </div>
        ))
      ) : (
        <p className='loading'>No downloaded images yet.</p>
      )}
    </div>
  </>
)}
   </div>
  );
}

export default App;