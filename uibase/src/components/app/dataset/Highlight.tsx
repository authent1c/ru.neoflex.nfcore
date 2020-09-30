import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import {EObject} from 'ecore';
import {Form, Modal, Radio} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {paramType} from "./DatasetView"
import {IServerQueryParam} from "../../../MainContext";
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import '../../../styles/Draggable.css';
import {DrawerParameterComponent} from './DrawerParameterComponent';
import {ColorPicker, SketchColorPicker} from "./ColorPicker";
import {NeoButton, NeoCol, NeoInput, NeoRow, NeoSelect, NeoSwitch} from "neo-design/lib";
import {NeoIcon} from "neo-icon/lib";

interface Props {
    parametersArray?: Array<IServerQueryParam>;
    columnDefs?:  Map<String,any>[];
    onChangeParameters?: (newServerParam: any[], paramName: paramType) => void;
    saveChanges?: (newParam: any, paramName: string) => void;
    isVisible?: boolean;
    allOperations?: Array<EObject>;
    componentType?: paramType;
    allHighlightType?: Array<EObject>;
}

interface State {
    parametersArray: IServerQueryParam[] | undefined;
    backgroundColorVisible: boolean;
    textColorVisible: boolean;
    colorIndex: any;
    color: any;
}

const SortableList = SortableContainer(({items}:any) => {
    return (
        <ul className="SortableList">
            {items.map((value:any) => (
                <SortableItem key={`item-${value.index}`} index={value.index-1} value={value} />
            ))}
        </ul>
    );
});

