import { useMemo, useState } from 'react';
import { 
  BookOpen, Plus, Image, FileText,
  Save, Sparkles, ChevronLeft,
  Users, GraduationCap, Trash2, Link as LinkIcon, MessageCircleQuestion
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { API } from '../../api/api';
import { useUser } from '../contexts/UserContext';

type ModuleItemType = 'link' | 'question' | 'note';

interface ModuleItem {
  id: string;
  title: string;
  type: ModuleItemType;
  content: string;
}

interface CourseModule {
  id: string;
  title: string;
  items: ModuleItem[];
}

export function CreateCourse() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    category: 'Computer Science',
    description: '',
    semester: '',
    group: '',
    studyMaterial: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const teacherGroups = useMemo(() => user.teachingGroups || [], [user.teachingGroups]);
  const [modules, setModules] = useState<CourseModule[]>([
    {
      id: crypto.randomUUID(),
      title: 'Module 1',
      items: [{ id: crypto.randomUUID(), title: 'Welcome Resource', type: 'note', content: '' }],
    },
  ]);

  const updateModule = (moduleId: string, updater: (module: CourseModule) => CourseModule) => {
    setModules(prev => prev.map(m => (m.id === moduleId ? updater(m) : m)));
  };

  const addModule = () => {
    setModules(prev => [
      ...prev,
      { id: crypto.randomUUID(), title: `Module ${prev.length + 1}`, items: [{ id: crypto.randomUUID(), title: '', type: 'link', content: '' }] },
    ]);
  };

  const removeModule = (moduleId: string) => {
    setModules(prev => prev.filter(m => m.id !== moduleId));
  };

  const addModuleItem = (moduleId: string) => {
    updateModule(moduleId, (module) => ({
      ...module,
      items: [...module.items, { id: crypto.randomUUID(), title: '', type: 'link', content: '' }],
    }));
  };

  const removeModuleItem = (moduleId: string, itemId: string) => {
    updateModule(moduleId, (module) => ({
      ...module,
      items: module.items.filter(i => i.id !== itemId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.code || !formData.semester || !formData.studyMaterial.trim()) {
      toast.error('Protocol incomplete. Please populate all required parameters.');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const res = await fetch(API.courses, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const createdCourse = await res.json();
        const flattened = modules.flatMap((module, moduleIndex) =>
          module.items
            .filter(item => item.title.trim() && item.content.trim())
            .map((item, itemIndex) => ({
              title: item.title.trim(),
              content: item.content.trim(),
              type: item.type,
              moduleTitle: module.title.trim() || `Module ${moduleIndex + 1}`,
              section: itemIndex + 1,
            }))
        );

        if (flattened.length > 0) {
          await Promise.all(
            flattened.map((item) =>
              fetch(API.addCourseMaterial(createdCourse.id), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                  title: `${item.moduleTitle}: ${item.title}`,
                  materialType: item.type === 'link' ? 'link' : 'note',
                  linkUrl: item.type === 'link' ? item.content : '',
                  description: JSON.stringify({
                    module: item.moduleTitle,
                    sectionTitle: item.title,
                    section: item.section,
                    type: item.type,
                    content: item.content,
                  }),
                }),
              })
            )
          );
        }

        toast.success('Academic module initialized and deployed to registry.');
        navigate('/teacher/courses');
      } else {
        const errData = await res.json();
        toast.error(errData.message || 'Failed to initialize module.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Failed to initialize module.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate(-1)}
                className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                  <ChevronLeft className="w-6 h-6" />
              </button>
              <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">New Node Initialization</span>
                  </div>
                  <h1 className="text-4xl font-black text-foreground tracking-tight">Deploy Course Module</h1>
              </div>
          </div>
          
          <div className="flex items-center gap-3">
              <button className="h-12 px-6 rounded-2xl bg-secondary text-foreground text-xs font-black uppercase tracking-widest border border-border hover:bg-background transition-all">
                  Draft Protocol
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-12 px-8 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 shadow-lg disabled:opacity-50"
              >
                  {isSubmitting ? 'Deploying...' : 'Deploy Module'}
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form Side */}
          <div className="lg:col-span-8 space-y-8">
              <div className="bg-card rounded-[40px] p-10 border border-border shadow-sm space-y-8">
                  <div className="space-y-6">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Module Identity</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Advanced Quantum Computing"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full h-16 px-6 rounded-2xl bg-secondary border border-transparent focus:border-primary/20 transition-all outline-none text-lg font-bold placeholder:text-muted-foreground/50"
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Registry Code</label>
                              <input 
                                type="text" 
                                placeholder="CS402"
                                value={formData.code}
                                onChange={(e) => setFormData({...formData, code: e.target.value})}
                                className="w-full h-14 px-6 rounded-2xl bg-secondary border border-transparent focus:border-primary/20 transition-all outline-none font-bold"
                              />
                          </div>
                          <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Target Year / Semester</label>
                              <select 
                                value={formData.semester}
                                onChange={(e) => setFormData({...formData, semester: e.target.value})}
                                className="w-full h-14 px-6 rounded-2xl bg-secondary border border-transparent focus:border-primary/20 transition-all outline-none font-bold appearance-none"
                              >
                                  <option value="">Select Year</option>
                                  <option value="Year 1">Year 1</option>
                                  <option value="Year 2">Year 2</option>
                                  <option value="Year 3">Year 3</option>
                                  <option value="Year 4">Year 4</option>
                                  <option value="Postgraduate">Postgraduate</option>
                              </select>
                          </div>
                          <div className="space-y-2 col-span-2">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Target Class Group (Optional)</label>
                              <select 
                                value={formData.group}
                                onChange={(e) => setFormData({...formData, group: e.target.value})}
                                className="w-full h-14 px-6 rounded-2xl bg-secondary border border-transparent focus:border-primary/20 transition-all outline-none font-bold appearance-none"
                              >
                                  <option value="">All Groups (Global)</option>
                                  {teacherGroups.map((teachingGroup) => (
                                    <option key={teachingGroup} value={teachingGroup}>{teachingGroup}</option>
                                  ))}
                              </select>
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Course Narrative (Markdown Supported)</label>
                          <textarea 
                            rows={6}
                            placeholder="Detail the modules mission profiling and learning objectives..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full p-6 rounded-3xl bg-secondary border border-transparent focus:border-primary/20 transition-all outline-none font-medium resize-none"
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Study Material (Required)</label>
                          <textarea 
                            rows={6}
                            placeholder="Paste syllabus text, weekly reading list, module links, or study notes..."
                            value={formData.studyMaterial}
                            onChange={(e) => setFormData({...formData, studyMaterial: e.target.value})}
                            className="w-full p-6 rounded-3xl bg-secondary border border-transparent focus:border-primary/20 transition-all outline-none font-medium resize-none"
                          />
                      </div>
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                            Course Modules & Sections
                          </label>
                          <button
                            type="button"
                            onClick={addModule}
                            className="h-8 px-3 rounded-lg bg-secondary text-foreground text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Module
                          </button>
                        </div>
                        <div className="space-y-4">
                          {modules.map((module, moduleIdx) => (
                            <div key={module.id} className="rounded-3xl border border-border bg-secondary/40 p-4 space-y-3">
                              <div className="flex items-center gap-3">
                                <input
                                  value={module.title}
                                  onChange={(e) => updateModule(module.id, prev => ({ ...prev, title: e.target.value }))}
                                  placeholder={`Module ${moduleIdx + 1} title`}
                                  className="flex-1 h-11 px-4 rounded-xl bg-card border border-transparent focus:border-primary/20 outline-none text-sm font-bold"
                                />
                                {modules.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeModule(module.id)}
                                    className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-red-500"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                              <div className="space-y-3">
                                {module.items.map((item) => (
                                  <div key={item.id} className="rounded-2xl bg-card border border-border p-3 space-y-2">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                      <input
                                        value={item.title}
                                        onChange={(e) => updateModule(module.id, prev => ({
                                          ...prev,
                                          items: prev.items.map(i => (i.id === item.id ? { ...i, title: e.target.value } : i)),
                                        }))}
                                        placeholder="Section title"
                                        className="h-10 px-3 rounded-lg bg-secondary/60 border border-transparent focus:border-primary/20 outline-none text-xs font-bold"
                                      />
                                      <select
                                        value={item.type}
                                        onChange={(e) => updateModule(module.id, prev => ({
                                          ...prev,
                                          items: prev.items.map(i => (i.id === item.id ? { ...i, type: e.target.value as ModuleItemType, content: '' } : i)),
                                        }))}
                                        className="h-10 px-3 rounded-lg bg-secondary/60 border border-transparent focus:border-primary/20 outline-none text-xs font-bold"
                                      >
                                        <option value="link">Material Link</option>
                                        <option value="question">Question / Prompt</option>
                                        <option value="note">Module Note</option>
                                      </select>
                                      <button
                                        type="button"
                                        onClick={() => removeModuleItem(module.id, item.id)}
                                        className="h-10 rounded-lg bg-secondary/60 border border-transparent text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-red-500"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                    <textarea
                                      rows={2}
                                      value={item.content}
                                      onChange={(e) => updateModule(module.id, prev => ({
                                        ...prev,
                                        items: prev.items.map(i => (i.id === item.id ? { ...i, content: e.target.value } : i)),
                                      }))}
                                      placeholder={item.type === 'link' ? 'https://resource-link.com' : item.type === 'question' ? 'Write question or activity prompt' : 'Add notes/content for this section'}
                                      className="w-full p-3 rounded-lg bg-secondary/60 border border-transparent focus:border-primary/20 outline-none text-xs font-medium resize-none"
                                    />
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addModuleItem(module.id)}
                                  className="h-9 px-3 rounded-lg bg-card border border-border text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add Section
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                  </div>
              </div>

              {/* Course Features */}
              <div className="bg-card rounded-[40px] p-10 border border-border shadow-sm">
                  <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-8 flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Module Parameters
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                      {[
                          { label: 'Public Enrollment', icon: Users, desc: 'Allow any student to synchronize' },
                          { label: 'Module Resources', icon: LinkIcon, desc: 'Attach links per module section' },
                          { label: 'Question Bank', icon: MessageCircleQuestion, desc: 'Add prompts for each module' },
                          { label: 'Archival Support', icon: Save, desc: 'Enable resource state saving' },
                      ].map((feat, i) => (
                          <div key={i} className="p-6 rounded-3xl bg-secondary/50 border border-transparent hover:border-border transition-all flex items-start gap-4 group cursor-pointer">
                              <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                  <feat.icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                  <p className="text-sm font-bold text-foreground">{feat.label}</p>
                                  <p className="text-[10px] font-medium text-muted-foreground mt-0.5">{feat.desc}</p>
                              </div>
                              <div className="w-5 h-5 rounded-full border-2 border-border mt-1 transition-all group-hover:border-primary"></div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Configuration Sidebar */}
          <div className="lg:col-span-4 space-y-8">
               {/* Cover Image Upload */}
               <div className="bg-card rounded-[40px] p-8 border border-border shadow-sm">
                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-6">Cover Identity</h3>
                    <div className="aspect-video rounded-3xl bg-secondary border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-all group cursor-pointer overflow-hidden relative">
                         <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all">
                             <Image className="w-6 h-6" />
                         </div>
                         <p className="text-xs font-bold text-muted-foreground">Upload Visual Token</p>
                         <p className="text-[10px] font-medium text-muted-foreground/60 uppercase">PNG, JPG up to 10MB</p>
                    </div>
               </div>

               {/* Resource Pre-allocation */}
               <div className="bg-card rounded-[40px] p-8 border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-8 text-[10px] font-black uppercase tracking-widest">
                        <span className="text-muted-foreground">Pre-allocated Assets</span>
                        <span className="text-primary">+ Add</span>
                    </div>
                    <div className="space-y-3">
                         <div className="p-4 rounded-2xl bg-secondary/50 flex items-center gap-4">
                             <FileText className="w-5 h-5 text-muted-foreground" />
                             <span className="text-xs font-bold text-foreground">Syllabus Template</span>
                         </div>
                    </div>
               </div>
          </div>
      </div>
    </div>
  );
}
