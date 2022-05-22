import React from 'react';
import { OrderList } from 'primereact/orderlist';
import { Tag } from 'primereact/tag';

const itemTemplate = (issue) => (
  <div>
    <div>
      <img width={16} height={16} src={issue.fields.issuetype.iconUrl} alt={`L'image du ticket JIRA`} />
      {`[${issue.key}] ${issue.fields.summary}`}
    </div>
    {issue.fields.labels.map(label => <Tag color="geekblue">{label}</Tag>)}
  </div>
);

const IssuesList = ({ issues, onRowClick }) => {
    return (<>
      <OrderList value={issues} itemTemplate={itemTemplate} header="Issues" onChange={onRowClick} />
      </>)
};

export default IssuesList;
