import * as React from "react";
import {withTranslation, WithTranslation} from "react-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisH, faHome} from "@fortawesome/free-solid-svg-icons";
import {Breadcrumb} from "antd";
import './../styles/BreadcrumbApp.css';

interface Props {
    selectedKeys: string[];
    breadcrumb: string[];
    onClickBreadcrumb: (breadcrumb: any) => void;
}

interface State {
}

class BreadcrumbApp extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {}
    }

    render() {
        const { t } = this.props as Props & WithTranslation;
        return (
            (this.props.selectedKeys[0] &&
            this.props.selectedKeys[0].split('.').includes('app') &&
            this.props.breadcrumb.length !== 0)
                ||
                this.props.location.pathname === "/home"
            ?
                <Breadcrumb className="ul-breadcrumb breadcrumb-visibility">
                    <li className="li-breadcrumb" title={t(`home`)} key="home">
                        <Breadcrumb.Item separator="" key={"home"} onClick={() => this.props.onClickBreadcrumb("home")}>
                            <FontAwesomeIcon className="breadcrumbIcon" icon={faHome}/>
                        </Breadcrumb.Item>
                    </li>
                    {this.props.breadcrumb.map((b: string) =>
                            <li className="li-breadcrumb" title={t(`${b.split('_')[0]}`)} key={b}>
                                <Breadcrumb.Item separator="" key={b} onClick={() => this.props.onClickBreadcrumb(b)}>
                                    <FontAwesomeIcon className="breadcrumbIcon" icon={faEllipsisH}/>
                                    <span className="text">
                                        {t(`${b.split('_')[0]}`)}
                                    </span>
                                </Breadcrumb.Item>
                            </li>
                        )
                    }
                </Breadcrumb>
                : ""
        );
    }
}

export default withTranslation()(BreadcrumbApp)
