import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

function sanitizeIssues(issues) {
    if (!Array.isArray(issues)) return [];
    return issues.filter((item) => (
        item
        && Number.isFinite(Number(item.latitude))
        && Number.isFinite(Number(item.longitude))
    ));
}

function statusClass(issue) {
    const status = String(issue?.display_status || issue?.progress_status || issue?.status || 'Pending').toLowerCase();
    if (status.includes('resolved')) return 'resolved';
    if (status.includes('progress')) return 'in-progress';
    return 'pending';
}

function markerIcon(issue) {
    const s = statusClass(issue);
    const color = s === 'resolved' ? '#10b981' : s === 'in-progress' ? '#f59e0b' : '#ef4444';
    return L.divIcon({
        className: 'nearby-issue-marker-wrapper',
        html: `<span style="display:inline-block;width:16px;height:16px;border-radius:50%;background-color:${color};border:2px solid #ffffff;box-shadow:0 0 6px rgba(0,0,0,0.4);"></span>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -12],
    });
}

export default function NearbyIssueClusterLayer({ issues, onViewDetails }) {
    const map = useMap();

    useEffect(() => {
        const safeIssues = sanitizeIssues(issues);
        const group = L.layerGroup();

        safeIssues.forEach((issue) => {
            const marker = L.marker(
                [Number(issue.latitude), Number(issue.longitude)],
                { icon: markerIcon(issue), title: issue.title || issue.description || 'Water Leakage' }
            );

            const popupNode = document.createElement('div');
            popupNode.className = 'nearby-popup-card';
            popupNode.style.padding = '8px';
            popupNode.style.fontSize = '13px';
            popupNode.innerHTML = `
                <div style="font-weight:700;margin-bottom:4px;color:#0f172a;">${issue.title || issue.description || 'Water Leakage'}</div>
                <div style="margin-bottom:6px;font-size:12px;color:#475569;">
                    <span>${issue.institution || issue.ward || 'Mumbai'}</span> • 
                    <span style="font-weight:600;">${issue.status || 'Open'}</span>
                </div>
            `;

            if (onViewDetails) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'btn btn-primary-filled';
                button.style.padding = '4px 10px';
                button.style.fontSize = '12px';
                button.textContent = 'View Details';
                button.addEventListener('click', () => onViewDetails?.(issue));
                popupNode.appendChild(button);
            }

            marker.bindPopup(popupNode, { maxWidth: 280 });
            group.addLayer(marker);
        });

        map.addLayer(group);
        return () => {
            map.removeLayer(group);
        };
    }, [issues, map, onViewDetails]);

    return null;
}
