import React, {useState} from 'react';
import Layout from '../../components/Layout';
import { Form, FormField, Button, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { useRouter } from 'next/router';

function NewCampaign() {
  const [minContribution, setMinContribution] = useState(100)
  const [errorMsg, setErrorMsg] = useState('')
  const [loading,setLoading] = useState(false)
  
  const router = useRouter()

  // try using an error function (?)
  async function onSubmit(event) {
    event.preventDefault();

    setErrorMsg('')
    setLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minContribution).send({
        from: accounts[0]
      })
      console.log("created new campaign!")
      // send user to root route...
      router.push('/')
    } catch (err) {
      setErrorMsg(err.message)
    }
    
    setLoading(false);
  }

  function onInput(event) {
    setMinContribution(event.target.value)
  }

  return (
    <Layout>
      <h3>Create a Campaign</h3>
      <Form onSubmit={onSubmit} error={!!errorMsg}>
        <FormField>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            labelPosition='right'
            value={minContribution}
            onChange={onInput}
          />
        </FormField>
        <Message error header="Oops" content={errorMsg} />
        <Button primary loading={loading}>Create</Button>
      </Form>
    </Layout>
  )
}

export default NewCampaign;
