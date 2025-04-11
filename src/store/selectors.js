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
    const { data, error } = await supabase
      .from('photo_files')
      .select('*')
      .order('created_at', { ascending: false }); // Fetch all columns, order by creation date

    if (error) {
      console.error('[Recoil] Error fetching photo files:', error);
      throw error; // Throw error to let Recoil handle it (e.g., with Suspense or ErrorBoundary)
    }
    
    console.log('[Recoil] Fetched photo files:', data);
    return data || []; // Return the fetched data or an empty array
  },
  // Optional: Add a setter if you need to manually update the atom elsewhere
  // set: ({set}, newValue) => {
  //   set(photoFilesAtom, newValue);
  // }
});
