'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Image as ImageIcon, ExternalLink, Award } from 'lucide-react';

interface WorkSample {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
  completedAt: Date;
  testimonial?: string;
  technologies?: string[];
}

interface WorkSampleGalleryProps {
  samples: WorkSample[];
  freelancerName: string;
}

export function WorkSampleGallery({
  samples,
  freelancerName,
}: WorkSampleGalleryProps) {
  const [selectedSample, setSelectedSample] = useState<WorkSample | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleSelectSample = (sample: WorkSample) => {
    setSelectedSample(sample);
    setShowDialog(true);
  };

  if (!samples || samples.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-slate-400" />
            <CardTitle className="text-white">Work Samples</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No work samples yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-slate-400" />
            <CardTitle className="text-white">Work Samples</CardTitle>
          </div>
          <p className="text-slate-400 text-sm">{samples.length} completed projects</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {samples.map(sample => (
              <div
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className="group cursor-pointer overflow-hidden rounded-lg border border-slate-700 hover:border-slate-500 transition-all"
              >
                {/* Sample Image */}
                <div className="relative aspect-video bg-slate-700 overflow-hidden">
                  {sample.imageUrl ? (
                    <>
                      <img
                        src={sample.imageUrl}
                        alt={sample.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="sm"
                          className="bg-slate-600 hover:bg-slate-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectSample(sample);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Sample Info */}
                <div className="p-3 bg-slate-700/50">
                  <h4 className="font-semibold text-white text-sm line-clamp-1 mb-1">
                    {sample.title}
                  </h4>
                  <p className="text-slate-400 text-xs line-clamp-2 mb-2">
                    {sample.description}
                  </p>
                  
                  {sample.technologies && sample.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {sample.technologies.slice(0, 2).map(tech => (
                        <Badge key={tech} variant="secondary" className="text-xs bg-slate-600 text-slate-200">
                          {tech}
                        </Badge>
                      ))}
                      {sample.technologies.length > 2 && (
                        <Badge variant="secondary" className="text-xs bg-slate-600 text-slate-200">
                          +{sample.technologies.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-slate-500">
                    Completed {sample.completedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedSample?.title}</DialogTitle>
          </DialogHeader>

          {selectedSample && (
            <div className="space-y-4 py-4">
              {/* Image */}
              {selectedSample.imageUrl && (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-600">
                  <img
                    src={selectedSample.imageUrl}
                    alt={selectedSample.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <p className="text-slate-400 text-sm mb-1">Project Description</p>
                <p className="text-white text-sm">{selectedSample.description}</p>
              </div>

              {/* Technologies */}
              {selectedSample.technologies && selectedSample.technologies.length > 0 && (
                <div>
                  <p className="text-slate-400 text-sm mb-2">Technologies Used</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSample.technologies.map(tech => (
                      <Badge key={tech} className="bg-slate-600 text-white">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonial */}
              {selectedSample.testimonial && (
                <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                  <p className="text-slate-300 text-sm italic">
                    &quot;{selectedSample.testimonial}&quot;
                  </p>
                  <p className="text-slate-500 text-xs mt-2">— Client Feedback</p>
                </div>
              )}

              {/* Info */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-600">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Completed Date</p>
                  <p className="text-white font-semibold text-sm">
                    {selectedSample.completedAt.toLocaleDateString()}
                  </p>
                </div>
                {selectedSample.projectUrl && (
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Project Link</p>
                    <Button
                      onClick={() => window.open(selectedSample.projectUrl, '_blank')}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-400 hover:bg-slate-600/10 gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Live
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
