let getLatestJobsButton = document.querySelector('#get-latest-jobs');

const handleGetLatestJobs = (e) => {
    console.log("Clicked getLatestJobsButton");
    let loader = document.querySelector('.loader');
    let gridContainer = document.querySelector('.grid-container');
    loader.classList.add("show");
    gridContainer.classList.add("hide");
    // gridContainer.styles.display = "none";
}

getLatestJobsButton.addEventListener('click', handleGetLatestJobs);