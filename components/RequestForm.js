import React, { useState } from 'react';
import { Form, FormField, Button, Input, Message } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign'
import { useRouter } from 'next/router'
// second account:
// 0x50CB620b14a5426e0dB64648dAB9C9Be7712f028

function NewRequestForm({ address }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState(0)
  const [recipient, setRecipient] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading,setLoading] = useState(false)

  const router = useRouter()

  const onSubmit = async (event) => {
    event.preventDefault();

    setErrorMsg('');
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts(); 
      const campaign = Campaign(address)
      const wei = web3.utils.toWei(amount,"ether")
      await campaign.methods.createRequest(description,wei,recipient).send({
        from: accounts[0],
      })

      router.push(`/campaigns/${address}/requests`);

    } catch (err) {
      setErrorMsg(err.message);
    }
     setLoading(false);
  }

  return (
    <Form onSubmit={onSubmit} error={!!errorMsg}>
      <FormField>
        <label>Description</label>
        <Input
          value={description}
          onChange={event => setDescription(event.target.value)}
        />
      </FormField>
      <FormField>
        <label>Amount in Ether</label>
        <Input
          value={amount}
          onChange={event => setAmount(event.target.value)}
        />
      </FormField>
      <FormField>
        <label>Recipient</label>
        <Input
          value={recipient}
          onChange={event => setRecipient(event.target.value)}
        />
      </FormField>
      <Message error header="Oops!" content={errorMsg} />
      <Button primary loading={loading}>Create</Button>
    </Form>
  )
}
export default NewRequestForm;