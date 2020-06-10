// Require Axios
const axios = require('axios');

// Init Auth headers for use in axios requests
// ADD YOUR TOKEN - OR AN ERROR WILL BE THROWN
const headers = {
  'User-Agent': 'request',
  Authorization: `token YOUR_TOKEN_HERE`,
};

// Function for getting user information from github
// This information contains the count or public repos a user has
const getUserInfo = (user) => {
  return axios.get(`https://api.github.com/users/${user}`, { headers });
};

// Function to get repos of a user - returns 30 repos by default
// This function takes in a pageCount and page num to get repos from the github api
const getUserRepos = (user, perPage, pageNum) => {
  return axios.get(
    `https://api.github.com/users/${user}/repos?per_page=${perPage}&page=${pageNum}`,
    { headers }
  );
};

// Function to get every repo of a user
// This function calls the getUserInfo function to determine the users number of public repos
// .... next the function determines the number of pages needed to loop through, loops through them
// .... and returns an array with every repo of the user
const getAllRepos = (user) => {
  // Init an array to store all public repos get requests
  // For use in Promise.All later in the function
  const publicRepoPromises = [];

  // Variable used to hold the amount of public repos of the user
  let userPublicRepoCount = 0;

  // Get the user info to determine the amount of public repos
  getUserInfo(user)
    .then((results) => {
      // Get the count of public repos
      userPublicRepoCount = results.data.public_repos;
      // Set the per page limit of repos to return
      const perPage = 100;
      // Get the amount of pages we need to loop through to get all pages
      const numPages = Math.ceil(userPublicRepoCount / 100);

      // Loop through the pages and push the get request promises to the publicRepoPromises Array
      for (let i = 1; i <= numPages; i++) {
        publicRepoPromises.push(getUserRepos(user, perPage, i));
      }

      // Run a Promise.All to wait for all get requests to complete
      // Return the Promise.All for use in the next .then block
      return Promise.all(publicRepoPromises);
    })
    .then((allRepoData) => {
      // Do something with the repos here
      // Length should equal the public repo count of the user
      console.log('--------------------------------------');
      console.log('Amount of repos retrieved:', allRepoData[0].data.length);
      console.log('Amount of users public repos:', userPublicRepoCount);
      console.log('--------------------------------------');
    })
    .catch((err) => {
      // Log out any errors
      console.log(err);
    });
};

// Run the get all repos function
getAllRepos('zjayers');
