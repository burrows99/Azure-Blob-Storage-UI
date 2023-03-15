import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function Homepage(props) {
  const [folderStructure, setFolderStructure] = useState({});
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [files, setFiles] = useState([]);

  const sasToken = props.sasToken;
  const resourceName = props.resourceName;
  const containerName = props.containerName;
  const containerUrl = `https://${resourceName}.blob.core.windows.net/${containerName}`;
  const listUrl = `${containerUrl}?restype=container&comp=list&${sasToken}`;

  useEffect(() => {
    axios.get(listUrl)
      .then(response => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");
        const files = Array.from(xmlDoc.getElementsByTagName("Name")).map(node => {
          const fullName = node.textContent;
          const parts = fullName.split('/');
          const folderName = parts[0];
          const fileName = parts[1];
          const url = `${containerUrl}/${fullName}?${sasToken}`;
          return { folderName, fileName, url };
        });
        const folderStructure = files.reduce((acc, file) => {
          const { folderName } = file;
          if (!acc[folderName]) {
            acc[folderName] = [];
          }
          acc[folderName].push(file);
          return acc;
        }, {});
        setFolderStructure(folderStructure);
      })
      .catch(error => console.log(error));
  }, [listUrl]);

  useEffect(() => {
    if (selectedFolder) {
      const folderUrl = `${containerUrl}/${selectedFolder}?restype=container&comp=list&${sasToken}`;
      axios.get(folderUrl)
        .then(response => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(response.data, "text/xml");
          const files = Array.from(xmlDoc.getElementsByTagName("Blob")).map(node => {
            const name = node.getElementsByTagName("Name")[0].textContent;
            const url = `${containerUrl}/${selectedFolder}/${name}?${sasToken}`;
            return { name, url };
          });
          setFiles(files);
          setFolderStructure(prevState => {
            return {
              ...prevState,
              [selectedFolder]: files
            };
          });
        })
        .catch(error => console.log(error));
    } else {
      setFiles([]);
    }
  }, [selectedFolder, sasToken, containerUrl]);

  const handleFolderChange = (event) => {
    setSelectedFolder(event.target.value);
  }
  return (
    <div>
      <h1>Blob Storage Data</h1>
      <label htmlFor="folder">Select a folder:</label>
      <select id="folder" onChange={handleFolderChange}>
        <option value="">-- Select a folder --</option>
        {Object.keys(folderStructure).map(folder => (
          <option key={folder} value={folder}>{folder}</option>
        ))}
      </select>
      {selectedFolder && (
        <>
          <h2>Contents of folder {selectedFolder}:</h2>
          <div className="grid">
            {folderStructure[selectedFolder].map(file => (
              <div key={file.name} className="grid-item">
                <img src={file.url} alt={file.name} />
                <div>{file.name}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Homepage;
