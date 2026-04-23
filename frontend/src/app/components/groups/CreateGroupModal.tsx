import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Users, Calendar, BookOpen, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (group: any) => void;
}

const GRADIENTS = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-indigo-500 to-purple-500',
  'from-teal-500 to-green-500',
];

export function CreateGroupModal({ isOpen, onClose, onSubmit }: CreateGroupModalProps) {
  const [formData, setFormData] = useState({
    groupName: '',
    courseCode: '',
    description: '',
    membersCount: 1,
    meetingDateTime: '',
  });

  const [randomGradient] = useState(() => GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]);

  const resetForm = () => {
    setFormData({
      groupName: '',
      courseCode: '',
      description: '',
      membersCount: 1,
      meetingDateTime: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'membersCount' ? parseInt(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.groupName || !formData.courseCode || !formData.description || !formData.meetingDateTime) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.membersCount <= 0) {
      toast.error('Members count must be greater than 0');
      return;
    }

    const meetingDate = new Date(formData.meetingDateTime);
    if (meetingDate < new Date()) {
      toast.error('Meeting date must be in the future');
      return;
    }

    const newGroup = {
      id: Date.now(),
      name: formData.groupName,
      course: formData.courseCode,
      members: formData.membersCount,
      description: formData.description,
      color: randomGradient,
      nextMeeting: formData.meetingDateTime.replace('T', ' at '),
    };

    onSubmit(newGroup);
    toast.success('Group created successfully!');
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-card border-border p-0 overflow-hidden rounded-[32px]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Form Side */}
          <div className="p-8 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-foreground">Create New Group</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Initialize a new collaboration node for your course.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupName" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Group Name</Label>
                <Input
                  id="groupName"
                  name="groupName"
                  placeholder="e.g. Study Group A"
                  value={formData.groupName}
                  onChange={handleInputChange}
                  className="rounded-xl bg-secondary border-transparent focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseCode" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Course Code</Label>
                <Input
                  id="courseCode"
                  name="courseCode"
                  placeholder="e.g. CS101"
                  value={formData.courseCode}
                  onChange={handleInputChange}
                  className="rounded-xl bg-secondary border-transparent focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Briefly describe the group's purpose"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="rounded-xl bg-secondary border-transparent focus:border-primary min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="membersCount" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Max Members</Label>
                  <Input
                    id="membersCount"
                    name="membersCount"
                    type="number"
                    min="1"
                    value={formData.membersCount}
                    onChange={handleInputChange}
                    className="rounded-xl bg-secondary border-transparent focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meetingDateTime" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Next Meeting</Label>
                  <Input
                    id="meetingDateTime"
                    name="meetingDateTime"
                    type="datetime-local"
                    value={formData.meetingDateTime}
                    onChange={handleInputChange}
                    className="rounded-xl bg-secondary border-transparent focus:border-primary"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-white font-bold hover:shadow-lg transition-all mt-4">
                Generate Group Node
              </Button>
            </form>
          </div>

          {/* Preview Side */}
          <div className="bg-secondary/50 p-8 flex flex-col items-center justify-center border-l border-border">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-8">Live Preview</p>
            
            <div className="w-full max-w-[320px] bg-card rounded-2xl border border-border overflow-hidden shadow-2xl scale-105">
              <div className={`h-24 bg-gradient-to-br ${randomGradient} p-6 flex items-center justify-between`}>
                <div>
                  <span className="text-white/90 text-xs font-bold uppercase tracking-widest">{formData.courseCode || 'COURSE'}</span>
                  <h3 className="text-white font-bold text-lg truncate w-40">{formData.groupName || 'Group Name'}</h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground text-xs mb-4 line-clamp-2 h-8">
                  {formData.description || 'Provide a description to see it here...'}
                </p>
                
                <div className="flex items-center justify-between mb-4 text-[10px] font-bold uppercase tracking-tighter">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    {formData.membersCount} students
                  </span>
                  <span className="text-muted-foreground">{formData.courseCode || 'N/A'}</span>
                </div>

                <div className="p-3 rounded-xl bg-secondary/80 mb-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span className="text-foreground">
                      {formData.meetingDateTime ? formData.meetingDateTime.replace('T', ' @ ') : 'No scheduled meeting'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 h-8 rounded-lg bg-primary/20 text-primary text-[10px] font-black uppercase flex items-center justify-center opacity-50 cursor-not-allowed">
                    Chat
                  </div>
                  <div className="flex-1 h-8 rounded-lg border border-border text-foreground text-[10px] font-black uppercase flex items-center justify-center opacity-50 cursor-not-allowed">
                    Details
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-8 text-center px-4 italic">
              "Visualizing the future of academic interaction."
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
