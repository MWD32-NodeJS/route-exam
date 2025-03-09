
// AUTH
export const tokenSecrets = {

  user: {
    access: process.env.USER_ACCESS_TOKEN_SECRET,
    refresh: process.env.USER_REFRESH_TOKEN_SECRET,
  },

  admin: {
    access: process.env.ADMIN_ACCESS_TOKEN_SECRET,
    refresh: process.env.ADMIN_REFRESH_TOKEN_SECRET,
  },
  
  superAdmin: {
    access: process.env.SUPER_ADMIN_ACCESS_TOKEN_SECRET,
    refresh: process.env.SUPER_ADMIN_REFRESH_TOKEN_SECRET,
  },
  
  owner: {
    access: process.env.SUPER_SUPER_ADMIN_ACCESS_TOKEN_SECRET,
    refresh: process.env.SUPER_SUPER_ADMIN_REFRESH_TOKEN_SECRET,
  }

};
export const tokenTypes = {
  access: "access",
  refresh: "refresh"
};
export const tokenExpiry = {
  access: "1m", // 1min
  refresh: "7d" // 7 days
};

export const userRoles = {
  user: "user",
  admin: "admin",
  superAdmin: "superAdmin",
  owner: "owner"
};
export const userAuthorities = {
  user: 1,
  admin: 2,
  superAdmin: 3,
  owner: 4
};



export const uri = process.env.URI; // MongoDB
export const port = process.env.PORT; // Server
export const saltRounds = 12; // Hash
export const audience = process.env.GOOGLE_CLIENT_ID; // Google OAuth
export const encryptionSecret = process.env.ENCRYPTION_SECRET; // Encryption


export const email = {
  address: process.env.EMAIL_ADDRESS,
  password: process.env.EMAIL_PASSWORD
};


export const cloud = {
  name: process.env.CLOUD_NAME,
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET
};



export const colors = {
  
  fg: {
    auto: "green",
    red: "red",
    green: "green",
    blue: "blue",
    black: "black",
  },

  bg: {
    auto: "bgBlack",
    red: "bgRed",
    green: "bgGreen",
    blue: "bgBlue",
    black: "bgBlack"
  }

};



export const providers = {
  system: "system",
  google: "google"
};

export const genders = {
  male: "male",
  female: "female",
};



export const otpTypes = {
  confirmEmail: "confirmEmail",
  forgetPassword: "forgetPassword"
};

export const otpExpiry = {
  confirmEmail: 1000 * 60 * 10,
  forgetPassword: 1000 * 60 * 5
}; // 5min



export const jopLocations = {
  onsite: "onsite",
  remotely: "remotely",
  hybrid: "hybrid",
};

export const workingTimes = {
  partTime: "part-time",
  fullTime: "full-time",
};

export const seniorityLevel = {
  fresh: "fresh",
  junior: "junior",
  midLevel: "mid-level",
  senior: "senior",
  teamLead: "team-lead",
  cto: "CTO",
};


export const applicationStatus = {
  pending: "pending",
  accepted: "accepted",
  viewed: "viewed",
  consideration: "consideration",
  rejected: "rejected"
};



export const filesFilters = {

  types: {
    image: ["png", "jpeg"],
    video: ["mp4", "mkv"],
    audio: ["mp3", "wav"],
    document: ["pdf", "docx", "xlsx", "pptx", "txt"]
  },

  sizes: {
    image: 1024 * 1024 * 1.5, 
    video: 1024 * 1024 * 15,
    audio: 1024 * 1024 * 1.2,
    document: 1024 * 1024 * 12
  }

};
