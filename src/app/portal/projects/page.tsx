'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

interface Project {
  id: string;
  name: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold';
  progress: number;
  startDate: string;
  endDate?: string;
  teamMembers: Array<{
    name: string;
    role: string;
    avatar?: string;
  }>;
  milestones: Array<{
    id: string;
    name: string;
    status: 'pending' | 'in-progress' | 'completed';
    dueDate: string;
  }>;
  description: string;
  nextMilestone?: string;
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/portal/projects', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'planning': return 'bg-gray-100 text-gray-800';
      case 'on-hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in-progress': return 'text-blue-400';
      case 'pending': return 'text-text-muted';
      default: return 'text-text-muted';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <p className="mt-2 text-text-muted">
          Track your project progress and milestones
        </p>
      </div>

      {/* Projects Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="text-2xl font-bold text-white">{projects.length}</div>
          <div className="text-sm text-text-muted">Total Projects</div>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="text-2xl font-bold text-blue-400">
            {projects.filter(p => p.status === 'in-progress').length}
          </div>
          <div className="text-sm text-text-muted">In Progress</div>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="text-2xl font-bold text-yellow-400">
            {projects.filter(p => p.status === 'review').length}
          </div>
          <div className="text-sm text-text-muted">In Review</div>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="text-2xl font-bold text-green-400">
            {projects.filter(p => p.status === 'completed').length}
          </div>
          <div className="text-sm text-text-muted">Completed</div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-lg border border-gray-700 bg-gray-900 p-6 hover:bg-gray-800 cursor-pointer transition"
            onClick={() => setSelectedProject(project)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">{project.name}</h3>
              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(project.status)}`}>
                {project.status.replace('-', ' ')}
              </span>
            </div>

            <p className="text-text-muted text-sm mb-4 line-clamp-2">{project.description}</p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-muted">Progress</span>
                <span className="text-white">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Team Members */}
            <div className="mb-4">
              <div className="text-sm text-text-muted mb-2">Team</div>
              <div className="flex -space-x-2">
                {project.teamMembers.slice(0, 3).map((member, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full bg-gray-600 border-2 border-gray-900 flex items-center justify-center text-xs text-white"
                    title={`${member.name} - ${member.role}`}
                  >
                    {member.name.charAt(0)}
                  </div>
                ))}
                {project.teamMembers.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-gray-900 flex items-center justify-center text-xs text-white">
                    +{project.teamMembers.length - 3}
                  </div>
                )}
              </div>
            </div>

            {/* Next Milestone */}
            {project.nextMilestone && (
              <div className="text-sm">
                <span className="text-text-muted">Next: </span>
                <span className="text-white">{project.nextMilestone}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-medium text-white mb-2">No projects yet</h3>
          <p className="text-text-muted">Your projects will appear here once they're created</p>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg border border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedProject.name}</h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-text-muted hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Project Info */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Project Details</h3>
                  <p className="text-text-muted mb-4">{selectedProject.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-text-muted">Status: </span>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(selectedProject.status)}`}>
                        {selectedProject.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-muted">Progress: </span>
                      <span className="text-white">{selectedProject.progress}%</span>
                    </div>
                    <div>
                      <span className="text-text-muted">Start Date: </span>
                      <span className="text-white">{selectedProject.startDate}</span>
                    </div>
                    {selectedProject.endDate && (
                      <div>
                        <span className="text-text-muted">End Date: </span>
                        <span className="text-white">{selectedProject.endDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Milestones</h3>
                  <div className="space-y-3">
                    {selectedProject.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between border-b border-gray-700 pb-3 last:border-b-0">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={getMilestoneStatusColor(milestone.status)}>
                              {milestone.status === 'completed' ? '✓' : 
                               milestone.status === 'in-progress' ? '⟳' : '○'}
                            </span>
                            <span className="text-white">{milestone.name}</span>
                          </div>
                          <div className="text-sm text-text-muted ml-6">Due: {milestone.dueDate}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Team Members</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedProject.teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white">{member.name}</div>
                          <div className="text-sm text-text-muted">{member.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 border border-gray-600 rounded-md text-text-primary hover:text-white hover:border-gray-500 transition"
                >
                  Close
                </button>
                <a
                  href={`/portal/projects/${selectedProject.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}