import axios from 'axios';

const parameters = {
  API_KEY: '30227573-27b3490869524616035f18b3c',
  page: 1,
  per_page: 40,
  safesearch: true,
};

async function runSearch(requestSearch) {
  const URL = `https://pixabay.com/api/?key=${parameters.API_KEY}&q=${requestSearch}&page=${parameters.page}&per_page=${parameters.per_page}&safesearch=${parameters.safesearch}&image_type=image_type&orientation=horizontal`;
  try {
    const galleryItems = await axios.get(URL, parameters);
    parameters.page += 1;
    // console.log(galleryItems.data);
    return galleryItems.data;
  } catch (error) {
    console.log('ERROR: ' + error);
  }
}

export { parameters, runSearch };
