import Layout from '../src/components/Layout';

const Home = () => {
  return (
    <Layout>
      <form style={{textAlign: 'center', paddingBottom: '30%'}}>

        <h1 style={{paddingTop: '5%'}}>Call a Key Contact</h1>
        <p>Enter the key contacts mobile number to begin a call</p>

        <div class="nhsuk-form-group">
          <label class="nhsuk-label" for="example">
            What is your name?
          </label>
          <input class="nhsuk-input" id="example" name="example" type="text" style={{width: '25%'}}></input>
          <br></br>
          <br></br>
          
          <button class="nhsuk-button" type="submit">
            Call Key Contact
          </button>

        </div>
      </form>
    </Layout>
  )
}

export default Home;
