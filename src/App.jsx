import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import Homepage from './Homepage';
import ContainersDropDown from './ContainersDropDown';

function App() {
  const [resourceName, setResourceName] = useState('');
  const [sasToken, setSasToken] = useState('');
  const [showHomepage, setShowHomepage] = useState(false);
  const containerName = 'test-ui';

  const handleResourceNameChange = (event) => {
    setResourceName(event.target.value);
  }

  const handleSasTokenChange = (event) => {
    setSasToken(event.target.value);
  }

  const handleButtonClick = () => {
    const accountName = resourceName;
    const containerUrl = `https://${accountName}.blob.core.windows.net/${containerName}`;
    const listUrl = `${containerUrl}?restype=container&comp=list&${sasToken}`;
  
    axios.get(listUrl)
      .then(response => {
        if (response.status === 200) {
          setShowHomepage(true);
        } else {
          console.log('Unexpected status code:', response.status);
          setShowHomepage(false);
          alert('Invalid credentials. Please check your resource name and SAS token.');
        }
      })
      .catch(error => {
        console.log(error);
        setShowHomepage(false);
        alert('Invalid credentials. Please check your resource name and SAS token.');
      });
  }

  return (
    <div>
      {!showHomepage && (
        <div>
          <label>
            Resource name:
            <input type="text" value={resourceName} onChange={handleResourceNameChange} />
          </label>
          <label>
            SAS token:
            <input type="text" value={sasToken} onChange={handleSasTokenChange} />
          </label>
          <button onClick={handleButtonClick}>Submit</button>
        </div>
      )}
      {showHomepage && (
        <Homepage resourceName={resourceName} sasToken={sasToken} containerName={containerName}/>
        // <ContainersDropDown resourceName={resourceName} sasToken={sasToken} containerName={containerName}/>

      )}
    </div>
  );
}

export default App;
