import React from 'react';

const List = () => {
    return (
        <Form.List name="users">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Form.Item
                                {...restField}
                                name={[name, 'groupLabel']}
                                fieldKey={[fieldKey, 'groupLabel']}
                                rules={[{ required: true, message: 'Missing first name' }]}
                            >
                                <Input placeholder="First Name" />
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name, 'last']}
                                fieldKey={[fieldKey, 'last']}
                                rules={[{ required: true, message: 'Missing last name' }]}
                            >
                                <Input placeholder="Last Name" />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                    ))}
                    <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add field
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
    )
}
