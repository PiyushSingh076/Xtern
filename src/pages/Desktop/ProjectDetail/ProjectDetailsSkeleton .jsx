import React from 'react';
import { Skeleton } from '@mui/material';

const ProjectDetailsSkeleton = () => {
  return (
    <div className="des-project-detail-container overflow-y-auto max-h-screen pb-8">
      <section>
        <div className="des-first-desc-img-sec !m-0 !px-4 !flex !flex-col md:!flex-row">
          {/* Media Section Skeleton */}
          <div className="hero-img-desc">
            <div className="d-flex justify-content-center">
              <div className="rounded-md w-[400px] h-fit overflow-hidden relative">
                <Skeleton variant="rectangular" width={400} height={225} animation="wave" />
              </div>
            </div>

            {/* Service Provider Card Skeleton */}
            <div className="mt-4 p-4 border rounded-lg bg-gray-50 shadow-md">
              <Skeleton variant="text" width={150} height={32} animation="wave" />
              <div className="flex items-start gap-4 mt-2">
                <Skeleton variant="circular" width={64} height={64} animation="wave" />
                <div className="flex-1">
                  <Skeleton variant="text" width={180} height={24} animation="wave" />
                  <Skeleton variant="text" width={140} height={20} animation="wave" />
                </div>
              </div>
            </div>
          </div>

          {/* Description Section Skeleton */}
          <div className="desc-container !min-w-0 !w-full !md:w-1/2">
            <div className="space-y-4">
              {/* Title and Price Section */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <Skeleton variant="text" width="80%" height={40} animation="wave" />
                </div>
                <Skeleton variant="text" width={100} height={32} animation="wave" />
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 flex-wrap">
                <Skeleton variant="text" width={120} height={24} animation="wave" />
                <Skeleton variant="text" width={120} height={24} animation="wave" />
                <Skeleton variant="text" width={180} height={24} animation="wave" />
              </div>

              {/* Description Content */}
              <div className="mt-8 space-y-3">
                <Skeleton variant="text" width={200} height={32} animation="wave" />
                <Skeleton variant="text" width="100%" height={20} animation="wave" />
                <Skeleton variant="text" width="95%" height={20} animation="wave" />
                <Skeleton variant="text" width="90%" height={20} animation="wave" />
                <Skeleton variant="text" width="85%" height={20} animation="wave" />
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <Skeleton variant="rectangular" width={200} height={48} animation="wave" className="rounded-md" />
              </div>

              {/* Reviews Section Skeleton */}
              {/* <div className="mt-8 space-y-4">
                <Skeleton variant="text" width={150} height={32} animation="wave" />
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Skeleton variant="circular" width={48} height={48} animation="wave" />
                      <div className="flex-1">
                        <Skeleton variant="text" width={150} height={24} animation="wave" />
                        <Skeleton variant="text" width={100} height={20} animation="wave" />
                      </div>
                    </div>
                    <Skeleton variant="text" width="100%" height={60} animation="wave" />
                  </div>
                ))}
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailsSkeleton;