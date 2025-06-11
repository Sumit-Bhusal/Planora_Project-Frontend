import React, { useState } from 'react';
import { Download, FileText, BarChart3, Users, DollarSign, Calendar, Filter, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';

interface ReportExporterProps {
  eventId?: string;
  eventTitle?: string;
  onClose: () => void;
}

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  formats: string[];
  estimatedTime: string;
}

const ReportExporter: React.FC<ReportExporterProps> = ({ eventId, eventTitle, onClose }) => {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y' | 'custom'>('30d');
  const [isExporting, setIsExporting] = useState(false);

  const reportTypes: ReportType[] = [
    {
      id: 'analytics',
      name: 'Event Analytics Report',
      description: 'Comprehensive analytics including registrations, revenue, and trends',
      icon: BarChart3,
      formats: ['PDF', 'Excel', 'CSV'],
      estimatedTime: '2-3 minutes'
    },
    {
      id: 'attendees',
      name: 'Attendee List',
      description: 'Complete list of registered attendees with contact information',
      icon: Users,
      formats: ['Excel', 'CSV', 'PDF'],
      estimatedTime: '1-2 minutes'
    },
    {
      id: 'financial',
      name: 'Financial Report',
      description: 'Revenue, expenses, and profit analysis',
      icon: DollarSign,
      formats: ['Excel', 'PDF'],
      estimatedTime: '2-3 minutes'
    },
    {
      id: 'registration',
      name: 'Registration Trends',
      description: 'Registration patterns and conversion rates over time',
      icon: Calendar,
      formats: ['Excel', 'CSV', 'PDF'],
      estimatedTime: '1-2 minutes'
    },
    {
      id: 'summary',
      name: 'Event Summary Report',
      description: 'High-level overview of event performance and key metrics',
      icon: FileText,
      formats: ['PDF', 'Excel'],
      estimatedTime: '1 minute'
    }
  ];

  const selectedReportData = reportTypes.find(r => r.id === selectedReport);

  const handleExport = async () => {
    if (!selectedReport || !selectedFormat) return;

    setIsExporting(true);

    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock export functionality
    const fileName = `${eventTitle || 'Event'}_${selectedReport}_${new Date().toISOString().split('T')[0]}.${selectedFormat.toLowerCase()}`;
    
    // Create mock content based on report type
    let content = '';
    let mimeType = '';
    
    switch (selectedFormat) {
      case 'CSV':
        mimeType = 'text/csv';
        content = 'Name,Value,Date\nSample Data,100,2024-01-01\n';
        break;
      case 'Excel':
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        content = 'Mock Excel content';
        break;
      case 'PDF':
        mimeType = 'application/pdf';
        content = 'Mock PDF content';
        break;
      default:
        mimeType = 'text/plain';
        content = 'Mock content';
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);

    setIsExporting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Export Reports</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {eventTitle ? `Generate reports for "${eventTitle}"` : 'Generate comprehensive event reports'}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Close
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Report Type Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Select Report Type</h3>
            <div className="grid grid-cols-1 gap-3">
              {reportTypes.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedReport === report.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      selectedReport === report.id
                        ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      <report.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{report.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{report.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <Download className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {report.formats.join(', ')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {report.estimatedTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    {selectedReport === report.id && (
                      <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          {selectedReport && (
            <div className="space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Export Options</h3>
                
                {/* Format Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Export Format
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedReportData?.formats.map((format) => (
                      <button
                        key={format}
                        onClick={() => setSelectedFormat(format)}
                        className={`p-3 border-2 rounded-lg text-center transition-all ${
                          selectedFormat === format
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="font-medium">{format}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {format === 'PDF' ? 'Best for printing' : format === 'Excel' ? 'Best for analysis' : 'Best for data'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                    <option value="custom">Custom range</option>
                  </select>
                </div>

                {/* Export Button */}
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>Report will be generated and downloaded automatically</span>
                  </div>
                  <Button
                    onClick={handleExport}
                    disabled={!selectedFormat || isExporting}
                    loading={isExporting}
                    icon={Download}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    {isExporting ? 'Generating...' : 'Export Report'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ReportExporter; 