const SortableItem = SortableElement(({value}: any) => {
    return <div className="SortableItemHighlight">
        <NeoRow style={{height:'100%'}}>
            <NeoCol span={1} style={{alignItems:'flex-start'}}>
                <span>{value.index}</span>
            </NeoCol>
            <NeoCol span={2} style={{alignItems:'flex-start'}}>
                <Form.Item style={{ display: 'inline-block' }}>
                    <NeoSwitch
                        defaultChecked={value.enable !== undefined ? value.enable : true}
                        onChange={(e: any) => {
                            const event = JSON.stringify({index: value.index, columnName: 'enable', value: e});
                            value.handleChange(event)
                        }}/>
                </Form.Item>
            </NeoCol>
            <NeoCol span={8} style={{flexDirection:'column', alignItems:'flex-start'}}>
                <Form.Item style={{margin: 'auto'}}>
                <NeoRow>
                    {value.getFieldDecorator(`${value.idDatasetColumn}`,
                        {
                            initialValue: (value.datasetColumn)?value.translate(value.datasetColumn):undefined,
                            rules: [{
                                required:
                                    value.operation ||
                                    value.value ||
                                    value.highlightType,
                                message: ' '
                            }]
                        })(
                        <NeoSelect
                            getPopupContainer={() => document.getElementById ('filterButton') as HTMLElement}
                            placeholder={value.t('columnname')}
                            width={'208px'}
                            showSearch={true}
                            allowClear={true}
                            onChange={(e: any) => {
                                const event = e ? e : JSON.stringify({
                                    index: value.index,
                                    columnName: 'datasetColumn',
                                    value: undefined
                                });
                                value.handleChange(event)
                            }}
                        >
                            {
                                value.columnDefs!
                                    .map((c: any) =>
                                        <option
                                            key={JSON.stringify({
                                                index: value.index,
                                                columnName: 'datasetColumn',
                                                value: c.get('field')
                                            })}
                                            value={JSON.stringify({
                                                index: value.index,
                                                columnName: 'datasetColumn',
                                                value: c.get('field')
                                            })}
                                        >
                                            {c.get('headerName')}
                                        </option>)
                            }
                        </NeoSelect>
                    )}
                </NeoRow>
                </Form.Item>
                <Form.Item style={{margin: 'auto'}}>
                    <NeoRow>
                        {value.getFieldDecorator(`${value.idOperation}`,
                            {
                                initialValue: value.t(value.operation) || undefined,
                                rules: [{
                                    required:
                                        (value.datasetColumn && value.highlightType !== 'Column') ||
                                        (value.value && value.highlightType !== 'Column')||
                                        (value.highlightType && value.highlightType !== 'Column'),
                                    message: ' '
                                }]
                            })(
                            <NeoSelect
                                getPopupContainer={() => document.getElementById ('filterButton') as HTMLElement}
                                disabled={value.highlightType === 'Column'}
                                placeholder={value.t('operation')}
                                width={'208px'}
                                allowClear={true}
                                onChange={(e: any) => {
                                    const event = e ? e : JSON.stringify({
                                        index: value.index,
                                        columnName: 'operation',
                                        value: undefined
                                    })
                                    value.handleChange(event)
                                }}
                            >
                                {
                                    value.allOperations!
                                        .map((o: any) =>
                                            <option
                                                key={JSON.stringify({
                                                    index: value.index,
                                                    columnName: 'operation',
                                                    value: o.get('name')
                                                })}
                                                value={JSON.stringify({
                                                    index: value.index,
                                                    columnName: 'operation',
                                                    value: o.get('name')
                                                })}
                                            >
                                                {value.t(o.get('name'))}
                                            </option>)
                                }
                            </NeoSelect>
                        )}
                </NeoRow>
                    </Form.Item>
            </NeoCol>
            <NeoCol span={8} style={{flexDirection:'column', alignItems:'flex-start'}}>
                    <Form.Item style={{margin: 'auto'}}>
                        <NeoRow>
                        {value.getFieldDecorator(`${value.idHighlightType}`,
                            {
                                initialValue: value.t(value.highlightType),
                                rules: [{
                                    required: value.datasetColumn && value.highlightType !== 'Column',
                                    message: ' '
                                }]
                            })(
                            <NeoSelect
                                getPopupContainer={() => document.getElementById ('filterButton') as HTMLElement}
                                allowClear={true}
                                width={'208px'}
                                onChange={(e: any) => {
                                    const event = e ? e : JSON.stringify({
                                        index: value.index,
                                        columnName: 'highlightType',
                                        value: undefined
                                    })
                                    value.handleChange(event)
                                }}
                            >
                                {
                                    value.allHighlightType!
                                        .map((o: any) =>
                                            <option
                                                key={JSON.stringify({
                                                    index: value.index,
                                                    columnName: 'highlightType',
                                                    value: o.get('name')
                                                })}
                                                value={JSON.stringify({
                                                    index: value.index,
                                                    columnName: 'highlightType',
                                                    value: o.get('name')
                                                })}
                                            >
                                                {value.t(o.get('name'))}
                                            </option>)
                                }
                            </NeoSelect>
                        )}
                        </NeoRow>
                    </Form.Item>
                    <Form.Item style={{margin: 'auto'}}>
                        <NeoRow>
                        {value.getFieldDecorator(`${value.idValue}`,
                            {
                                initialValue: value.value,
                                rules: [{
                                    required:
                                        (value.datasetColumn && value.highlightType !== 'Column') ||
                                        (value.operation && value.highlightType !== 'Column')||
                                        (value.highlightType && value.highlightType !== 'Column'),
                                    message: ' '
                                }]
                            })(
                            <NeoInput
                                placeholder={value.t('value')}
                                disabled={value.operation === 'IsEmpty' || value.operation === 'IsNotEmpty' || value.highlightType === 'Column'}
                                width={'208px'}
                                allowClear={true}
                                onChange={(e: any) => value.handleChange(
                                    JSON.stringify({
                                        index: value.index,
                                        columnName: 'value',
                                        value: e.target.value === "" ? undefined : e.target.value
                                    })
                                )}
                                title={value.value}
                                id={value.index.toString()}
                            />
                        )}
                        </NeoRow>
                    </Form.Item>
            </NeoCol>
            <NeoCol span={2} style={{alignItems:'flex-start'}}>
                <NeoButton
                    type={'link'}
                    onClick={() => value.handleColorMenu('background', value.index)}
                    style={{
                    marginTop:'15px'
                    }}
                >
                    <NeoIcon icon={"fill"} size={"m"} color={value.backgroundColor}/>
                </NeoButton>
                <Modal
                    getContainer={() => document.getElementById ('filterButton') as HTMLElement}
                    width={'320px'}
                    title={'Выбор цвета фона'}
                    visible={value.backgroundColorVisible && value.colorIndex === value.index}
                    onCancel={() => value.handleColorMenu('background', value.index)}
                    closable={false}
                    mask={false}
                    footer={[<Form onSubmit={value.handleSubmit}>
                        <NeoButton type={'secondary'} key="back" onClick={() => value.handleColorMenu('background', value.index)}>
                            Отменить
                        </NeoButton>
                        <NeoButton
                            title="run query"
                            id={'runQueryButton'}
                            onClick={() => {
                                return value.handleChange(JSON.stringify({
                                    index: value.index,
                                    columnName: 'backgroundColor',
                                    value: value.stateColor !== undefined ? value.stateColor : value.backgroundColor
                                }))
                            }}>
                            ОК
                        </NeoButton></Form>,
                    ]}>
                    <Radio.Group defaultValue="solid" buttonStyle="solid">
                        <Radio.Button
                            style={{color:'black', backgroundColor: '#ffffff', border:'none', outline:'none'}}
                            onClick={()=>value.handleColorPicker('solid')} value="solid"
                            checked={value.solidPicker}>Основной</Radio.Button>
                        <Radio.Button
                            onClick={()=>value.handleColorPicker('gradient')} value="gradient"
                            checked={!value.solidPicker}>Расширенный</Radio.Button>
                    </Radio.Group>
                    {value.solidPicker && (
                        <ColorPicker value={value} type={'background'}/>
                    )}
                    {!value.solidPicker && (
                        <SketchColorPicker value={value} type={'background'} />
                    )}
                </Modal>
            </NeoCol>
            <NeoCol span={2} style={{alignItems:'flex-start'}}>
                <NeoButton
                    type={'link'}
                    onClick={() => value.handleColorMenu('text', value.index)}
                    style={{
                        marginTop:'15px'
                    }}
                >
                    <NeoIcon icon={"letter"} color={value.color} size={"m"}/>
                </NeoButton>
                <Modal
                    getContainer={() => document.getElementById ('filterButton') as HTMLElement}
                    width={'320px'}
                    title={'Выбор цвета текста'}
                    visible={value.textColorVisible && value.colorIndex === value.index}
                    onCancel={() => value.handleColorMenu('text', value.index)}
                    closable={false}
                    mask={false}
                    footer={[<Form onSubmit={value.handleSubmit}>
                        <NeoButton type={"secondary"} key="back" onClick={() => value.handleColorMenu('text', value.index)}>
                            Отменить
                        </NeoButton>
                        <NeoButton
                            title="run query"
                            id={'runQueryButton'}
                            onClick={() => value.handleChange(JSON.stringify({
                                index: value.index,
                                columnName: 'color',
                                value: value.stateColor !== undefined ? value.stateColor : value.color
                            }))}>
                            ОК
                        </NeoButton></Form>,
                    ]}
                >
                    <Radio.Group defaultValue="solid" buttonStyle="solid">
                        <Radio.Button
                            style={{color:'black', backgroundColor: '#ffffff', border:'none', outline:'none'}}
                            onClick={()=>value.handleColorPicker('solid')} value="solid"
                            checked={value.solidPicker}>Основной</Radio.Button>
                        <Radio.Button
                            onClick={()=>value.handleColorPicker('gradient')} value="gradient"
                            checked={!value.solidPicker}>Расширенный</Radio.Button>
                    </Radio.Group>
                    {value.solidPicker && (
                        <ColorPicker value={value} type={'text'} />
                    )}
                    {!value.solidPicker && (
                        <SketchColorPicker value={value} type={'text'} />
                    )}
                </Modal>
            </NeoCol>
            <NeoCol span={1} style={{alignItems:'flex-start'}}>
                <Form.Item style={{ display: 'inline-block', marginTop: '10px' }}>
                    <NeoButton
                        type={'link'}
                        title={value.t("delete row")}
                        id={'deleteRowButton'}
                        onClick={(e: any) => {value.deleteRow({index: value.index})}}
                    >
                        <NeoIcon icon={'rubbish'} size={'m'} color="#B3B3B3"/>
                    </NeoButton>
                </Form.Item>
            </NeoCol>
        </NeoRow>
    </div>
});



