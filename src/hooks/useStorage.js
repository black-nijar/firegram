import { useState, useEffect } from 'react';
import { projectStorage, projectFirestore, timeStamp } from '../firebsae/config';

const useStorage = (file) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    // references
    const storageRef = projectStorage.ref(file.name);
    const collectionRef = projectFirestore.collection('Images')
    storageRef.put(file).on(
      'state_changed',
      (snap) => {
        let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
        setProgress(percentage);
      },
      (err) => {
        setError(err);
      },
      async () => {
        const url = await storageRef.getDownloadURL();
        const createdAt = timeStamp;
        collectionRef.add({ url, createdAt })
        setUrl(url)
      }
    );
  }, [file]);
  return { progress, url, error };
};

export default useStorage;