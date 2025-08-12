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
  } catch (error) {
    lyricsDiv.innerHTML =
      '<p class="text-red-400">Error loading lyrics. Please try again.</p>';
    console.error("Lyrics error:", error);
  }
});

[artistInput, songInput].forEach((input) => {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });
});
