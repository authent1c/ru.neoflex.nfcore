import * as React from "react";
import {FC} from "react";
import {withTranslation, WithTranslation} from "react-i18next";
import MandatoryReportingTrans from "./MandatoryReporting";

const UserComponents: any = {
    MandatoryReportingTrans: MandatoryReportingTrans
};

export interface Props {
    componentClassName: string
}

class UserComponent extends React.Component<Props & WithTranslation, any> {

    state = { Component: ()=><span>Loading...</span> };

    loadUserComponent() {
        if (UserComponents[`${this.props.componentClassName}`]) {
            this.setState({
                Component: withTranslation()(UserComponents[`${this.props.componentClassName}`])
            });
        } else {
            this.notDownload()
        }
    }

    private notDownload() {
        this.setState({
            Component: () =>
                <div>"{this.props.componentClassName}" not found</div>
        })
    }

    componentDidMount(): void {
        this.loadUserComponent()
    }

    render() {
        const Component = this.state.Component as unknown as FC;
        return (
            <MandatoryReportingTrans/>
        )}
    }

export default withTranslation()(UserComponent)
