import { Button } from 'primereact/button';
import { PhoneFilled, VideoCameraFilled } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const getHeaderProps = ({ audioLaunched, videoLaunched, pathname }) => {
  const toggleAudio = () => console.log('audio');
  const toggleCamera = () => console.log('camera');
  let headerProps = {};

  switch (pathname) {
    case '/chat':
      headerProps = {
        title: 'Title',
        extra: [
          <Button
            type="primary"
            shape="round"
            icon={<PhoneFilled />}
            onClick={toggleAudio}
            danger={audioLaunched}
            key="1"
          />,
          <Button
            type="primary"
            shape="round"
            icon={<VideoCameraFilled />}
            onClick={toggleCamera}
            danger={videoLaunched}
            key="2"
          />
        ]
      };
      break;
    default:
      headerProps = {
        title: 'Title',
        extra: [
          <Button key="3">Operation</Button>,
          <Button key="2">Operation</Button>,
          <Button key="1" type="primary">
            Primary
          </Button>
        ]
      };
  }

  return headerProps;
}

const PageHeader = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const audioLaunched = false;
  const videoLaunched = false;
  const headerProps = getHeaderProps({ audioLaunched, videoLaunched, pathname: location.pathname });
  return (
    <div
      className="site-page-header-responsive"
    >
    </div>
  );
}

export default PageHeader;
