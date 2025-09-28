import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Check, 
  FileCode, 
  Package, 
  Download,
  ExternalLink,
  Code
} from 'lucide-react';

export function ComponentUsageGuide() {
  const [copiedText, setCopiedText] = useState<string>('');

  const copyToClipboard = async (text: string, identifier: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(identifier);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const components = [
    {
      name: 'Scenario Simulation',
      files: ['ScenarioSimulation.tsx', 'SimulationSetup.tsx', 'SimulationResults.tsx'],
      description: 'Interactive simulation runner with setup wizard and results viewer',
      importCode: `import { ScenarioSimulation } from './components/ScenarioSimulation';`,
      usageCode: `<ScenarioSimulation />`,
      features: ['Progress tracking', 'Multiple scenarios', 'Real-time results', 'Configuration wizard']
    },
    {
      name: 'Disruption Management',
      files: ['DisruptionManagement.tsx', 'DisruptionCard.tsx'],
      description: 'Incident tracking and management system',
      importCode: `import { DisruptionManagement } from './components/DisruptionManagement';`,
      usageCode: `<DisruptionManagement />`,
      features: ['Active incident list', 'Severity levels', 'Response actions', 'Timeline tracking']
    },
    {
      name: 'Audit Trail',
      files: ['AuditTrail.tsx'],
      description: 'System activity logging and history viewer',
      importCode: `import { AuditTrail } from './components/AuditTrail';`,
      usageCode: `<AuditTrail />`,
      features: ['Activity logging', 'Filter & search', 'Export capabilities', 'User tracking']
    }
  ];

  const installationCode = `# Install required dependencies
npm install lucide-react

# If using TypeScript (recommended)
npm install @types/react @types/react-dom`;

  const setupCode = `// 1. Copy component files to your project
// 2. Ensure you have these UI components installed:
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// 3. Import and use the components
import { ScenarioSimulation } from './components/ScenarioSimulation';
import { DisruptionManagement } from './components/DisruptionManagement';
import { AuditTrail } from './components/AuditTrail';

// 4. Use in your app
function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ScenarioSimulation />
      <DisruptionManagement />
      <AuditTrail />
    </div>
  );
}`;

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
          <Code className="w-5 h-5" />
          Component Usage Guide
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          How to use these components in different projects
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Installation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold flex items-center gap-2">
              <Package className="w-4 h-4" />
              Installation
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(installationCode, 'install')}
            >
              {copiedText === 'install' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 font-mono text-sm">
            <pre className="whitespace-pre-wrap text-xs">{installationCode}</pre>
          </div>
        </div>

        {/* Component Details */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <FileCode className="w-4 h-4" />
            Available Components
          </h4>
          
          {components.map((component, index) => (
            <div key={index} className="border border-border/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-primary">{component.name}</h5>
                <Badge variant="outline" className="text-xs">
                  {component.files.length} file{component.files.length > 1 ? 's' : ''}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">{component.description}</p>
              
              {/* Files Required */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Required Files:</div>
                <div className="flex flex-wrap gap-1">
                  {component.files.map((file, fileIndex) => (
                    <Badge key={fileIndex} variant="secondary" className="text-xs">
                      {file}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Features:</div>
                <div className="flex flex-wrap gap-1">
                  {component.features.map((feature, featureIndex) => (
                    <Badge key={featureIndex} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Import Code */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-muted-foreground">Import:</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(component.importCode, `import-${index}`)}
                  >
                    {copiedText === `import-${index}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
                <div className="bg-muted/30 rounded p-2 font-mono text-xs">
                  {component.importCode}
                </div>
              </div>

              {/* Usage Code */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-muted-foreground">Usage:</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(component.usageCode, `usage-${index}`)}
                  >
                    {copiedText === `usage-${index}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
                <div className="bg-muted/30 rounded p-2 font-mono text-xs">
                  {component.usageCode}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Complete Setup Example */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              Complete Setup Example
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(setupCode, 'setup')}
            >
              {copiedText === 'setup' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 font-mono text-sm">
            <pre className="whitespace-pre-wrap text-xs">{setupCode}</pre>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-4 border-t border-border/50">
          <Button variant="outline" size="sm" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download All
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Docs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}