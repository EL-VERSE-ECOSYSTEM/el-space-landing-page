'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, ExternalLink, Image as ImageIcon, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  project_url?: string;
  technologies: string[];
  rating?: number;
  created_at?: string;
}

interface FreelancerPortfolioProps {
  freelancerId: string;
  isOwnProfile?: boolean;
  items?: PortfolioItem[];
}

export function FreelancerPortfolio({ freelancerId, isOwnProfile = false, items = [] }: FreelancerPortfolioProps) {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(items);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectUrl: '',
    technologies: '',
  });

  const handleAddPortfolioItem = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in title and description');
      return;
    }

    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      project_url: formData.projectUrl,
      technologies: formData.technologies
        .split(',')
        .map((t: string) => t.trim())
        .filter((t: string) => t),
      created_at: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/profile/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freelancerId,
          portfolioItem: newItem,
        }),
      });

      if (!response.ok) throw new Error('Failed to add portfolio item');

      setPortfolioItems([newItem, ...portfolioItems]);
      setShowAddModal(false);
      setFormData({ title: '', description: '', projectUrl: '', technologies: '' });
      toast.success('Portfolio item added!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add portfolio item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/profile/portfolio?itemId=${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      setPortfolioItems(portfolioItems.filter((item) => item.id !== itemId));
      toast.success('Portfolio item deleted');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete portfolio item');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Portfolio</h3>
        {isOwnProfile && (
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="bg-slate-600 hover:bg-slate-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        )}
      </div>

      {portfolioItems.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="py-12 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-slate-600 mb-4" />
            <p className="text-slate-400">
              {isOwnProfile ? 'Add portfolio items to showcase your work' : 'No portfolio items yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {portfolioItems.map((item) => (
            <Card
              key={item.id}
              className="bg-slate-800 border-slate-700 hover:border-slate-500 transition-colors cursor-pointer overflow-hidden group"
              onClick={() => setSelectedItem(item)}
            >
              {item.image_url && (
                <div className="relative h-40 bg-slate-700 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <CardContent className="pt-4">
                <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-slate-400 text-sm line-clamp-2 mb-3">{item.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {item.technologies.slice(0, 3).map((tech) => (
                    <Badge key={tech} className="bg-slate-600/30 text-slate-300 text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {item.technologies.length > 3 && (
                    <Badge className="bg-slate-700 text-slate-300 text-xs">
                      +{item.technologies.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  {item.project_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.project_url, '_blank');
                      }}
                      className="text-slate-400 hover:text-slate-300 hover:bg-slate-600/10"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  )}
                  {isOwnProfile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-600/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Portfolio Item Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Add Portfolio Item</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-slate-300 text-sm block mb-2">Project Title *</label>
              <input
                type="text"
                placeholder="e.g., E-commerce Platform Redesign"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm block mb-2">Description *</label>
              <textarea
                placeholder="Describe your project work and achievements..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-500"
                rows={4}
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm block mb-2">Project URL (Optional)</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={formData.projectUrl}
                onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm block mb-2">Technologies (comma-separated)</label>
              <input
                type="text"
                placeholder="React, TypeScript, Tailwind CSS"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-500"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPortfolioItem}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white"
              >
                Add Item
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Item Detail Modal */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">{selectedItem.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {selectedItem.image_url && (
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.title}
                  className="w-full rounded-lg max-h-96 object-cover"
                />
              )}

              <div>
                <p className="text-slate-400 text-sm mb-2">Description</p>
                <p className="text-slate-300">{selectedItem.description}</p>
              </div>

              <div>
                <p className="text-slate-400 text-sm mb-2">Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.technologies.map((tech) => (
                    <Badge key={tech} className="bg-slate-600 text-white">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedItem.project_url && (
                <Button
                  onClick={() => window.open(selectedItem.project_url, '_blank')}
                  className="w-full bg-slate-600 hover:bg-slate-700 text-white"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Project
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
