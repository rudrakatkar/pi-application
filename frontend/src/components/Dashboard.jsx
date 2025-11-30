import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await api.get('/files');
            setFiles(response.data);
        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                handleLogout();
            }
            console.error('Failed to fetch files', err);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            await api.post('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchFiles();
        } catch (err) {
            console.error('Upload failed', err);
            alert('Upload failed');
        } finally {
            setUploading(false);
            // Reset file input
            e.target.value = null;
        }
    };

    const handleDownload = async (filename) => {
        try {
            const response = await api.get(`/files/download/${filename}`, {
                responseType: 'blob',
            });

            // Create a blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed', err);
            alert('Download failed');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="container">
            <div className="dashboard-header">
                <h1>My Cloud</h1>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <div className="upload-section">
                <input
                    type="file"
                    id="file-upload"
                    style={{ display: 'none' }}
                    onChange={handleUpload}
                    disabled={uploading}
                />
                <label htmlFor="file-upload" className="button" style={{
                    backgroundColor: 'var(--accent-color)',
                    color: '#000',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'inline-block'
                }}>
                    {uploading ? 'Uploading...' : 'Upload File'}
                </label>
            </div>

            <div className="file-grid">
                {files.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No files found. Upload one to get started!</p>
                ) : (
                    files.map((file, index) => (
                        <div key={index} className="file-card" onClick={() => handleDownload(file)}>
                            <div className="file-icon">📄</div>
                            <div className="file-name">{file}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
