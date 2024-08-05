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

const quotes = JSON.parse(localStorage.getItem("quotes")) || defaultQuotes;

// to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteElement = document.createElement("div");
  quoteElement.innerHTML = `
           <p>${randomQuote.text}</p><p><em>Category: ${randomQuote.category}</em></p>
        `;
  quoteDisplay.appendChild(quoteElement);
  //   quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>Category: ${randomQuote.category}</em></p>`;
}

// to add a new quote
function createAddQuoteForm() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes(); // Save the updated quotes to local storage
    updateCategoryFilter();

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
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
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

function updateCategoryFilter() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map((q) => q.category))];

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  categoryFilter.value = lastSelectedCategory;
}

function filterQuotesArray() {
  const categoryFilter = document.getElementById("categoryFilter").value;
  if (categoryFilter === "all") {
    return quotes;
  } else {
    return quotes.filter((quote) => quote.category === categoryFilter);
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

// Event listener for showing a new quote
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initial display of a random quote
showRandomQuote();
updateCategoryFilter();
filterQuotes();
