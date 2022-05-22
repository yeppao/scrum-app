import { BackwardOutlined } from '@ant-design/icons';
import { Button } from 'primereact/button';
import React from 'react';
import { useNavigate } from 'react-router-dom';
export default function Default() {
    const navigate = useNavigate()
    const redirect = () => navigate('/');
    return (
        <Button onClick={redirect}>
            <BackwardOutlined /> You're lost. Go home.
        </Button>
    )
}
