import { INITIAL_LEAKAGES } from '../data/leakages.js';
import { ANNOUNCEMENTS } from '../data/announcements.js';
import { MAINTENANCE_TEAMS } from '../data/maintenanceTeams.js';
import { MUMBAI_WARDS, MUMBAI_COLLEGES, MUMBAI_RESIDENTIAL_SOCIETIES, LEAKAGE_CATEGORIES } from '../data/wards.js';
import { ANALYTICS_DATA } from '../data/analytics.js';

const STORAGE_KEY = 'mumbai_waterwatch_reports';
const LISTENERS = new Set();

function notifyListeners() {
    LISTENERS.forEach((callback) => {
        try {
            callback();
        } catch (e) {
            console.error('Error in listener callback', e);
        }
    });
}

export function subscribeToWaterWatch(callback) {
    LISTENERS.add(callback);
    return () => LISTENERS.delete(callback);
}

export function getStoredReports() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn('Failed to parse stored reports', e);
    }
    // Default fallback
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEAKAGES));
    } catch (e) { }
    return [...INITIAL_LEAKAGES];
}

export function saveStoredReports(reports) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
        console.warn('Failed to persist reports to localStorage', e);
    }
    notifyListeners();
}

export function getReportById(id) {
    const list = getStoredReports();
    return list.find((item) => String(item.id) === String(id)) || null;
}

export function addReport(formData) {
    const list = getStoredReports();
    const nextNum = 1000 + list.length + 1;
    const reportId = `WW-MUM-2026-${nextNum}`;

    const severityLitersPerHourMap = {
        Low: 15,
        Medium: 45,
        High: 90,
        Critical: 250,
    };

    const rate = severityLitersPerHourMap[formData.severity] || 40;

    const newReport = {
        id: reportId,
        title: formData.title || 'Water Leakage Report',
        description: formData.description || '',
        environment: formData.environment || 'College',
        institution: formData.institution || 'Mumbai Institution',
        location: formData.location || 'Building Floor / Washroom',
        ward: formData.ward || 'Ward F/N',
        category: formData.category || 'Washroom Tap Leakage',
        severity: formData.severity || 'Medium',
        status: 'Open',
        estimatedLitersPerHour: rate,
        estimatedLitersLost: Math.round(rate * 2),
        estimatedWaterSavedLiters: 0,
        coordinates: formData.coordinates || [19.076, 72.8777],
        reportedBy: formData.reportedBy || 'Citizen / Campus Reporter',
        reportedAt: new Date().toISOString(),
        assignedTeam: 'MCGM Rapid Plumbing Cell (Unassigned)',
        assignedAt: null,
        resolvedAt: null,
        upvotes: 1,
        image_url: formData.image_url || 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800&auto=format&fit=crop',
        fixed_image_url: null,
        timeline: [
            {
                status: 'Open',
                date: new Date().toISOString(),
                note: formData.initialNote || 'Report submitted by citizen with location and evidence.',
                updatedBy: formData.reportedBy || 'Citizen Reporter',
            },
        ],
    };

    const updated = [newReport, ...list];
    saveStoredReports(updated);
    return newReport;
}

export function updateReportStatus(reportId, newStatus, note = '', fixedImageUrl = null, assignedTeam = null) {
    const list = getStoredReports();
    const index = list.findIndex((r) => String(r.id) === String(reportId));
    if (index === -1) return null;

    const report = { ...list[index] };
    const prevStatus = report.status;
    report.status = newStatus;

    if (assignedTeam) {
        report.assignedTeam = assignedTeam;
        if (!report.assignedAt) report.assignedAt = new Date().toISOString();
    }

    if (fixedImageUrl) {
        report.fixed_image_url = fixedImageUrl;
    }

    if (newStatus === 'Resolved' && !report.resolvedAt) {
        report.resolvedAt = new Date().toISOString();
        if (!report.estimatedWaterSavedLiters || report.estimatedWaterSavedLiters === 0) {
            report.estimatedWaterSavedLiters = Math.round(report.estimatedLitersPerHour * 24);
        }
    }

    const timelineEntry = {
        status: newStatus,
        date: new Date().toISOString(),
        note: note || `Status updated from ${prevStatus} to ${newStatus}.`,
        updatedBy: 'Authority Maintenance Supervisor',
    };

    report.timeline = [...(report.timeline || []), timelineEntry];

    list[index] = report;
    saveStoredReports(list);
    return report;
}

export function assignMaintenanceTeam(reportId, teamName, note = '') {
    const list = getStoredReports();
    const index = list.findIndex((r) => String(r.id) === String(reportId));
    if (index === -1) return null;

    const report = { ...list[index] };
    report.assignedTeam = teamName;
    report.assignedAt = new Date().toISOString();

    if (report.status === 'Open') {
        report.status = 'In Progress';
    }

    report.timeline = [
        ...(report.timeline || []),
        {
            status: report.status,
            date: new Date().toISOString(),
            note: note || `Assigned to maintenance squad: ${teamName}`,
            updatedBy: 'Authority Operations Lead',
        },
    ];

    list[index] = report;
    saveStoredReports(list);
    return report;
}

export function upvoteReport(reportId) {
    const list = getStoredReports();
    const index = list.findIndex((r) => String(r.id) === String(reportId));
    if (index === -1) return null;

    const report = { ...list[index] };
    report.upvotes = (report.upvotes || 0) + 1;
    list[index] = report;
    saveStoredReports(list);
    return report;
}

export function getWaterWatchStats() {
    const list = getStoredReports();

    const total = list.length;
    const open = list.filter((r) => r.status === 'Open').length;
    const underReview = list.filter((r) => r.status === 'Under Review').length;
    const inProgress = list.filter((r) => r.status === 'In Progress').length;
    const resolved = list.filter((r) => r.status === 'Resolved').length;

    const pending = open + underReview;
    const critical = list.filter((r) => (r.status !== 'Resolved' && r.severity === 'Critical')).length;

    const totalWastage = list.reduce((sum, r) => sum + (Number(r.estimatedLitersLost) || 0), 0);
    const totalSaved = list.reduce((sum, r) => sum + (Number(r.estimatedWaterSavedLiters) || 0), 0);

    const collegesCount = list.filter((r) => r.environment === 'College').length;
    const residentialCount = list.filter((r) => r.environment === 'Residential').length;

    return {
        totalReports: total,
        pendingRepairs: pending,
        leaksUnderRepair: inProgress,
        resolvedLeaks: resolved,
        criticalLeaks: critical,
        estimatedWaterWastageLiters: totalWastage,
        estimatedWaterSavedLiters: totalSaved,
        tankerEquivalentSaved: Math.round(totalSaved / 400),
        collegesCount,
        residentialCount,
    };
}

export function resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    saveStoredReports(INITIAL_LEAKAGES);
}

export {
    ANNOUNCEMENTS,
    MAINTENANCE_TEAMS,
    MUMBAI_WARDS,
    MUMBAI_COLLEGES,
    MUMBAI_RESIDENTIAL_SOCIETIES,
    LEAKAGE_CATEGORIES,
    ANALYTICS_DATA,
};

