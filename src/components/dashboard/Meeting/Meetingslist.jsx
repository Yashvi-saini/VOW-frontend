import React, { useState } from "react";
import { deleteMeeting } from "../../../api/meetingApi";
import MeetingHeader from "./meetingheader";
import MeetingRow from "./Meetingrow";

const MeetingList = ({ meetings = [], loading = false, error = null, onRefresh }) => {
  const [deletingId, setDeletingId] = useState(null);

  // Handle delete meeting
  const handleDelete = async (meetingId) => {
    try {
      setDeletingId(meetingId);
      await deleteMeeting(meetingId);
      // Refresh the meeting list after successful deletion
      if (onRefresh) {
        await onRefresh();
      }
    } catch (err) {
      console.error('Failed to delete meeting:', err);
      alert('Failed to delete meeting. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (err) {
      return 'Invalid date';
    }
  };

  // Format time helper
  const formatTime = (startTime, endTime) => {
    if (!startTime) return 'N/A';
    try {
      const start = new Date(startTime);
      const end = endTime ? new Date(endTime) : null;
      
      const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
      const startStr = start.toLocaleTimeString('en-US', timeOptions);
      const endStr = end ? end.toLocaleTimeString('en-US', timeOptions) : '';
      
      return endStr ? `${startStr}–${endStr}` : startStr;
    } catch (err) {
      return 'Invalid time';
    }
  };

  // Get organiser name
  const getOrganiser = (meeting) => {
    if (meeting.createdBy?.fullName) return meeting.createdBy.fullName;
    if (meeting.createdBy?.name) return meeting.createdBy.name;
    if (meeting.createdBy?.username) return meeting.createdBy.username;
    return 'Unknown';
  };

  // Get avatar (use a default or generate based on organiser name)
  const getAvatar = (meeting, index) => {
    const colors = ['red', 'yellow', 'blue', 'green', 'purple', 'pink'];
    const color = colors[index % colors.length];
    return `/avatars/${color}.svg`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-gray-500 mb-2">No meetings scheduled</p>
        <p className="text-sm text-gray-400">Meetings will appear here once scheduled</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <MeetingHeader />
      <div className="flex flex-col gap-2 mt-2">
        {meetings.map((meeting, index) => (
          <MeetingRow
            key={meeting._id || meeting.id || index}
            meetingId={meeting._id || meeting.id}
            avatar={getAvatar(meeting, index)}
            title={meeting.title || 'Untitled Meeting'}
            date={formatDate(meeting.startTime)}
            time={formatTime(meeting.startTime, meeting.endTime)}
            organiser={getOrganiser(meeting)}
            description={meeting.description || ''}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default MeetingList;
