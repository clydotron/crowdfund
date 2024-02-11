import React from 'react';
import Layout from '../../../../components/Layout';
import NewRequestForm from '../../../../components/RequestForm';
import { useRouter } from 'next/router';
import { Button } from 'semantic-ui-react'

function NewRequests() {
  const router = useRouter()
  const { campaignid } = router.query
  return (
    <Layout>
      <Button onClick={() => router.push(`/campaigns/${campaignid}`) }>Back</Button>
      <h3>Create a new request</h3>
      <NewRequestForm address={campaignid}/>
    </Layout>
  )
}

export default NewRequests;