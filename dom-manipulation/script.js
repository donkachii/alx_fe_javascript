const defaultQuotes = [
  {
    text: "Life is not a problem to be solved, but a reality to be experienced",
    category: "Life",
  },
  {
    text: "Nothing is impossible. the word itself says i'm possible!",
    category: "Inspiration",
  },
  {
    text: "Everything you've ever waanted is sitting on the other side of fear",
    category: "Motivation",
  },
  {
    text: "Love is that condition in which the happiness of another person is essential to your own",
    category: "Love",
  },
  {
    text: "When friendships are real, they are not glass threads or frost work, but the solidest things we can know",
    category: "Friendship",
  },
  {
    text: "The family is where we are formed as people. every familt isa brick in the building of society",
    category: "Family",
  },
  {
    text: "Sometimes, when things are falling apart, they may actually be falling into place",
    category: "Positve",
  },
  { text: "A true friend is for ever a friend", category: "Friendship" },
  {
    text: "the happiness of your life depends on the quality of your thought.",
    category: "Insiration",
  },
  {
    text: "Life is never easy. there is work to be done and obligations to be met - obligations to truth, to justice, and to liberty",
    category: "Life",
  },
  { text: "Two are better than one", category: "Love" },
  {
    text: "The family is the test of freedom, because the family is the only thing that the free man makes for himself and by himself",
    category: "Family",
  },
  {
    text: "In every day, there are 1,440 minutes. That means we have 1,440 daily opportunities to makea positive impact",
    category: "Positve",
  },
];

let quotes = JSON.parse(localStorage.getItem("quotes")) || defaultQuotes;
const lastSelectedCategory =
  localStorage.getItem("lastSelectedCategory") || "all";
const serverUrl = "https://jsonplaceholder.typicode.com/posts"; // Mock server URL

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();
    const formattedQuotes = serverQuotes.map((quote) => ({
      text: quote.title, // using 'title' as text for simulation
      category: "Imported",
    }));
    quotes = mergeQuotes(quotes, formattedQuotes);
    saveQuotes();
    updateCategoryFilter();
    filterQuotes();
    notifyUser("Quotes synced with server!");
  } catch (error) {
    console.error("Failed to fetch quotes from server:", error);
  }
}

function mergeQuotes(localQuotes, serverQuotes) {
  const mergedQuotes = [...localQuotes];
  serverQuotes.forEach((serverQuote) => {
    const exists = localQuotes.some(
      (localQuote) => localQuote.text === serverQuote.text
    );
    if (!exists) {
      mergedQuotes.push(serverQuote);
    }
  });
  return mergedQuotes;
}

async function syncQuotes(quote) {
  try {
    const response = await fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quote),
    });
    const newQuote = await response.json();
    console.log("Quote posted to server:", newQuote);
  } catch (error) {
    console.error("Failed to post quote to server:", error);
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  const filteredQuotes = filterQuotesArray();
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  displayQuote(randomQuote);
}

function displayQuote(quote) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = ""; // Clear previous quote
  const quoteElement = document.createElement("div");
  quoteElement.innerHTML = `<p>${quote.text}</p><p><em>Category: ${quote.category}</em></p>`;
  quoteDisplay.appendChild(quoteElement);
}

function createAddQuoteForm() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    updateCategoryFilter();
    syncQuotes(newQuote);

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("New quote added successfully!");
  } else {
    alert("Please enter both the quote and the category.");
  }
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (
        Array.isArray(importedQuotes) &&
        importedQuotes.every((q) => q.text && q.category)
      ) {
        quotes.push(...importedQuotes);
        saveQuotes();
        updateCategoryFilter();
        alert("Quotes imported successfully!");
      } else {
        alert(
          "Invalid JSON format. Make sure your JSON contains an array of quotes with 'text' and 'category' fields."
        );
      }
    } catch (e) {
      alert("Error parsing JSON file. Please check the file format.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function populateCategories() {
  const selectedCategory = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map((q) => q.category))];

  selectedCategory.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    selectedCategory.appendChild(option);
  });

  selectedCategory.value = lastSelectedCategory;
}

function filterQuotesArray() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  if (selectedCategory === "all") {
    return quotes;
  } else {
    return quotes.filter((quote) => quote.category === selectedCategory);
  }
}

function filterQuotes() {
  localStorage.setItem(
    "lastSelectedCategory",
    document.getElementById("categoryFilter").value
  );
  const filteredQuotes = filterQuotesArray();
  if (filteredQuotes.length > 0) {
    displayQuote(filteredQuotes[0]);
  } else {
    document.getElementById("quoteDisplay").innerHTML =
      "<p>No quotes available in this category.</p>";
  }
}

function notifyUser(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  setTimeout(() => {
    notification.textContent = "";
  }, 3000);
}

// Event listener for showing a new quote
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initial display of a random quote
showRandomQuote();
populateCategories();
filterQuotes();
fetchQuotesFromServer();

setInterval(fetchQuotesFromServer, 60000); // Periodically fetch quotes every 60 seconds
