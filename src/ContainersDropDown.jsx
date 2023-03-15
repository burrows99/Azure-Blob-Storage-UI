import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function ContainersDropDown(props) {
  const resourceName = props.resourceName;
  const sasToken = props.sasToken;
  const url = `https://${resourceName}.blob.core.windows.net/?comp=list&${sasToken}`;
  
  const [containers, setContainers] = useState([]);

  useEffect(() => {
    axios.get(url)
      .then(response => {
        const containerNames = response.data.EnumerationResults.Containers.Container.map(c => c.Name);
        setContainers(containerNames);
      })
      .catch(error => {
        console.error(error);
      });
  }, [url]);

  return (
    <div>
      <select>
        {containers.map(container => (
          <option key={container} value={container}>{container}</option>
        ))}
      </select>
    </div>
  );
}

export default ContainersDropDown;

//sv=2021-12-02&ss=bfqt&srt=c&sp=rwdlacupiytfx&se=2023-03-13T09:35:09Z&st=2023-03-13T01:35:09Z&spr=https&sig=taFZZghj%2FTCPcAoA4R3l28mMCUIwiL%2Bz86kPKQtO2e4%3D