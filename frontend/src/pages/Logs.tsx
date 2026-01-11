import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

interface LogEntry {
    id: string;
    timestamp: string;
    level: 'info' | 'warning' | 'error' | 'success';
    category: 'data_ingestion' | 'model_inference' | 'system' | 'user_action';
    message: string;
    details?: string;
}

const mockLogs: LogEntry[] = [
    {
        id: 'log-1',
        timestamp: '2025-01-11 14:45:22',
        level: 'success',
        category: 'data_ingestion',
        message: 'National summary data refreshed',
        details: 'Fetched 69 records from backend API'
    },
    {
        id: 'log-2',
        timestamp: '2025-01-11 14:45:22',
        level: 'success',
        category: 'model_inference',
        message: 'Risk scores updated for all districts',
        details: 'Model v2.4 execution time: 1.2s'
    },
    {
        id: 'log-3',
        timestamp: '2025-01-11 14:42:10',
        level: 'info',
        category: 'user_action',
        message: 'Map view filtered by "High Risk"',
        details: 'User selection'
    },
    {
        id: 'log-4',
        timestamp: '2025-01-11 14:38:05',
        level: 'warning',
        category: 'data_ingestion',
        message: 'Latency detected in fetching temporal trends',
        details: 'Response time > 500ms (523ms)'
    },
    {
        id: 'log-5',
        timestamp: '2025-01-11 14:30:00',
        level: 'info',
        category: 'system',
        message: 'Scheduled maintenance check completed',
        details: 'All systems operational'
    },
    {
        id: 'log-6',
        timestamp: '2025-01-11 14:15:00',
        level: 'info',
        category: 'data_ingestion',
        message: 'Batch import completed: WB_Districts',
        details: '23 records updated'
    },
    {
        id: 'log-7',
        timestamp: '2025-01-11 14:00:00',
        level: 'success',
        category: 'model_inference',
        message: 'Anomaly detection model retrained',
        details: 'Accuracy improved by 0.4%'
    },
    {
        id: 'log-8',
        timestamp: '2025-01-11 13:45:00',
        level: 'error',
        category: 'data_ingestion',
        message: 'Failed to connect to external UIDAI gateway',
        details: 'Connection timeout - Retrying in 5m'
    }
];

const getLevelBadge = (level: LogEntry['level']) => {
    switch (level) {
        case 'success': return <Badge className="bg-green-500/15 text-green-700 hover:bg-green-500/25 border-green-200">Success</Badge>;
        case 'warning': return <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 border-amber-200">Warning</Badge>;
        case 'error': return <Badge className="bg-red-500/15 text-red-700 hover:bg-red-500/25 border-red-200">Error</Badge>;
        case 'info': return <Badge className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 border-blue-200">Op</Badge>;
    }
};

const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
        case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
        case 'warning': return <ExclamationCircleIcon className="w-5 h-5 text-amber-600" />;
        case 'error': return <ExclamationCircleIcon className="w-5 h-5 text-red-600" />;
        case 'info': return <InformationCircleIcon className="w-5 h-5 text-blue-600" />;
    }
};

const Logs = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6 h-full flex flex-col">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">System Logs</h1>
                        <p className="text-sm text-muted-foreground mt-1">Real-time data processing and system events</p>
                    </div>
                    <Badge variant="outline" className="px-3 py-1 gap-1.5 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Live
                    </Badge>
                </div>

                <Card className="flex-1 border-border/50 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
                    <CardHeader className="border-b border-border/50 py-4 px-6 bg-muted/20">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <ClockIcon className="w-5 h-5 text-muted-foreground" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-hidden">
                        <ScrollArea className="h-full w-full">
                            <div className="divide-y divide-border/50">
                                {mockLogs.map((log) => (
                                    <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors duration-200">
                                        <div className="mt-0.5 flex-shrink-0">
                                            {getLevelIcon(log.level)}
                                        </div>
                                        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4">
                                            <div className="md:col-span-3 flex flex-col">
                                                <span className="text-sm font-medium text-foreground">{log.category.replace('_', ' ').toUpperCase()}</span>
                                                <span className="text-xs text-muted-foreground font-mono mt-1">{log.timestamp}</span>
                                            </div>
                                            <div className="md:col-span-7">
                                                <p className="text-sm text-foreground font-medium">{log.message}</p>
                                                {log.details && (
                                                    <p className="text-xs text-muted-foreground mt-1 font-mono">{log.details}</p>
                                                )}
                                            </div>
                                            <div className="md:col-span-2 flex items-center justify-end">
                                                {getLevelBadge(log.level)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Logs;
