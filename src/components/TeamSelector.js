import React, { useState } from 'react';
import { Select, Fieldset } from 'react95';
import { useAuth } from '../context/AuthContext';

export default function TeamSelector({ onSelect, compact = false }) {
  const { teamMembers, currentTeam, switchTeam } = useAuth();
  const [open, setOpen] = useState(false);
  
  const handleSelect = (teamIdValue) => {
    // Find the team member that has this team_id
    const teamMember = teamMembers.find(tm => 
      (tm.team_id === teamIdValue) || (tm.teams?.id === teamIdValue)
    );
    
    if (teamMember) {
      switchTeam(teamMember.id);
    }
    
    setOpen(false);
    
    if (onSelect) {
      // Pass the team_id directly to the parent
      onSelect(teamIdValue);
    }
  };
  
  if (!teamMembers || teamMembers.length === 0) {
    return compact ? null : (
      <Fieldset legend="Teams">
        <div className="p2">
          <p>You are not a member of any teams.</p>
        </div>
      </Fieldset>
    );
  }
  
  return (
    <div className={compact ? '' : 'p2'}>
      {!compact && <p className="mb1">Current Team:</p>}
      <Select
        defaultValue={currentTeam?.team_id || currentTeam?.teams?.id}
        options={teamMembers.map(tm => ({
          value: tm.team_id || tm.teams?.id, 
          label: tm.teams?.name || 'Unknown Team'
        }))}
        menuMaxHeight={160}
        width={compact ? 150 : 200}
        open={open}
        onToggle={() => setOpen(!open)}
        onChange={(e) => handleSelect(e.target.value)}
      />
    </div>
  );
} 