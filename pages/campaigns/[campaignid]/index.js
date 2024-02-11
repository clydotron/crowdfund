import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import Campaign from '../../../ethereum/campaign'
import { Button, CardGroup, GridColumn, Grid, GridRow } from 'semantic-ui-react'
import ContributeForm from '../../../components/ContributeForm'
import web3 from '../../../ethereum/web3'

function CampaignDetails(props) {
  const router = useRouter()

  const { campaignid } = router.query
  const { minContribution, balance, requestsCount, approversCount, manager } = props;

  function renderDetails() {
    const items = [
      {
        header: manager,
        meta: 'Address of manager',
        description: "The manager created this campaign and can create requests to withdraw money.",
        style: { overflowWrap: 'break-word'}
      },
      {
        header: minContribution,
        meta: 'Minimum Contribution (wei)',
        description: "You must contruibute at least this much wei to become an approver."
      },
      {
        header: web3.utils.fromWei(balance,"ether"),
        meta: 'Campaign Balance (ether)',
        description: 'Total amount of ether remaining in the campaign.'
      },
      {
        header: requestsCount,
        meta: 'Number of requests',
        description: "A request tries to withdraw money from the campaign. Each request must be approved by a majority of the approvers."

      },
      {
        header: approversCount,
        meta: "Number of Approvers",
        description: "Number of people that have already contributed to this campaign."
      },
    ]

    return <CardGroup items={items} />
  }

  return (
    <Layout>
      <h4>Campaign: {campaignid}</h4>
      <Grid>
        <GridRow>
          <GridColumn width={10}>
            {renderDetails()}
          </GridColumn>        
          <GridColumn width={6}>
            <ContributeForm address={campaignid} /> 
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn>
            <Button primary onClick={() => router.push(`/campaigns/${campaignid}/requests`)}>Requests</Button>
          </GridColumn>
        </GridRow>
      </Grid>
    </Layout>
    )
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export async function getStaticProps({params}) {
  const { campaignid } = params
  const campaign = Campaign(campaignid); //could do params.campaignid
  const summary = await campaign.methods.getSummary().call()
  
  return {
    props: {
      minContribution: Number(summary[0]),
      balance: Number(summary[1]),
      requestsCount: Number(summary[2]),
      approversCount: Number(summary[3]),
      manager: summary[4],
    }
  }
  // TODO is there a better way to work with this?
}
export default CampaignDetails;