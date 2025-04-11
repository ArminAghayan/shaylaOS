import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../utilities/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);

  // Fetch team members for the current user
  const fetchTeamMembers = async (userId) => {
    if (!userId) return [];
    
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('id, team_id, role, teams:team_id(id, name)')
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error fetching team members:', error);
        return [];
      }
      
      setTeamMembers(data || []);
      
      // Set current team to the first team if available
      if (data && data.length > 0) {
        setCurrentTeam(data[0]);
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in fetchTeamMembers:', error);
      return [];
    }
  };

  useEffect(() => {
    // Check for active session on load
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        await fetchTeamMembers(currentUser.id);
      }
      
      setLoading(false);

      // Set up listener for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          const updatedUser = session?.user || null;
          setUser(updatedUser);
          
          if (updatedUser) {
            await fetchTeamMembers(updatedUser.id);
          } else {
            setTeamMembers([]);
            setCurrentTeam(null);
          }
        }
      );

      return () => subscription.unsubscribe();
    };

    fetchSession();
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error && data?.user) {
      await fetchTeamMembers(data.user.id);
    }
    
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setTeamMembers([]);
      setCurrentTeam(null);
    }
    return { error };
  };

  const switchTeam = (teamMemberId) => {
    const selectedTeam = teamMembers.find(tm => tm.id === teamMemberId);
    if (selectedTeam) {
      setCurrentTeam(selectedTeam);
      return true;
    }
    return false;
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    teamMembers,
    currentTeam,
    switchTeam,
    fetchTeamMembers
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
} 