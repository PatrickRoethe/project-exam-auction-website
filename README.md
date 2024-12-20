# Auction House - Frontend

## Overview

This project is the frontend for an auction website where users can list items for bidding, place bids, and view auction details. It interacts with an existing backend API that manages user authentication, item listings, and bids.

## Features

- **User Authentication**: 
  - Register with a valid stud.noroff.no email.
  - Login and logout functionality.
  - Update avatar and view total credits.
  
- **Listing Auctions**:
  - Create auction listings with title, description, deadline, and media (images).
  - Edit existing listings.

- **Bidding**:
  - Registered users can place bids on items.
  - View current bids and the highest bid on each listing.

- **Search & Sort**:
  - Search through auction listings.
  - Sort listings by "Ending Soon" or "Highest Bids".

## Requirements

- **API**: The frontend interacts with the Auction API provided in the Noroff API documentation.
- **Technologies**:
  - **HTML/CSS/JS** for frontend development.
  - **Bootstrap 5** for responsive design and UI components.
  - **SASS/SCSS** for styling.
  - **Vite** for development and build optimization.
  
- **Dependencies**:
  - `sass` for SCSS compilation.
  - `eslint` for JavaScript best practices.
  - `bootstrap` for SCSS files.
  - `vite` for development server and build optimization.

## Setup

1. Clone the repository.
2. Install the necessary dependencies:
3. npm install
4. npm run dev ( run the development server)

## Structure

- **`/src`**: All source files
  - **`/css`**: SCSS files and compiled CSS
  - **`/js`**: JavaScript files handling logic (e.g., user login, registration, auction details)
  - **`/html`**: HTML templates for pages like home, profile, login, register, etc.



## User Stories Implemented
- Users can register and login with a stud.noroff.no email.
- Registered users can create, edit, and view auction listings.
- Registered users can place bids on other listings and see their bids.
- Unregistered users can search and view auction listings.
- User can logout

## Future Improvements
- Enhance styling
- Better error handling ( more ifo to user)
- Click from viewed listing on profile, to your listing ( navigation)
- Pagenization for home page
- Enhance overall styling
- Styling for avatar, and better styling for profile page

## Learning points
- Plan better and start earlier.
- Be more consistent with the workflow.
- Improve time management for smoother progress.
- Bad planning takes away from the enjoyment of the procsess and also learning.

## Link to deployment
https://project-exam-auction-website.netlify.app/

## Link to figma low fidelity design files
https://www.figma.com/design/FZjayAF5vogRflDPTXCuZT/Auction-website-low-fidelity-design?m=auto&t=wEOCPU48sma0PSkI-1
