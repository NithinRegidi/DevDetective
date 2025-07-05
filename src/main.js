const url = "https://api.github.com/users/";  // Base URL for GitHub API
const get = (element) => document.getElementById(`${element}`);  // Helper function to get DOM elements by ID

// DOM Element References
const input = get("input");  // Reference to search input field
const btn = get("btn");      // Reference to search button

console.log("Search results:");
console.log("[1]");
console.log("Attached URL: " + url);

//adding event listener to the button 
btn.addEventListener('click', () => {
    if(input !== ""){
        getUserData(url + input.value);
    }
});

// Keydown event for input field (Enter key detection)
input.addEventListener('keydown', (e) => {
    if(e.key === "Enter"){  // Check if Enter key was pressed
        if(input !== ""){
            getUserData(url + input.value);
        }
    }
}, false);

//getUserData() API Fetch Function
// it is an API so we use Async and Await
async function getUserData(gitUrl) {
    try {
        console.log("Fetching data from:", gitUrl);
        const response = await fetch(gitUrl);
        const data = await response.json(); // Parse response as JSON
        
        console.log("API Response:", data);

        if(!data){
            throw data; // Throw error if no data received
        }

        updateProfile(data);    //if data is received show data 
    } catch (error) {
        console.error("Error fetching user data:", error);
        const noResults = get("noResults");
        noResults.style.scale = 1;
        setTimeout(() => {
            noResults.style.scale = 0;
        }, 2500);
    }
}


//Profile Update Function
function updateProfile(data){
    // const noResults = get("noResults"); // Get the noResults element
    noResults.style.scale = 0;

    if (data.message !== "Not Found") {
        
        // Helper function to handle null/empty values
        function checkNull(apiItem, domItem){
            if(apiItem === "" || apiItem === null){
                domItem.style.opacity = 0.5;
            domItem.previousElementSibling.style.opacity = 0.5;
            return false;
            }
            else{
                return true;
            }
        }

        // Get all DOM elements for profile data
        const userImage = get("userImage");
        const name = get("name");
        const username = get("username");
        const date = get("date");
        const repos = get("repos");
        const followers = get("followers");
        const following = get("following");
        const profileBio = get("profileBio");
        const location = get("location");
        const website = get("website");
        const twitter = get("twitter");
        const company = get("company");
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


        userImage.src = `${data.avatar_url}`;
        name.innerText = data?.name;
        username.innerText = `@${data?.login}`;
        username.href = data?.html_url;
        dateSegment = data?.created_at.split("T").shift().split("-");
        date.innerText = `Joined ${dateSegment[2]} ${month[dateSegment[1] - 1]} ${dateSegment[0]}`;

        profileBio.innerText = (data?.bio === null) ? "This Profile has no Bio" : data?.bio;

        repos.innerText = data?.public_repos;
        repos.href = data?.repos_url;
        followers.innerText = data?.followers;
        followers.href = data?.followers_url;
        following.innerText = data?.following;
        following.innerText = data?.following;

        location.innerText = checkNull(data?.location, location) ? data?.location : "Not Available";

        website.innerText = checkNull(data?.blog, website) ? data?.blog : "Not Available";

        website.href = checkNull(data?.blog, website) ? data?.blog : "#";

        twitter.innerText = checkNull(data?.twitter_username, twitter) ? data?.twitter_username : "Not Available";

        twitter.href = checkNull(data?.twitter_username, twitter) ? `https://twitter.com/${data?.twitter_username}` : "#";

        company.innerText = checkNull(data?.company, company) ? data?.company : "Not Available";

    }
    
    else {
        const noResults = get("noResults"); // Get the noResults element for error case
        noResults.style.scale = 1;
        setTimeout(() => {
            noResults.style.scale = 0;
        }, 2500);
    }
}


// Dark And Light Mode 
const modeBtn = get("modeBtn");
const modeText = get("modeText");
const modeIcon = get("modeIcon");
let darkMode = false;
const root = document.documentElement.style;

modeBtn.addEventListener("click", () => {

    if (darkMode === false) {
        enableDarkMode();
    }
    else {
        enableLightMode();
    }
});

function enableDarkMode() {
    root.setProperty("--lm-bg", "#141D2F");
    root.setProperty("--lm-bg-content", "#1E2A47");
    root.setProperty("--lm-text", "white");
    root.setProperty("--lm-text-alt", "white");
    root.setProperty("--lm-shadow-xl", "rgba(70,88,109,0.15)");
    modeText.innerText = "LIGHT";
    modeIcon.src = "./Images/sun-icon.svg";
    root.setProperty("--lm-icon-bg", "brightness(1000%)");
    darkMode = true;
    localStorage.setItem("dark-mode", true);

}

function enableLightMode() {
    root.setProperty("--lm-bg", "#F6F8FF");
    root.setProperty("--lm-bg-content", "#FEFEFE");
    root.setProperty("--lm-text", "#4B6A9B");
    root.setProperty("--lm-text-alt", "#2B3442");
    root.setProperty("--lm-shadow-xl", "rgba(70, 88, 109, 0.25)");
    modeText.innerText = "DARK";
    modeIcon.src = "./Images/moon-icon.svg";
    root.setProperty("--lm-icon-bg", "brightness(100%)");
    darkMode = false;
    localStorage.setItem("dark-mode", false);
}


// This code checks if the user's device has a preference for dark mode
const prefersDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

// Check if there is a value for "dark-mode" in the user's localStorage
if (localStorage.getItem("dark-mode") === null) {
    // If there is no value for "dark-mode" in localStorage, check the device preference
    if (prefersDarkMode) {
        // If the device preference is for dark mode, apply dark mode properties
        enableDarkMode();
    } else {
        // If the device preference is not for dark mode, apply light mode properties
        enableLightMode();
    }
} else {
    // If there is a value for "dark-mode" in localStorage, use that value instead of device preference
    if (localStorage.getItem("dark-mode") === "true") {
        // If the value is "true", apply dark mode properties
        enableDarkMode();
    } else {
        // If the value is not "true", apply light mode properties
        enableLightMode();
    }
}

getUserData(url + "google");



