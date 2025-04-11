import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import supabase from '../utilities/supabaseClient';

const TeamContext = createContext();

export function TeamProvider({ children }) {
  const { user, teamMembers, currentTeam } = useAuth();
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch detailed team information when currentTeam changes
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!currentTeam) {
        setTeamData(null);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        // Fetch team details
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .eq('id', currentTeam.team_id)
          .single();
          
        if (error) {
          console.error('Error fetching team data:', error);
          setTeamData(null);
        } else {
          setTeamData(data);
        }
      } catch (error) {
        console.error('Error in fetchTeamData:', error);
        setTeamData(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeamData();
  }, [currentTeam]);
  
  // Get all members of the current team
  const getTeamMembers = async () => {
    if (!currentTeam) return [];
    
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('id, user_id, role, profiles:user_id(id, email, display_name)')
        .eq('team_id', currentTeam.team_id);
        
      if (error) {
        console.error('Error fetching team members:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getTeamMembers:', error);
      return [];
    }
  };
  
  // Check if the current user has a specific role in their team
  const hasRole = (role) => {
    if (!currentTeam) return false;
    return currentTeam.role === role;
  };
  
  // Check if the current user is an admin or owner
  const isAdminOrOwner = () => {
    if (!currentTeam) return false;
    return ['admin', 'owner'].includes(currentTeam.role);
  };
  
  const value = {
    teamData,
    loading,
    currentTeam,
    teamMembers,
    getTeamMembers,
    hasRole,
    isAdminOrOwner
  };
  
  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  return useContext(TeamContext);
} 