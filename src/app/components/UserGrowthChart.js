import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import dayjs from 'dayjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserGrowthChart = ({ users }) => {
    const [dailyData, setDailyData] = useState({ labels: [], data: [] });

    useEffect(() => {
        if (!users || users.length === 0) return;

        // Group users by day (YYYY-MM-DD)
        const grouped = {};
        users.forEach(user => {
            const day = dayjs(user.createdAt).format('YYYY-MM-DD');
            grouped[day] = (grouped[day] || 0) + 1;
        });

        const labels = Object.keys(grouped).sort();
        const data = labels.map(label => grouped[label]);

        setDailyData({ labels, data });
    }, [users]);

    const chartData = {
        labels: dailyData.labels,
        datasets: [
            {
                label: 'New Users per Day',
                data: dailyData.data,
                backgroundColor: '#fe8062',
                borderRadius: 6,
                barThickness: 20,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'User Growth by Day',
            },
        },
        scales: {
            x: {
                title: { display: true, text: 'Date' },
                ticks: {
                    color: '#444',
                    autoSkip: true,
                    maxTicksLimit: 10, // Show fewer ticks for better readability
                },
            },
            y: {
                title: { display: true, text: 'Users' },
                ticks: { color: '#444' },
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{ width: '70%',margin:'auto', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <Bar data={chartData} options={chartOptions} />
        </div>

    );
};

export default UserGrowthChart;
