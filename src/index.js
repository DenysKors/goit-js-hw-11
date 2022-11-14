import { fetchImages } from "./fetchImages";
import Notiflix from 'notiflix';

const refs = {
    searchForm: document.querySelector('#search-form'),
    loadBtn: document.querySelector('.load-more'),
    gallery: document.querySelector('.gallery')
};

let queryName = '';
let page = 1;
let per_page = 5;

refs.searchForm.addEventListener('submit', onSearch);
refs.loadBtn.addEventListener('click', onClickLoad);

async function onSearch(evt) {
    evt.preventDefault();
    queryName = evt.currentTarget.searchQuery.value.trim();
    refs.loadBtn.classList.add('is-hidden');

    if (queryName === "") {
        Notiflix.Notify.warning('Please enter request');
        return
    }

    page = 1;
    refs.gallery.innerHTML = '';

    try {
        const responseData = await fetchImages(queryName, page, per_page);
        refs.loadBtn.classList.remove('is-hidden');
        console.log(responseData);
        renderGallery(responseData);
        Notiflix.Notify.success(`Hooray! We found ${responseData.data.totalHits} images.`);
    }
    catch(error) { 
        console.log(error);
    }
}

function renderGallery(responseData) { 
    const imageData = responseData.data.hits;

    if (imageData.length === 0) {
        refs.loadBtn.classList.add('is-hidden');
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return
    } else    
    if (imageData.length < per_page || (page * per_page) >= responseData.data.totalHits) { 
        refs.loadBtn.classList.add('is-hidden');
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    }

    galleryMarkup(imageData);
}

async function onClickLoad() { 
    try {
        page += 1;
        const responseData = await fetchImages(queryName, page, per_page);
        console.log(responseData)
        renderGallery(responseData);
    }
    catch(error) { 
        console.log(error);
    }
}

function galleryMarkup(imageData) { 
    console.log(imageData);
    const markup = imageData.map((image) => {
    return `
        <div class="photo-card">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width=450px />
            <div class="info">
                <p class="info-item">
                    <b>Likes</b>${image.likes}
                </p>
                <p class="info-item">
                    <b>Views</b>${image.views}
                </p>
                <p class="info-item">
                    <b>Comments</b>${image.comments}
                </p>
                <p class="info-item">
                    <b>Downloads</b>${image.downloads}
                </p>
            </div>
        </div>
        `;
    })
    .join('');
    
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}