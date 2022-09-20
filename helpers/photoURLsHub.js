import { API } from 'api';

class PhotoURLsHub {
  urls = {};

  loadByUser = async (user) => {
    const urls = await Promise.all(
      (user?.faces).map(async (face) => {
        try {
          const url = this.urls[face.fileId] || (await API.getPhotoUrl(face.fileId));
          this.urls[face.fileId] = url;
          return { id: face.fileId, url };
        } catch {
          console.log('Произошла ошибка. Фото не найдено.');
          this.urls[face.fileId] = '';
          return { id: face.fileId, url: '' };
        }
      })
    );
    return urls;
  };

  get = (fileId) => (this.urls[fileId] ? this.urls[fileId] : '');
}

const photoURLs = new PhotoURLsHub();

export { photoURLs };
