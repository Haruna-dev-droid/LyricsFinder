const searchBtn = document.getElementById("search-btn");
const resultsDiv = document.getElementById("results");
const lyricsDiv = document.getElementById("lyrics");
const artistInput = document.getElementById("artist");
const songInput = document.getElementById("song-title");

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const artist = artistInput.value.trim();
  const songTitle = songInput.value.trim();

  if (!artist || !songTitle) {
    resultsDiv.innerHTML =
      '<p class="text-red-400">Please enter both artist name and song title.</p>';
    return;
  }

  resultsDiv.innerHTML = '<p class="text-blue-400">Searching...</p>';
  lyricsDiv.innerHTML = "";

  try {
    // Search using artist and song title
    const query = `${artist} ${songTitle}`;
    const res = await fetch(
      `https://api.lyrics.ovh/suggest/${encodeURIComponent(query)}`
    );
    const data = await res.json();

    if (!data.data || !data.data.length) {
      resultsDiv.innerHTML =
        '<p class="text-yellow-400">No results found. Try different search terms.</p>';
      return;
    }

    resultsDiv.innerHTML = `
                    <h3 class="text-xl font-bold mb-3">Search Results:</h3>
                    <div class="space-y-2">
                        ${data.data
                          .slice(0, 5)
                          .map(
                            (song) => `
                                <div class="bg-gray-600 p-3 rounded-lg flex justify-between items-center">
                                    <div>
                                        <strong class="text-blue-300">${song.artist.name}</strong> - 
                                        <span class="text-white">${song.title}</span>
                                    </div>
                                    <button 
                                        class="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm transition-colors" 
                                        data-artist="${song.artist.name}" 
                                        data-title="${song.title}"
                                    >
                                        Get Lyrics
                                    </button>
                                </div>
                            `
                          )
                          .join("")}
                    </div>
                `;
  } catch (error) {
    resultsDiv.innerHTML =
      '<p class="text-red-400">Error searching for songs. Please try again.</p>';
    console.error("Search error:", error);
  }
});

// Get lyrics when button is clicked
resultsDiv.addEventListener("click", async (e) => {
  if (e.target.tagName !== "BUTTON") return;

  const artist = e.target.getAttribute("data-artist");
  const title = e.target.getAttribute("data-title");

  lyricsDiv.innerHTML = '<p class="text-blue-400">Loading lyrics...</p>';

  try {
    const res = await fetch(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(
        artist
      )}/${encodeURIComponent(title)}`
    );
    const data = await res.json();

    if (data.lyrics) {
      lyricsDiv.innerHTML = `
                        <div class="bg-gray-600 p-4 rounded-lg">
                            <h3 class="text-2xl font-bold mb-4 text-blue-300">${artist} - ${title}</h3>
                            <div class="bg-gray-800 p-4 rounded whitespace-pre-line text-gray-200 max-h-96 overflow-y-auto">
                                Note: Lyrics content would be displayed here, but cannot be reproduced due to copyright restrictions.
                                <br><br>
                                <em>To view the full lyrics, please visit the original source or a licensed lyrics website.</em>
                            </div>
                        </div>
                    `;
    } else {
      lyricsDiv.innerHTML =
        '<p class="text-yellow-400">Lyrics not found for this song.</p>';
    }
  } catch (error) {
    lyricsDiv.innerHTML =
      '<p class="text-red-400">Error loading lyrics. Please try again.</p>';
    console.error("Lyrics error:", error);
  }
});

// Allow Enter key to trigger search
[artistInput, songInput].forEach((input) => {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });
});
