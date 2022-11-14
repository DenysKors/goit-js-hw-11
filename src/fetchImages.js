import axios from 'axios';
const KEY = '31271672-bfb0d2ac7c61ea0216be79fb4';

async function fetchImages(queryName, page, per_page) {
  return await axios.get(`https://pixabay.com/api/?key=${KEY}&q=${queryName}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`);
}

export { fetchImages };