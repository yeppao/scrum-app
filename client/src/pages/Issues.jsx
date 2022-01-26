import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import _, { filter } from 'lodash';
import { Button } from 'primereact/button';
import { AppContext } from '@context/AppContext';
import { getEpics, getSprintIssues, getSprint } from '@repositories/projects';
import IssuesList from '@components/IssuesList';
import { SprintContext } from '@context/SprintContext';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { OrganizationChart } from '@components/OrganizationChart';
import * as d3 from 'd3';

const nodeTemplate = node => {
  if (node.type === 'epic') {
    return (
      <div>
        {node.label} - {node.data.name}
      </div>
    )
  }

  if (node.type === 'issue') {
    return (
      <div>
        <div>
          <img src={node.data.fields.issuetype.iconUrl} alt="Issue icon" />
          {node.label} - {node.data.fields.summary}
        </div>
        <Tag value={node.data.fields.status.name}></Tag>
      </div>
    )
  }

  return (<div>{node.label}</div>)
}

const Issues = () => {
  const { sprintId: currentSprintId } = useParams();
  const { setStep } = useContext(AppContext);
  const { issues, setIssues, sprintId, boardId } = useContext(SprintContext);
  const [sprints] = useState([]);
  const [orgIssues, setOrgIssues] = useState([]);
  const [data, setData] = useState(null);
  let addNodeChildFunc = null;

  function addNode() {
    const node = {
      nodeId: 'new Node',
      parentNodeId: 'O-6066'
    };

    addNodeChildFunc(node);
  }

  function onNodeClick(nodeId) {
    alert('clicked ' + nodeId);
  }

  useEffect(() => {
    d3.csv(
      'https://raw.githubusercontent.com/bumbeishvili/sample-data/main/org.csv'
    ).then(data => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    setStep(0);

    const handleSprintChange = async () => {
      const currentSprint = await getSprint(sprintId);
      const issues = await getSprintIssues(boardId, sprintId);
      const epics = await getEpics(boardId);
      let issuesWithoutParent = issues;
      const secondLevel = epics
        .filter(epic => _.find(issues, issue => issue.fields && issue.fields.epic && issue.fields.epic.id === epic.id))
        .map(epic => {
          const filteredIssues = issues
            .filter(issue => issue.fields && issue.fields.epic && issue.fields.epic.id === epic.id);

          issuesWithoutParent = _.difference(issuesWithoutParent, filteredIssues);

          return {
            label: epic.key,
            type: 'epic',
            data: epic,
            expanded: true,
            children: filteredIssues
              .map(issue => ({ label: issue.key, type: 'issue', data: issue }))
          };
        });

      issuesWithoutParent.forEach(issue => {
        if (issue.fields.issuetype.subtask === false) secondLevel.push({ label: issue.key, type: 'issue', data: issue });
      });

      const sprintHierarchy = [{
        label: currentSprint.name,
        type: 'sprint',
        expanded: true,
        children: secondLevel
      }];

      setIssues(issues);
      setOrgIssues([
        { nodeId: 'sprint', data: { type: 'sprint', label: currentSprint.name }},
        ...epics.map(epic => ({ nodeId: epic.id, parentNodeId: 'sprint', data: { type: 'epic', ...epic } })),
        ...issues.map(issue => ({
          nodeId: issue.id,
          parentNodeId: issue.fields.epic && _.find(epics, epic => epic.id === issue.fields.epic.id) ? issue?.fields?.epic?.id : 'sprint',
          data: { type: 'issue', ...issue }
        })),
      ]);
    }

    handleSprintChange();
  }, [boardId, setIssues, setStep, sprintId, sprints]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh' }}>
      {
      /*orgIssues.length && <OrganizationChart
        value={orgIssues}
        nodeTemplate={nodeTemplate}
      ></OrganizationChart>*/
      orgIssues.length && <OrganizationChart
        setClick={click => (addNodeChildFunc = click)}
        onNodeClick={onNodeClick}
        data={orgIssues}
      />
      }
      {/*<IssuesList issues={issues} />*/}
    </div>
  );
}

export default Issues;
