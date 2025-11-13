import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllMeetings } from "../../../api/meetingApi";
import { getTeams } from "../../../api/authApi";
import MeetingSearchFilter from "./MeetingSearchFilter";
import MeetingTabs from "./Meetingtab";
import MeetingList from "./Meetingslist";
import Pagination from "./Pagination";

const MeetingPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const userState = useSelector((state) => state.user);
  const workspaceId = userState?.workspaceId;
  const currentUserId = userState?.profile?._id || userState?.profile?.id;

  useEffect(() => {
    fetchMeetingsAndTeams();
  }, []);

  const fetchMeetingsAndTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch meetings
      const meetingsResponse = await getAllMeetings();
      const meetingsData = meetingsResponse.meetings || meetingsResponse.data || meetingsResponse || [];
      setMeetings(Array.isArray(meetingsData) ? meetingsData : []);
      
      // Fetch teams to get supervisor IDs
      if (workspaceId) {
        try {
          const teamsResponse = await getTeams(workspaceId);
          const teamsData = teamsResponse.teams || teamsResponse.data || teamsResponse || [];
          setTeams(Array.isArray(teamsData) ? teamsData : []);
        } catch (teamErr) {
          console.warn('Could not fetch teams:', teamErr);
          setTeams([]);
        }
      }
    } catch (err) {
      console.error('Error fetching meetings:', err);
      setError(err.message || 'Failed to load meetings');
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  // Count meetings by creator role
  const getMeetingCounts = () => {
    const total = meetings.length;
    
    // Get all supervisor IDs from teams
    const supervisorIds = teams
      .map(team => team.lead || team.superviser || team.supervisor)
      .filter(Boolean)
      .map(id => typeof id === 'object' ? (id._id || id.id) : id);
    
    // Count meetings by supervisor
    const bySupervisor = meetings.filter(m => {
      const creatorId = m.createdBy?._id || m.createdBy?.id || m.createdBy;
      return supervisorIds.includes(creatorId);
    }).length;
    
    // Count meetings by manager (not supervisor, not regular user)
    const byManager = meetings.filter(m => {
      const creatorId = m.createdBy?._id || m.createdBy?.id || m.createdBy;
      return !supervisorIds.includes(creatorId) && creatorId !== currentUserId;
    }).length;

    return { total, byManager, bySupervisor };
  };

  // Filter meetings based on search term
  const filteredMeetings = meetings.filter(meeting => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();
    const title = (meeting.title || '').toLowerCase();
    const description = (meeting.description || '').toLowerCase();
    return title.includes(search) || description.includes(search);
  });

  const counts = getMeetingCounts();

  return (
    <div className="p-2 sm:p-6 bg-gray-50 min-h-screen">
      {/* Search + Filter */}
      <MeetingSearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Info Tabs */}
      <MeetingTabs 
        total={counts.total}
        byManager={counts.byManager}
        bySupervisor={counts.bySupervisor}
      />

      {/* Meeting List */}
      <MeetingList 
        meetings={filteredMeetings}
        loading={loading}
        error={error}
        onRefresh={fetchMeetingsAndTeams}
      />

      {/* Pagination */}
      {filteredMeetings.length > 0 && <Pagination total={filteredMeetings.length} />}
    </div>
  );
};

export default MeetingPage;
