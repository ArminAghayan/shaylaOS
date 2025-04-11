// Import all icons at the top
import userIcon from "../assets/user.png";
import searchComputerIcon from "../assets/search-computer.png";
import folderClosedIcon from "../assets/folder-closed.png";
import folderOpenIcon from "../assets/folder-open.png";
import wordpadIcon from "../assets/wordpad.png";

// Add Pacman icon import if using a new one
// import pacmanIcon from '../assets/pacman.png'; // Example

const welcome = {
  label: "Welcome",
  header: "Welcome to Github95",
  desktopIcon: "",
  desktopPosition: null,
  visibility: [true, true], // eg [button visible (show button), window visible (show window)]
};
const user = {
  label: "Find Users",
  header: "Find Users - Search Github for users",
  desktopIcon: userIcon,
  desktopPosition: 1,
  visibility: [false, false],
};
const repos = {
  label: "Repositories",
  header:
    "Search Repositories - Find the latest, most starred, best reposirotories",
  desktopIcon: searchComputerIcon,
  desktopPosition: 0,
  visibility: [false, false],
};
const photoGallery = {
  label: "Photo Gallery",
  header:
    '<img src="' +
    folderOpenIcon +
    '" /> Photo Gallery',
  desktopIcon: folderClosedIcon,
  desktopPosition: 2,
  visibility: [false, false],
};

const about = {
  label: "About",
  header: "Notepad - About Github95.txt",
  desktopIcon: wordpadIcon,
  desktopPosition: 0,
  visibility: [false, false],
};
const documentGallery = {
  label: "Document Gallery",
  header:
    '<img src="' +
    folderOpenIcon +
    '" /> Exploring - My Documents',
  desktopIcon: folderClosedIcon,
  desktopPosition: 4,
  visibility: [false, false],
};

// Add the Pacman configuration
const pacman = {
  label: "Pacman",
  header: "Pacman Game",
  desktopIcon: searchComputerIcon, // Placeholder icon
  desktopPosition: 3, // Adjust position as needed
  visibility: [false, false],
};

// Add the Our Music configuration
const ourMusic = {
  label: "Our Music",
  header:
    '<img src="' +
    folderOpenIcon +
    '" /> Exploring - Our Music',
  desktopIcon: folderClosedIcon,
  desktopPosition: 5, // Adjust position as needed
  visibility: [false, false],
};

export const WINDOW_OBJ = {
  welcome,
  about,
  photoGallery,
  pacman,
  documentGallery,
  ourMusic, // Add ourMusic to WINDOW_OBJ
};

export const DEFAULT_WINDOW = {
  label: ">default<",
  header: "", // if empty, use label
  desktopIcon: false,
  visibility: [false, false],
};

// Used for recoil atom ids
export const USER = "user";
export const REPOS = "repos";

// copying the github api file tree structure for use in the trending window
export const TRENDING_TREE = [
  {
    name: "Photos",
    type: "tree",
    open: true, // my addition to have this tree open by default
    object: {
      entries: [
        {
          name: "2024",
          type: "blob",
        },
        {
          name: "2025",
          type: "blob",
        }
      ],
    },
  },
];

export const DOCUMENT_TREE = [
  {
    name: "Documents",
    type: "tree",
    open: true, // Open Documents tree by default
    object: {
      entries: [
        {
          name: "Photos", // Sub-folder example
          type: "tree",
          object: {
            entries: [
              { name: "2024", type: "blob" },
              { name: "2025", type: "blob" },
            ],
          },
        },
        // Add other top-level document folders here if needed
      ],
    },
  },
];

// Add MUSIC_TREE for the OurMusic component
export const MUSIC_TREE = [
  {
    name: "Music",
    type: "tree",
    open: true,
    object: {
      entries: [
        {
          name: "Rock",
          type: "blob",
        },
        {
          name: "Pop",
          type: "blob",
        },
        {
          name: "Jazz",
          type: "blob",
        },
        {
          name: "Classical",
          type: "blob",
        },
        {
          name: "Electronic",
          type: "blob",
        }
      ],
    },
  },
];
