import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HowToUse = () => {
    const [videos, setVideos] = useState([
        { title: "How to Register", url: "/demo-videos/register.mp4" },
        { title: "How to Fill Enquiry Form", url: "/demo-videos/enquiry.mp4" },
        { title: "How to Choose Course", url: "/demo-videos/course.mp4" },
        { title: "How to Submit Admission", url: "/demo-videos/admission.mp4" }
    ]);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadTitle, setUploadTitle] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Simple check for admin - in real app, verify from token/context
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role === 'admin') {
            setIsAdmin(true);
        }
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/videos');
            if (res.data && res.data.length > 0) {
                setVideos(prev => [...prev, ...res.data]);
            }
        } catch (err) {
            console.log("No custom videos found or error fetching");
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile || !uploadTitle) return;

        const formData = new FormData();
        formData.append('video', uploadFile);
        formData.append('title', uploadTitle);

        try {
            await axios.post('http://localhost:5000/api/upload-video', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Video uploaded successfully!');
            setUploadFile(null);
            setUploadTitle("");
            fetchVideos(); // Refresh list
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">How to Use the System</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {videos.map((vid, idx) => (
                    <div key={idx} className="bg-white p-4 rounded shadow-lg">
                        <h3 className="text-xl font-semibold mb-2">{vid.title}</h3>
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
                            {/* Placeholder message if video missing */}
                            <video
                                controls
                                className="w-full rounded"
                                src={vid.url.startsWith('http') ? vid.url : `http://localhost:5000${vid.url}`}
                                onError={(e) => e.target.parentElement.innerHTML = '<div class="p-10 text-gray-500">Video Placeholder (File not found)</div>'}
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                ))}
            </div>

            {isAdmin && (
                <div className="mt-12 bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-400">
                    <h2 className="text-2xl font-bold mb-4">Admin: Upload New Demo Video</h2>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Video Title</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={uploadTitle}
                                onChange={e => setUploadTitle(e.target.value)}
                                placeholder="e.g., New Feature Walkthrough"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select MP4 File</label>
                            <input
                                type="file"
                                accept="video/mp4"
                                onChange={e => setUploadFile(e.target.files[0])}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                            Upload Video
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default HowToUse;
