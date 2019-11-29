import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Modal, Tabs, Form, Icon, message, Spin } from 'antd';
import intl from 'react-intl-universal';
import EOSAccountRAM from './EOSAccountRAM';
import EOSAccountCPU from './EOSAccountCPU';
import EOSAccountNET from './EOSAccountNET';
import style from './index.less';
const RAM = Form.create({ name: 'EOSAccountRAM' })(EOSAccountRAM);
const CPU = Form.create({ name: 'EOSAccountCPU' })(EOSAccountCPU);
const NET = Form.create({ name: 'EOSAccountNET' })(EOSAccountNET);
const { TabPane } = Tabs;

@inject(stores => ({
    language: stores.languageIntl.language,
    settings: stores.session.settings,
    selectedAccount: stores.eosAddress.selectedAccount,
}))

@observer
class EOSResourceManageForm extends Component {
    state = {
        activeKey: 0,
        prices: {
            ram: 0,
            cpu: 0,
            net: 0
        }
    }

    componentDidMount() {
        wand.request('address_getEOSResourcePrice', { account: this.props.selectedAccount.account }, (err, res) => {
            if (!err) {
                this.setState({
                    prices: res
                });
            } else {
                console.log('Get resource price failed:', err);
                message.error('Get resource price failed');
            }
        });
    }

    onChange = (activeKey) => {
        this.setState({
            activeKey
        })
    }

    onCancel = () => {
        this.props.onCancel();
    }

    render() {
        return (
            <Modal
                visible
                wrapClassName={style.EOSResourceManageFormModal}
                destroyOnClose={true}
                closable={false}
                title={'EOS Resource Management'}
                onCancel={this.onCancel}
                footer={null}
            >
                <Spin spinning={false} tip={intl.get('Loading.transData')} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} className="loadingData">
                    <Tabs className={style.tabs} defaultActiveKey={'0'} onChange={this.onChange} tabBarStyle={{ textAlign: 'center' }} tabBarGutter={120}>
                        <TabPane tab="RAM" key="0">
                            <RAM price={this.state.prices.ram ? this.state.prices.ram : 0 } onCancel={this.onCancel} />
                        </TabPane>
                        <TabPane tab="CPU" key="1">
                            <CPU price={this.state.prices.cpu ? this.state.prices.cpu : 0 } onCancel={this.onCancel} />
                        </TabPane>
                        <TabPane tab="NET" key="2">
                            <NET price={this.state.prices.net ? this.state.prices.net : 0 } onCancel={this.onCancel} />
                        </TabPane>
                    </Tabs>
                </Spin>
            </Modal>
        );
    }
}

export default EOSResourceManageForm;