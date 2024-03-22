import { Divider, Layout } from 'antd';
import React from 'react';
import "./footer.css";

const { Footer } = Layout;

function _Footer() {
    return (

        <Footer style={{ backgroundColor: "#003300", padding: 20, paddingTop: 0 }}>
            <div style={{ textAlign: 'center' }}>
                <Divider style={{ padding: 0 }} />
                <p style={{ color: "#FFFFFF", fontSize: 13 }}>Copyright@ 2023 Created by BookWiseNew</p>
            </div>
        </Footer>
    );
}

export default _Footer;