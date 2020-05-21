import React from 'react';
import {WithTranslation, withTranslation} from "react-i18next";
import update from 'immutability-helper';
import {EObject} from "ecore";
import {createDefaultValue, getAllAttributes, getAttrCaption} from './utils'
import {DatePicker, Select, Input, InputNumber, Typography, Col, Divider, Row, Button} from "antd";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";

interface Props {
    entityType: EObject,
    data: any,
    updateData: (data: Object)=>void
}

class MasterdataForm extends React.Component<Props&WithTranslation, any> {

    renderJSONEditor(attributeType: EObject, data: any, updateData: (data: any)=>void) {
        return <Typography.Paragraph
            ellipsis={{ rows: 3, expandable: true }}
            editable={{ onChange: value => updateData(JSON.parse(value)) }}>
            {JSON.stringify(data)}
        </Typography.Paragraph>
    }

    renderArrayTypeEditor(elementType: EObject, data: any, updateData: (data: any)=>void) {
        const {t} = this.props
        data = data || []
        return (
            <React.Fragment>
                <Button title={t('add')} size={'small'} style={{color: 'rgb(151, 151, 151)', marginTop: '15px'}}
                        onClick={()=>{
                            updateData([...data, createDefaultValue(elementType)])
                        }}>
                    <FontAwesomeIcon icon={faPlus} size='sm' color="#7b7979"/>
                </Button>
                {data.map((e: any, i: number)=><Row key={i}>
                    <Col span={2}>
                        <Button title={t('delete')} size={'small'} style={{color: 'rgb(151, 151, 151)', marginTop: '15px'}}
                                onClick={()=>{
                                    updateData([...data.slice(0, i), ...data.slice(i + 1)])
                                }}>
                            <FontAwesomeIcon icon={faMinus} size='sm' color="#7b7979"/>
                        </Button>
                    </Col>
                    <Col span={22}>
                        {this.renderValueEditor(elementType, data[i], dataNew => {
                            updateData([...data.slice(0, i), update(data[i], {$merge: dataNew}), ...data.slice(i + 1)])
                        })}
                    </Col>
                </Row>)}
            </React.Fragment>
        )
    }
    renderPlainTypeEditor(attributeType: EObject, data: any, updateData: (data: any)=>void) {
        const typeName = attributeType.get('name') as string
        if (['INTEGER', 'LONG', 'FLOAT', 'DOUBLE', 'DECIMAL'].includes(typeName)) {
            return <InputNumber value={data} style={{width: '15em'}} onChange={value => updateData(value)}/>
        }
        if (typeName === 'STRING') {
            return <Input value={data} onChange={value => updateData(value.target.value)}/>
        }
        if (typeName === 'TEXT') {
            return <Input.TextArea rows={3} value={data} onChange={value => updateData(value.target.value)}/>
        }
        if (typeName === 'DATE') {
            return <DatePicker value={!data?null:moment(data, 'YYYY-MM-DD HH:mm:ss')} onChange={(value) => updateData(value?.format('YYYY-MM-DD HH:mm:ss'))} showTime={false}/>
        }
        if (typeName === 'DATETIME') {
            return <DatePicker value={!data?null:moment(data, 'YYYY-MM-DD HH:mm:ss')} onChange={(value) => updateData(value?.format('YYYY-MM-DD HH:mm:ss'))} showTime={true}/>
        }
        return this.renderJSONEditor(attributeType, data, updateData)
    }

    renderValueEditor(attributeType: EObject, data: any, updateData: (data: any)=>void) {
        if (attributeType.eClass.get('name') === 'PlainType') {
            return this.renderPlainTypeEditor(attributeType, data, updateData)
        }
        if (attributeType.eClass.get('name') === 'EnumType') {
            return <Select value={data} allowClear={true} onChange={(value: any) => updateData(value)}>
                {attributeType.get('values').map((value: EObject)=>
                    <Select.Option key={value.get('name')}>{value.get('name')}</Select.Option>
                )}
            </Select>
        }
        if (attributeType.eClass.get('name') === 'ArrayType') {
            return this.renderArrayTypeEditor(attributeType.get('elementType'), data, updateData)
        }
        if (attributeType.eClass.get('name') === 'DocumentType') {
            return <MasterdataForm {...this.props} entityType={attributeType} data={data} updateData={updateData}/>
        }
        return this.renderJSONEditor(attributeType, data, updateData)
    }

    render() {
        const {entityType, data, updateData} = this.props
        return (
            <React.Fragment>
                {entityType.eClass.get('name') === 'EntityType' &&
                <Divider orientation="left">{entityType.get('caption') || entityType.get('name')}</Divider>}
                {data['@rid'] && <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={4}><Typography.Text strong={true}>{'@rid'}</Typography.Text></Col>
                    <Col span={20}>{data['@rid']}</Col>
                </Row>}
                {getAllAttributes(entityType).map(attr=>
                    <Row style={{marginTop: '5px'}} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} key={attr.get('name')}>
                        <Col span={4}><Typography.Text strong={true}>{getAttrCaption(attr)}</Typography.Text></Col>
                        <Col span={20}>{this.renderValueEditor(attr.get('attributeType'), data[attr.get('name') as string], (data: any)=>{
                            updateData({[attr.get('name')]: data})
                        })}</Col>
                    </Row>
                )}
            </React.Fragment>
        )
    }
}

export default withTranslation()(MasterdataForm)
