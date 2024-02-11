import React, { useState, useEffect } from 'react';
import Layout from '../../../../components/Layout';
import { useRouter } from 'next/router';
import Campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';
import {
  Button,
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableBody,
  Table,
} from 'semantic-ui-react'
import RequestRow from '../../../../components/RequestRow';

function ShowRequest(props) {
  const [localAccount, setLocalAccount] = useState('')
  const router = useRouter()
  const { campaignid } = router.query  
  const { requests, approversCount, manager } = props
  
  // get the address of account 0 and store it
  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3.eth.getAccounts();
      setLocalAccount(accounts[0]);
    }
    getAccounts();
  },[])


  const onApprove = async (id) => {
    const campaign = Campaign(campaignid);
    try {
      await campaign.methods.approveRequest(id).send({
        from: localAccount
      })
    } catch (err) {
      console.log(err.message)
    }
  }

  const onFinalize = async (id) => {
    console.log("Finalize!", id)
    const campaign = Campaign(campaignid);
    await campaign.methods.finalizeRequest(id).send({ from: localAccount })
  }

  //const accounts = await web3.eth.getAccounts(); 

  const renderRequests = () => {
    return requests.map((request,index ) => {
      return <RequestRow
        key={index}
        id={index}
        request={request}
        approversCount={approversCount}
        onApprove={onApprove}
        onFinalize={onFinalize}
        manager={true}
      />
    })
  }

  // dont even render the Finalize column if not manager
  const renderRequestsTable = () => {
    return (
  <Table celled>
    <TableHeader>
      <TableRow key={9090}>
        <TableHeaderCell>ID</TableHeaderCell>
        <TableHeaderCell>Description</TableHeaderCell>
        <TableHeaderCell>Amount</TableHeaderCell>
        <TableHeaderCell>Recipient</TableHeaderCell>
        <TableHeaderCell>Approval Count</TableHeaderCell>
        <TableHeaderCell>Approve</TableHeaderCell>
        <TableHeaderCell>Finalize</TableHeaderCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      {renderRequests()}
    </TableBody>
      </Table>
    )
  }

  return (
    <Layout>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between'}}>
        <h3>Pending Requests</h3>
        <Button primary floated="right" style={{ marginBottom: 10}}  onClick={() => router.push(`/campaigns/${campaignid}/requests/new`)}>Create!</Button>
      </div>
      {renderRequestsTable()}
      <Button basic onClick={() => router.push(`/campaigns/${campaignid}`) }>back</Button>
    </Layout>
  )
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const campaign = Campaign(params.campaignid); 
  const trequests = await campaign.methods.getAllRequests().call()
  const approversCount = await campaign.methods.approversCount().call()
  // TODO figure out why returns both an array, and an object

  const manager = await campaign.methods.manager().call()
 
  // convert the requests into a useable format 
  // TODO double check this
  const requests = trequests.map(v => {
    return {
      description: v.description,
      amount: web3.utils.fromWei(v.value, 'ether'),
      recipient: v.recipient,
      complete: v.complete,
      approvalCount: Number(v.approvalCount)
    }
  })

  return {
    props: {
      requests,
      approversCount: Number(approversCount),
      manager
    }
  }
}

export default ShowRequest;