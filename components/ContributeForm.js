import React, { useState } from 'react';
import { Form, FormField, Button, Input, Message } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign'
import { useRouter } from 'next/router'

function ContributeForm({ address }) {
  const [amount, setAmount] = useState(0.0001)
  const [errorMsg, setErrorMsg] = useState('')
  const [loading,setLoading] = useState(false)

  const router = useRouter()
  // TODO double check arrow funcs for this...
  const onSubmit = async (event) => {
    event.preventDefault();

    setErrorMsg('');
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts(); 
      const campaign = Campaign(address)
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(amount, "ether")
      })

      // better way to do this?
      router.reload();

    } catch (err) {
      setErrorMsg(err.message);
    }
     setLoading(false);
  }

  const onInput = (event) => {
    setAmount(event.target.value)
  }

  return (
    <Form onSubmit={onSubmit} error={!!errorMsg}>
      <FormField>
        <label>Amount to Contribute</label>
        <Input
          label="ether"
          labelPosition='right'
          value={amount}
          onChange={onInput}
        />
      </FormField>
      <Message error header="Oops!" content={errorMsg} />
      <Button primary loading={loading}>Contribute!</Button>
    </Form>
  )
}
export default ContributeForm;