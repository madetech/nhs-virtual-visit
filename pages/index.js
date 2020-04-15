import React, { useCallback, useState } from 'react';
import Layout from '../src/components/Layout';
import fetch from 'isomorphic-unfetch';

const Home = () => {
  const [contactNumber, setContactNumber] = useState('');
  
  const onSubmit = useCallback(async (event) => {
    event.preventDefault();

    const response = await fetch('/api/calls', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        contactNumber,
      }),
    });

    const { callUrl } = await response.json();
    window.location.href = callUrl;
  });

  return (
    <Layout>
      <form onSubmit={onSubmit} style={{textAlign: 'center', paddingBottom: '30%'}}>

        <h1 style={{paddingTop: '5%'}}>Call a Key Contact</h1>
        <p>Enter the key contacts mobile number to begin a call</p>

        <div className="nhsuk-form-group">
          <label className="nhsuk-label" htmlFor="contactNumber">
            Enter key contact's mobile number
          </label>
          <input 
            onChange={(event) => setContactNumber(event.target.value)}
            className="nhsuk-input"
            id="contactNumber"
            name="contactNumber"
            type="text" 
            style={{width: '25%'}}></input>
          <br></br>
          <br></br>
          
          <button className="nhsuk-button" type="submit">
            Call Key Contact
          </button>
        </div>
      </form>
    </Layout>
  )
}

export default Home;