class Highlight extends DrawerParameterComponent<Props, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            parametersArray: this.props.parametersArray,
            backgroundColorVisible: false,
            textColorVisible: false,
            colorIndex: undefined,
            color: undefined,
            solidPicker: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.t = this.props.t;
        this.getFieldDecorator = this.props.form.getFieldDecorator;
    }

    handleColorPicker = (type: string) => {
        if (type === 'solid') {
            this.setState({solidPicker: true})
        } else if (type === 'gradient') {
            this.setState({solidPicker: false})
        }
    }

    handleColorMenu = (type: string, index: string) => {
        if (type === 'background') {
            this.state.backgroundColorVisible ? this.setState({backgroundColorVisible: false}) : this.setState({backgroundColorVisible: true})
            this.setState({colorIndex: index})
        } else if (type === 'text') {
            this.state.textColorVisible ? this.setState({textColorVisible: false}) : this.setState({textColorVisible: true})
            this.setState({colorIndex: index})
        }
    };

    private changeColor(e: any, index: any) {
        this.setState({color: e})
    }

    handleChange(e: any) {
        const target = JSON.parse(e);
        let parametersArray = this.state.parametersArray!.map((f: any) => {
            if (f.index.toString() === target['index'].toString()) {
                const targetColumn = this.props.columnDefs!.find((c: any) =>
                    c.get('field') === (f.datasetColumn || target['value'])
                );
                return {
                    index: f.index,
                    datasetColumn: target['columnName'] === 'datasetColumn' ? target['value'] : f.datasetColumn,
                    operation: target['columnName'] === 'operation' ? target['value'] : f.operation,
                    value: target['columnName'] === 'value' ? target['value'] : f.value,
                    enable: target['columnName'] === 'enable' ? target['value'] : f.enable,
                    type: (targetColumn ? targetColumn.get('type') : undefined) || f.type,
                    highlightType: target['columnName'] === 'highlightType' ? target['value'] : f.highlightType,
                    backgroundColor: target['columnName'] === 'backgroundColor' ? target['value'] : f.backgroundColor,
                    color: target['columnName'] === 'color' ? target['value'] : f.color
                }
            } else {
                return f
            }
        });
        this.setState({parametersArray, backgroundColorVisible: false, textColorVisible: false, color: undefined, colorIndex: undefined})
    }

    reset = () => {
        this.props.onChangeParameters!(undefined, this.props.componentType);
        this.setState({parametersArray:[]});
        this.props.saveChanges(true, "isHighlightsUpdated");
    };

    deleteRow = (e: any) => {
        this.props.form.resetFields();
        let newServerParam: IServerQueryParam[] = [];
        this.state.parametersArray?.forEach((element:IServerQueryParam, index:number) => {
            if (element.index !== e.index) {
                newServerParam.push({
                    index: newServerParam.length + 1,
                    datasetColumn: element.datasetColumn,
                    operation: element.operation,
                    value: element.value,
                    enable: (element.enable !== null ? element.enable : false),
                    type: element.type,
                    highlightType: element.highlightType,
                    backgroundColor: element.backgroundColor,
                    color: element.color
                })}
        });
        this.props.onChangeParameters!(newServerParam, this.props.componentType);
        this.props.saveChanges(true, "isHighlightsUpdated");
    };

    render() {
        const {t} = this.props;
        return (
            <Form style={{ marginTop: '30px' }} onSubmit={this.handleSubmit}>
                <Form.Item style={{marginTop: '-28px', marginBottom: '5px'}}>
                    <NeoCol span={12} style={{justifyContent: "flex-start"}}>
                        <div style={{display: "inherit", fontSize: '16px', fontWeight: 500, color: '#878787'}}>{t('highlight')}</div>
                    </NeoCol>
                    <NeoCol span={12} style={{justifyContent: "flex-end"}}>
                        <NeoButton type={'link'}
                                   title={t("reset")}
                                   id={'resetButton'}
                                   onClick={this.reset}>
                            <span style={{color: '#B38136', fontSize: '14px', fontWeight:'normal', textDecorationLine:'underline'}}>Заливка по умолчанию</span>
                        </NeoButton>
                    </NeoCol>
                </Form.Item>
                <Form.Item style={{marginBottom:'0', maxHeight:'280px', overflow:'auto'}}>
                    {
                        <SortableList items={this.state.parametersArray!
                            .map((highlights: any) => (
                                {
                                    ...highlights,
                                    idDatasetColumn : `${JSON.stringify({index: highlights.index, columnName: 'datasetColumn', value: highlights.datasetColumn})}`,
                                    idOperation : `${JSON.stringify({index: highlights.index, columnName: 'operation', value: highlights.operation})}`,
                                    idValue : `${JSON.stringify({index: highlights.index, columnName: 'value', value: highlights.value})}`,
                                    idHighlightType : `${JSON.stringify({index: highlights.index, columnName: 'highlightType', value: highlights.highlightType})}`,
                                    t : this.t,
                                    getFieldDecorator: this.getFieldDecorator,
                                    columnDefs: this.props.columnDefs.filter((c:any)=>!c.get('hide')),
                                    allOperations: this.props.allOperations,
                                    handleChange: this.handleChange,
                                    deleteRow: this.deleteRow,
                                    translate: this.translate,
                                    parametersArray: this.state.parametersArray,
                                    allHighlightType: this.props.allHighlightType,
                                    handleColorMenu: this.handleColorMenu.bind(this),
                                    backgroundColorVisible: this.state.backgroundColorVisible,
                                    colorIndex: this.state.colorIndex,
                                    stateColor: this.state.color,
                                    changeColor: this.changeColor.bind(this),
                                    textColorVisible: this.state.textColorVisible,
                                    handleColorPicker: this.handleColorPicker.bind(this),
                                    solidPicker: this.state.solidPicker
                                }))} distance={3} onSortEnd={this.onSortEnd} helperClass="SortableHelper"/>
                    }
                </Form.Item>
                <Form.Item>
                    <NeoButton
                        type={'link'}
                        style={{marginTop:'-20px'}}
                        title={t("add row")}
                        id={'createNewRowButton'}
                        onClick={this.createNewRow}
                    >
                        <NeoIcon icon={"plus"} color={'#B38136'} size={'m'} style={{margin:'auto 5px auto auto'}}/>
                        <h4 style={{color: '#B38136', textDecorationLine:'underline'}}>Добавить</h4>
                    </NeoButton>
                </Form.Item>
            </Form>
        )
    }
}

export default withTranslation()(Form.create<Props & FormComponentProps & WithTranslation>()(Highlight))
