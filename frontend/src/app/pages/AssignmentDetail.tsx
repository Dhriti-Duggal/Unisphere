import { useParams } from 'react-router';
import { Calendar, Clock, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export function AssignmentDetail() {
  const { id } = useParams();

  const assignment = {
    id: 1,
    title: 'Lab Report 3: Data Analysis',
    course: 'CS101 - Introduction to Computer Science',
    dueDate: '2026-03-05',
    dueTime: '11:59 PM',
    points: 100,
    status: 'pending',
    description: `In this lab, you will analyze a dataset and create visualizations to demonstrate your understanding of data processing concepts.
    
Requirements:
- Load and clean the provided dataset
- Perform statistical analysis
- Create at least 3 meaningful visualizations
- Write a summary report (2-3 pages)
- Submit both code and PDF report

Submission Guidelines:
- All code should be well-commented
- Include a README file explaining how to run your code
- Use proper naming conventions
- Cite any external resources used`,
    attachments: [
      { id: 1, name: 'dataset.csv', size: '2.5 MB', type: 'CSV' },
      { id: 2, name: 'instructions.pdf', size: '850 KB', type: 'PDF' },
    ],
    rubric: [
      { criteria: 'Code Quality', points: 30, description: 'Well-structured, commented code' },
      { criteria: 'Data Analysis', points: 30, description: 'Correct statistical analysis' },
      { criteria: 'Visualizations', points: 25, description: 'Clear, meaningful charts' },
      { criteria: 'Report', points: 15, description: 'Well-written summary' },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="bg-card rounded-[40px] p-10 border border-border shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-10 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none">Assignment Protocol</span>
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">{assignment.title}</h1>
            <p className="text-sm font-medium text-muted-foreground">{assignment.course}</p>
          </div>
          <div className="px-6 py-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
            {assignment.status}
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Temporal Deadline</p>
              <p className="text-lg font-black text-foreground leading-none mt-1">{assignment.dueDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform shadow-inner">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Submission Window</p>
              <p className="text-lg font-black text-foreground leading-none mt-1">{assignment.dueTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform shadow-inner">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Point Allocation</p>
              <p className="text-lg font-black text-foreground leading-none mt-1">{assignment.points} Nodes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-card rounded-[40px] p-10 border border-border shadow-sm">
            <h2 className="text-xl font-black text-foreground uppercase tracking-tight mb-8">Module Briefing</h2>
            <div className="text-sm font-medium text-foreground whitespace-pre-line leading-relaxed opacity-90">
              {assignment.description}
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-card rounded-[40px] p-10 border border-border shadow-sm">
            <h2 className="text-xl font-black text-foreground uppercase tracking-tight mb-8">Resource Payloads</h2>
            <div className="space-y-3">
              {assignment.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-6 rounded-[28px] bg-secondary/50 border border-transparent hover:border-border transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground leading-none mb-1">{attachment.name}</p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase">{attachment.type} · {attachment.size}</p>
                    </div>
                  </div>
                  <button className="h-10 px-6 rounded-xl bg-primary text-white font-bold text-[10px] uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submission */}
          <div className="bg-card rounded-[40px] p-10 border border-border shadow-sm">
            <h2 className="text-xl font-black text-foreground uppercase tracking-tight mb-8">Node Submission</h2>
            
            {assignment.status === 'pending' ? (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-border rounded-[32px] p-12 text-center hover:border-primary transition-all group cursor-pointer bg-secondary/30">
                  <div className="w-16 h-16 rounded-3xl bg-card border border-border flex items-center justify-center text-muted-foreground mx-auto mb-6 group-hover:text-primary transition-colors">
                    <Upload className="w-8 h-8" />
                  </div>
                  <p className="text-lg font-black text-foreground mb-2">Initialize Payload Upload</p>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">PDF, DOC, ZIP up to 50MB</p>
                </div>
                <button className="w-full h-16 rounded-[24px] bg-gradient-to-r from-primary to-accent text-white font-black uppercase tracking-widest text-sm hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-[0.98]">
                  Deploy Submission Protocol
                </button>
              </div>
            ) : (
                <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-lg font-black text-foreground">Payload Synchronized</p>
                        <p className="text-xs font-bold text-muted-foreground uppercase">Verified by UniSphere Registry</p>
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Right Column - Rubric */}
        <div>
          <div className="bg-card rounded-[40px] p-10 border border-border shadow-sm sticky top-24">
            <h2 className="text-xl font-black text-foreground uppercase tracking-tight mb-8">Grading Rubric</h2>
            <div className="space-y-6">
              {assignment.rubric.map((item) => (
                <div key={item.criteria} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{item.criteria}</h3>
                    <span className="text-xs font-black text-primary px-2 py-0.5 bg-primary/10 rounded-full">{item.points} PTS</span>
                  </div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase leading-relaxed tracking-wider">{item.description}</p>
                </div>
              ))}
              <div className="pt-6 border-t border-border mt-8">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Integrity</span>
                  <span className="text-2xl font-black text-primary">{assignment.points} Nodes</span>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="mt-10 p-6 rounded-3xl bg-orange-500/5 border border-orange-500/10 flex gap-4">
              <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-1">Final Sync Imminent</p>
                <p className="text-[10px] font-bold text-muted-foreground/80 leading-relaxed uppercase">
                  Submit before the node closes in 72 hours to ensure registry integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
