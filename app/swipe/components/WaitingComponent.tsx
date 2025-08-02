"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Users, Star } from 'lucide-react';

interface GroupMember {
  id: string;
  name: string;
  hasCompleted: boolean;
  avatarUrl?: string;
}

interface WaitingComponentProps {
  groupId: string;
  userId: string;
  onAllCompleted: () => void;
}

interface GroupCompletionStatus {
  members: GroupMember[];
  completedCount: number;
  totalCount: number;
  allCompleted: boolean;
  progressPercentage: number;
}

export function WaitingComponent({
  groupId,
  userId,
  onAllCompleted,
}: WaitingComponentProps) {
  const [completionStatus, setCompletionStatus] = useState<GroupCompletionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [waitingTime, setWaitingTime] = useState(0);

  // Polling function to check group completion status
  const checkGroupStatus = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}/completion-status`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch group status');
      }

      const data: GroupCompletionStatus = await response.json();
      setCompletionStatus(data);
      setError(null);

      // If all members have completed, trigger callback
      if (data.allCompleted) {
        onAllCompleted();
      }
    } catch (err) {
      console.error('Error fetching group status:', err);
      setError('Failed to check group status');
    } finally {
      setIsLoading(false);
    }
  };

  // Set up polling interval and waiting timer
  useEffect(() => {
    // Initial check
    checkGroupStatus();

    // Set up polling every 1 second
    const pollingInterval = setInterval(checkGroupStatus, 1000);

    // Set up waiting time counter
    const timerInterval = setInterval(() => {
      setWaitingTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(pollingInterval);
      clearInterval(timerInterval);
    };
  }, [groupId, onAllCompleted]);

  const formatWaitingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading && !completionStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Checking group status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardContent className="p-8">
            {/* Waiting Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="relative mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-4"
                >
                  <Star className="w-full h-full text-purple-500" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 w-16 h-16 mx-auto border-4 border-purple-200 rounded-full"
                />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Great job! 🎉
              </h2>
              <p className="text-gray-600 text-lg">
                You've finished swiping!
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Waiting for your friends to catch up...
              </p>
            </motion.div>

            {/* Progress Section */}
            {completionStatus && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-800">Group Progress</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {completionStatus.completedCount}/{completionStatus.totalCount}
                  </span>
                </div>
                
                <Progress 
                  value={completionStatus.progressPercentage} 
                  className="h-3 mb-4"
                />
                
                <div className="text-center">
                  <p className="text-lg font-semibold text-purple-700">
                    {completionStatus.progressPercentage.toFixed(0)}% Complete
                  </p>
                </div>
              </motion.div>
            )}

            {/* Members Status */}
            {completionStatus && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Member Status
                </h3>
                
                <div className="space-y-3">
                  {completionStatus.members.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                            <span className="text-purple-700 font-semibold text-sm">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="font-medium text-gray-800">
                          {member.name}
                          {member.id === userId && " (You)"}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {member.hasCompleted ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </motion.div>
                        ) : (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Clock className="w-5 h-5 text-orange-500" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Waiting Time */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <p className="text-sm text-gray-500 mb-2">Waiting time</p>
              <p className="text-xl font-mono font-semibold text-purple-600">
                {formatWaitingTime(waitingTime)}
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-600 text-sm text-center">{error}</p>
                <Button
                  onClick={checkGroupStatus}
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                >
                  Retry
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Floating Animation Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-300 rounded-full opacity-50"
              animate={{
                y: [-20, -100],
                x: [0, Math.random() * 40 - 20],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.7,
                ease: "easeOut",
              }}
              style={{
                left: `${20 + i * 15}%`,
                bottom: "10%",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}