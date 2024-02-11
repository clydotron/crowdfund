import React from 'react';
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react';
import MenuBar from './MenuBar';

function Layout(props) {
    return (
        <Container>
            <MenuBar />
            {props.children}
        </Container>
    )
}

export default Layout;