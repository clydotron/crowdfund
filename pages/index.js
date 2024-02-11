import React, { useState, useEffect }  from 'react';
import factory from "../ethereum/factory"
import { CardGroup, Button } from 'semantic-ui-react'

import Layout from '../components/Layout'

function Something({campaigns}) {

    function renderCampaigns() {
        const items = campaigns.map(address => {
            return {
                header: address,
                description: <a href={`/campaigns/${address}` }>View</a>,
                fluid: true
            }
        })

        return <CardGroup items={items} />
    }
      //<div>{renderCampaigns()}</div>
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

export async function getStaticProps() {
    console.log("calling >>>")
    const campaigns = await factory.methods.getDeployedCampaigns().call()
    console.log("getStaticProps:",campaigns)

  return {
    props: {
      campaigns,
    },
  };
}

export default Something;