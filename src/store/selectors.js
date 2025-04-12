import { selector } from "recoil";
import { rateLimit, searchStatusOfType } from "./atoms";
import formatDate from "../utilities/formatDate";
import supabase from "../utilities/supabaseClient";
import { USER, REPOS } from "../constants";

export const apiLimit = selector({
  key: "apiLimit",
  get: ({ get }) => get(rateLimit),
  set: ({ set }, newValue) => {
    const { remaining, resetAt } = newValue;

    const formatted = formatDate(resetAt, {
      time: true,
      month: false,
      year: false,
    });

    const formattedSplit = formatted.split(", ");

    const valueDate = formattedSplit[0].split("/")[0];
    const todaysDate = new Date().getDate();

    let resetDay = Number(valueDate) === todaysDate ? "" : " tomorrow";

    const value = {
      ...remaining,
      resetAt: `${formattedSplit[1]}${resetDay}`,
      exceeded: Number(formattedSplit[1]) === 0,
    };

    set(rateLimit, value);
  },
});

const initialUserApiStatus = {
  searching: false,
  gettingUser: false,
  gettingPage: false,
  errors: false,
};

export const userApiStatus = selector({
  key: "userApiStatus",
  get: ({ get }) => get(searchStatusOfType(USER, initialUserApiStatus)),
  set: ({ set, get }, updates) => {
    const state = get(searchStatusOfType(USER));
    const newValue = {
      ...state,
      ...updates,
    };
    set(searchStatusOfType(USER), newValue);
  },
});

const initialRepoSearchStatus = {
  gettingSearch: false,
  gettingTopic: false,
  gettingPage: false,
  errors: false,
};

export const repoSearchStatus = selector({
  key: "repoSearchStatus",
  get: ({ get }) => get(searchStatusOfType(REPOS, initialRepoSearchStatus)),
  set: ({ set, get }, updates) => {
    const state = get(searchStatusOfType(REPOS));
    const newValue = {
      ...state,
      ...updates,
    };
    set(searchStatusOfType(REPOS), newValue);
  },
});

// Selector to fetch photo files data from Supabase
export const photoFilesQuery = selector({
  key: 'photoFilesQuery',
  get: async ({get}) => {
    
    // TODO: Add caching logic here if desired to avoid refetching constantly
    
    console.log('[Recoil] Fetching photo files...');
    try {
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }

      const { data, error } = await supabase
        .from('photo_files')
        .select('*')
        .order('created_at', { ascending: false }); // Fetch all columns, order by creation date
  
      if (error) {
        console.error('[Recoil] Error fetching photo files:', error);
        throw error; // Throw error to let Recoil handle it (e.g., with Suspense or ErrorBoundary)
      }
      
      console.log('[Recoil] Fetched photo files:', data);
      
      // Process files to add URLs
      const processedData = data && data.length > 0 
        ? data.map(photo => {
            // Generate public URL for each photo if it has a file_path
            if (photo.file_path) {
              try {
                // Get public URL using Supabase SDK
                const { data: urlData } = supabase
                  .storage
                  .from('photos')
                  .getPublicUrl(photo.file_path);
                
                if (urlData && urlData.publicUrl) {
                  photo.url = urlData.publicUrl;
                  console.log('[Recoil] Generated URL:', photo.url);
                }
              } catch (e) {
                console.error('[Recoil] Error generating URL for', photo.file_path, e);
              }
            }
            return photo;
          })
        : [];
        
      if (processedData.length === 0) {
        console.log('[Recoil] No photos found, using test data');
        return [
          { 
            id: '1', 
            file_name: '1744355804621_Subject.png',
            file_path: '1744355804621_Subject.png',
            file_size: 1043767,
            file_type: 'image/png',
            year: '2024',
            month: 'January',
            url: require('../assets/photo.png')
          },
          { 
            id: '2', 
            file_name: 'test_image2.jpg',
            file_path: 'test/image2.jpg',
            year: '2024',
            month: 'February',
            url: require('../assets/photo.png')
          },
          { 
            id: '3', 
            file_name: 'test_image3.jpg',
            file_path: 'test/image3.jpg',
            year: '2024',
            month: 'March',
            url: require('../assets/photo.png')
          }
        ];
      }
      
      return processedData;
    } catch (error) {
      console.error('[Recoil] Error in photoFilesQuery:', error);
      // Return test data on error
      return [
        { 
          id: '1', 
          file_name: '1744355804621_Subject.png',
          file_path: '1744355804621_Subject.png',
          file_size: 1043767,
          file_type: 'image/png',
          year: '2024',
          month: 'January',
          url: require('../assets/photo.png')
        }
      ];
    }
  },
  // Optional: Add a setter if you need to manually update the atom elsewhere
  // set: ({set}, newValue) => {
  //   set(photoFilesAtom, newValue);
  // }
});
