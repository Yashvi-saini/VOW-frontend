import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllMeetings } from "@/api/meetingApi";
import { getTeams } from "@/api/teamApi";
import MeetingSearchFilter from "./MeetingSearchFilter";
import MeetingTabs from "./Meetingtab";
import MeetingList from "./Meetingslist";
import MeetingForm from "./Meetingform";

const MeetingPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  const userState = useSelector((state) => state.user);
  const workspaceId = userState?.workspaceId || localStorage.getItem("workspaceId");
  const currentUserId = userState?.profile?._id || userState?.profile?.id;

  useEffect(() => {
    fetchMeetingsAndTeams();
  }, [workspaceId]);

  const fetchMeetingsAndTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const meetingsResponse = await getAllMeetings();
      const raw = meetingsResponse?.data?.meetings ?? meetingsResponse?.data ?? meetingsResponse?.meetings ?? [];
      const meetingsList = Array.isArray(raw) ? raw : (Array.isArray(raw?.meetings) ? raw.meetings : []);
      setMeetings(meetingsList);

      if (workspaceId) {
        try {
          const teamsResponse = await getTeams(workspaceId);
          const rawTeams = teamsResponse?.data?.teams ?? teamsResponse?.data ?? teamsResponse?.teams ?? [];
          const teamsList = Array.isArray(rawTeams) ? rawTeams : (Array.isArray(rawTeams?.teams) ? rawTeams.teams : []);
          setTeams(teamsList);
        } catch (teamErr) {
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

  const getMeetingCounts = () => {
    const total = meetings.length;
    const supervisorIds = teams
      .map(team => team.lead || team.superviser || team.supervisor)
      .filter(Boolean)
      .map(id => typeof id === 'object' ? (id._id || id.id) : id);
    const bySupervisor = meetings.filter(m => {
      const creatorId = m.createdBy?._id || m.createdBy?.id || m.createdBy;
      return supervisorIds.includes(creatorId);
    }).length;
    const byManager = meetings.filter(m => {
      const creatorId = m.createdBy?._id || m.createdBy?.id || m.createdBy;
      return !supervisorIds.includes(creatorId) && creatorId !== currentUserId;
    }).length;

    return { total, byManager, bySupervisor };
  };

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
      <MeetingSearchFilter 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        onScheduleClick={() => setShowScheduleModal(true)}
      />

      <MeetingTabs 
        total={counts.total}
        byManager={counts.byManager}
        bySupervisor={counts.bySupervisor}
      />

      <MeetingList 
        meetings={filteredMeetings}
        loading={loading}
        error={error}
        onRefresh={fetchMeetingsAndTeams}
      />

      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-4 sm:p-6">
            <MeetingForm
              role="manager"
              onSuccess={() => {
                setShowScheduleModal(false);
                fetchMeetingsAndTeams();
              }}
              onClose={() => setShowScheduleModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingPage;

