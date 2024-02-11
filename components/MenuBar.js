import React, { useState } from 'react';
import { MenuMenu, MenuItem, Menu } from 'semantic-ui-react'
import { useRouter } from 'next/router';

function MenuBar() {
    const [activeItem, setActiveItem] = useState('');
    const router = useRouter()

    function handleItemClick() {
        console.log("click!")
    }

    return (
        <Menu style={{ marginTop: '10px' }}>
            <MenuItem
                name='crowdfund'
                active={activeItem === 'crowdfund'}
                onClick={() => router.push('/')}
            >
                CrowdFund
            </MenuItem>

            <MenuMenu position='right'>
                <MenuItem
                    name='campaigns'
                    active={activeItem === 'campaigns'}
                    onClick={handleItemClick}
                >
                    Campaigns
                </MenuItem>

                <MenuItem
                    name='newcampaign'
                    active={activeItem === 'newcampaign'}
                    onClick={() => router.push('/campaigns/new')}
                >
                    +
                </MenuItem>
            </MenuMenu>
        </Menu>
    )
}
export default MenuBar;