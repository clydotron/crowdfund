import React from 'react';
import { CardGroup, Button } from 'semantic-ui-react'
import Layout from '../../components/Layout'

function Campaigns({campaigns}) {

    function renderCampaigns() {
        const items = campaigns.map(address => {
            return {
                header: address,
                description: <a href={`/campaigns/{address}` }>View</a>,
                fluid: true
            }
        })
        return <CardGroup items={items} />
    }

    return (
      <Layout>
        <div>
          <div>
            <Button floated="right" content='Create Campaign' icon='add circle' primary labelPosition='left' />
          </div>
          <h3>Open Campaigns:</h3>
          {renderCampaigns()}
        </div>
      </Layout>
      )
  
}

export default Campaigns;