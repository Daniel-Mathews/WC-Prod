import React from 'react';

const Loading = () => {
    return (
        <div style={styles.container}>
            <div style={styles.spinner}></div>
            <p style={styles.text}>Loading...</p>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '5px solid #ccc',
        borderTop: '5px solid #007bff',
        borderRadius: '50%',
    },
    text: {
        marginTop: '20px',
        fontSize: '18px',
        color: '#333',
    },
};

export default Loading;
