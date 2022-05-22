import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { AppContext } from '@context/AppContext';
import { getProjects, getSprints, getSprintIssues } from '@repositories/projects';
import { createTeamSession } from '@repositories/teamSession';
import IssuesList from '@components/IssuesList';
import { SprintContext } from '@context/SprintContext';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';


const Chat = () => {
  const { setStep, setTeamSession } = useContext(AppContext);
  const { boardId, sprintId, setSprintId, setBoardId } = useContext(SprintContext);
  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => setStep(0), [setStep]);
  useEffect(() => {
    async function retrieveProjects() {
      const projs = await getProjects();
      setProjects(projs);
    }

    retrieveProjects();
  }, [setProjects]);

  const handleSprintChange = useCallback(async (selectedValue) => {
    console.log(selectedValue);
    console.log(sprints);
    const sprint = _.find(sprints, sprint => sprint.id === selectedValue);
    console.log(sprint);
    setBoardId(sprint.originBoardId);
    setSprintId(sprint.id);
  }, [setBoardId, setSprintId, sprints]);

  const handleProjectChange = useCallback(async (projectKey) => {
    const sprints = await getSprints(projectKey);
    const activeSprint = _.find(sprints, sprint => sprint.state === 'active');
    console.log('sp', sprints, activeSprint);
    setSprints(sprints);
    setSprintId(activeSprint.id);
    setBoardId(activeSprint.originBoardId);
  }, [setSprints, setSprintId, setBoardId]);

  const submitSelectedIssues = async () => {
    /*const teamSession = {
      boardId,
      sprintId,
      currentStep: 1
    };
    const selectedIssues = issues.map(issue => ({
      key: issue.key,
      summary: issue.fields.summary,
      fields: issue.fields
    }));

    const teamSessionObj = await createTeamSession(teamSession, selectedIssues);
    console.log(teamSessionObj);
    if (teamSessionObj.id) {
      setTeamSession(teamSessionObj);
      navigate('/groups');
    }*/

    navigate(`/issues/${sprintId}`);
  }

  return (
    <div>
        {sprints.length > 0 && (
        <div>
          {JSON.stringify(sprintId)}
            <Dropdown
            options={sprints}
              style={{ width: 320 }}
              onChange={handleSprintChange}
              value={sprintId}
              optionLabel="name"
              optionValue="id"
            />
            <Button type="primary" onClick={submitSelectedIssues}>Enregistrer</Button>
        </div>
        )}
      <div>
        {projects.map(project => (
          <Card
            style={{ cursor: 'pointer' }}
            onClick={() => handleProjectChange(project.key)}
          >
            <img width={48} height={48} src={project.avatarUrls['48x48']} alt={`Le logo du projet ${project.name}`} /> {project.name}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Chat;
