import * as React from "react";
import {Form} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {withTranslation, WithTranslation} from "react-i18next";
import {NeoButton, NeoInput, NeoTable} from "neo-design/lib";

interface Props {
    onName: any;
    onTitle: any;
    tableData: Array<any>;
    tableDataFilter: (tableDataFilter: Array<any>) => void;
}

interface State {
    selectedRowKeys: any[];
    searchText: string;
    selectedKeys: any[];
}

class SearchFilter extends React.Component<Props & FormComponentProps & WithTranslation, State> {
    state = {
        selectedRowKeys: [],
        searchText: '',
        selectedKeys: []
    };

    sortColumns = (a: any, b: any, name: string, type: string): number => {
        if (b !== undefined) {
            if (type === "stringType" && typeof a[name] === "string" && typeof b[name] === "string") {
                if (a[name] !== undefined && b[name] !== undefined) {
                    if (a[name].toLowerCase() < b[name].toLowerCase()) return -1;
                    else if(a[name].toLowerCase() > b[name].toLowerCase()) return 1;
                    else return 0;
                }
                else if (a[name] === undefined && b[name] !== undefined) return -1;
                else if (a[name] !== undefined && b[name] === undefined) return 1;
                else return 0;
            }
            else if (type === "numberType") {
                if (a[name] !== undefined && b[name] !== undefined) { return a[name] - b[name] }
                else if (a[name] === undefined && b[name] !== undefined) return -1;
                else if (a[name] !== undefined && b[name] === undefined) return 1;
                else return 0;
            }
            else if (type === "dateType") return 0;
            else return 0;
        } else return 0;
    };

    filterDataSource = (name: string, searchText: string): Array<any> => {
        const result: Array<any> = [];
        for (let td of this.props.tableData){
            let tdName: string = td[name];
                if (searchText === "" || searchText === undefined) {
                    if (result.every((value) => value[name] !== tdName))
                    {result.push(td)}
                }
                else if (tdName.toLowerCase().includes(searchText.toLowerCase()) && result.every((value) =>
                        value[name] !== tdName))
                {result.push(td)}
        }
        result.sort((a: any, b: any) => this.sortColumns(a, b, name, "stringType"));
        return result
    };

    setSelectedKeys = (selectedKeys: any) => {
        this.setState({ selectedKeys, selectedRowKeys: [] });
    };

    onSelectChange = (selectedRowKeys: any) => {
        this.setState({ selectedRowKeys });
    };

    handleSearchFilterDropdown = (selectedKeys: string[]) => {
        this.setState({ searchText: selectedKeys[0] });
        let temp: Array<any> = this.state.selectedRowKeys.map(i=> this.props.tableData[i][this.props.onName]);
        const result: Array<any> = [];
        for (let td of this.props.tableData){
            if (temp.includes(td[this.props.onName])) {
                result.push(td)
            }
        }
        if (this.props.tableDataFilter) {this.props.tableDataFilter(result)}
    };

    render() {
        const {t} = this.props;
        const columnsT = t(this.props.onTitle, {ns: 'packages'});
            const {selectedRowKeys} = this.state;
            const rowSelection = {
                selectedRowKeys,
                onChange: this.onSelectChange
            };
            console.log('LENGTH', this.filterDataSource(this.props.onName, this.state.selectedKeys[0]))
            return (
                <Form style={{ padding: '9px 16px' }} >
                    <NeoInput
                        type={'search'}
                        placeholder={`${t('search')} ${columnsT}`}
                        value={this.state.selectedKeys[0]}
                        onChange={(e:any) => this.setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearchFilterDropdown(this.state.selectedKeys)}
                        width={'628px'}
                        style={{ marginRight:'24px', display: "inline-block"}}
                        defaultChecked={true}
                        allowClear={true}
                    />
                    <NeoTable
                        size={"small"}
                        pagination={{pageSize: this.filterDataSource(this.props.onName, this.state.selectedKeys[0]).length}}
                        style={{whiteSpace: "pre", position:'absolute', left:'0', width: "711px", marginTop: "15px", overflow:'auto', top:'95px', bottom:'145px' }}
                        columns={[{title: t('selectAll'), dataIndex: this.props.onName, key: this.props.onName}]}
                        dataSource={this.filterDataSource(this.props.onName, this.state.selectedKeys[0])}
                        rowSelection={rowSelection}
                    />
                    <div style={{
                        position: 'absolute',
                        right: 0,
                        bottom: '80px',
                        width: '100%',
                        borderTop: '1px solid #e9e9e9',
                        padding: '16px 40px',
                        background: '#F2F2F2',
                        textAlign: 'left',
                    }}>
                    <NeoButton
                        title={t('run query')}
                        onClick={() => this.handleSearchFilterDropdown(this.state.selectedKeys)}
                        style={{marginRight:'16px'}}
                    >
                        {t('run query')}
                    </NeoButton>
                    <NeoButton
                        onClick={() => {

                            this.setState({selectedKeys: [], selectedRowKeys: []});
                            if (this.props.tableDataFilter) {
                                this.props.tableDataFilter(this.props.tableData);
                            }
                        }}
                        type={"secondary"}
                        title={t('reset')}
                    >
                        {t('reset')}
                    </NeoButton>
                    </div>
                </Form>
            );
        }}

export default withTranslation()(Form.create<Props & FormComponentProps & WithTranslation>()(SearchFilter))
