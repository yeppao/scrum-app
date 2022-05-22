import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '@context/AppContext';
import { useParams } from 'react-router';
import { getGroup } from '@repositories/groups';
import IssuesList from '@components/IssuesList';
import { ADFEncoder, ReactRenderer } from '@atlaskit/renderer';
import WikiMarkupTransformer from '@atlaskit/editor-wikimarkup-transformer';
import { Editor } from '@atlaskit/editor-core';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';


const Work = () => {
    const { groupId } = useParams();
    const { currentUser } = useContext(AppContext);
    const [group, setGroup] = useState(null);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [description, setDescription] = useState(null);

    const refreshCall = useCallback(() => {
        async function getGroupData() {
            const group = await getGroup(groupId);
            setGroup(group);
        }

        getGroupData(groupId);
    }, [groupId, setGroup]);

    useEffect(() => {
        async function getGroupData() {
            const group = await getGroup(groupId);
            setGroup(group);
        }

        getGroupData(groupId);
    }, [groupId, setGroup]);

    const onRowClick = val => {
        console.log('rowClick val', val);
        setSelectedIssue(val);
        const adfEncoder = new ADFEncoder(
            schema => new WikiMarkupTransformer(schema)
        );
        const doc = adfEncoder.encode(val.fields.description);
        setDescription(doc);
    }

    const onFinish = (values) => {
        console.log('form values');
    }

    return (
        <div>
                <div>
                    <h1>Participants</h1>
                    <div>
                        {group && group?.users?.map(user => <div><i className="pi pi-check" style={{'color': 'green'}}></i> {user.name}</div>)}
                    </div>
                    <Button onClick={refreshCall}>Refresh</Button>
                </div>
                <pre>{JSON.stringify(group)}</pre>
                <div style={{ height: '420px', overflow: 'scroll' }}>
                    <IssuesList
                        issues={group?.issues}
                        onRowClick={onRowClick}
                    />
                </div>
                {selectedIssue &&
                <div>
                    <h3>[{selectedIssue.key}] {selectedIssue.summary}</h3>
                    <div>
                        <ReactRenderer document={description} />
                    </div>
                    <InputText placeholder="Subtask title" />
                    <Dropdown options={['front', 'back']} />
                        <Editor />
                    <Button type="primary">
                    Submit
                    </Button>
                </div>
                }
        </div>
    );
}

export default Work;
