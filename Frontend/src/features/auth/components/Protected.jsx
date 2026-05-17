import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router';

const Protected = ({children}) => {

    const user = useSelector(state => state.auth.user);
    const loading = useSelector(state => state.auth.loading);
    const initialized = useSelector(state => state.auth.initialized);

    if (loading || !initialized) {
        return (
            <div style={{
                width: '100%',
                height: '100vh',
                background: '#0d0d0d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{
                    width: 28,
                    height: 28,
                    border: '2px solid rgba(255,255,255,0.1)',
                    borderTop: '2px solid #f33939',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if(!user) {
        return <Navigate to="/login" replace />
    }

    return children;
}

export default Protected
