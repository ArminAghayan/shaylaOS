# Supabase Authentication Setup

This document explains how to set up Supabase authentication for the application.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project
3. Choose a name and password for your project
4. Wait for the project to be created (this may take a few minutes)

## 2. Set Up Authentication

1. In your Supabase dashboard, go to "Authentication" → "Settings"
2. Configure your authentication settings:
   - Enable the Email provider
   - Set minimum password length (recommended: 8 characters)
   - Configure any other settings as needed

## 3. Create Test Users

1. Go to "Authentication" → "Users"
2. Click "Add User"
3. Add test users with their email and password

## 4. Configure Environment Variables

1. In your Supabase project dashboard, go to "Settings" → "API"
2. Copy your Supabase URL and anon/public key
3. Update the `.env` file in your project:

```
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 5. Start Your Application

1. Run `npm start` to start your application
2. Try logging in with one of the users you created in Supabase

## Troubleshooting

- **Login not working**: Check that your Supabase URL and anon key are correctly set in the .env file
- **User cannot log in**: Verify the user exists in Supabase and the password is correct
- **API errors**: Check the browser console for specific error messages