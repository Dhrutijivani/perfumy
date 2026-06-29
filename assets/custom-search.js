
document.addEventListener("DOMContentLoaded", function () 
{
  const toggleBtn = document.getElementById("search-toggle");
  const searchBox = document.getElementById("custom-search-box");
  const input = document.getElementById("customSearchInput");
  const resultsBox = document.getElementById("customSearchResults");
  //    const closeBtn = document.getElementById("closeSearch");

  // Toggle search box on icon click
    toggleBtn.addEventListener("click", function (e) 
    {
      e.stopPropagation(); // prevent bubbling
      if (searchBox.style.display === "block") 
      {
        searchBox.style.display = "none";
      } 
      else 
      {
        searchBox.style.display = "block";
        input.focus();
      }
    });

  // Close search box if click outside
    document.addEventListener("click", function (e) {
      if (
        searchBox.style.display === "block" &&
        !searchBox.contains(e.target) &&
        !toggleBtn.contains(e.target)
      ) 
      {
        searchBox.style.display = "none";
        input.value = "";
        resultsBox.innerHTML = "";
      }
    });


  // Predictive search fetch
    let timer;
    input.addEventListener("input", function () 
    {
      clearTimeout(timer);
      const query = this.value.trim();

      if (query.length < 1) 
      {
        resultsBox.innerHTML = "";
        return;
      }

      timer = setTimeout(() => 
      {
        fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=5`)
        .then((res) => res.json())
        .then((data) => {
          const products = data.resources.results.products;

            if (products.length === 0) 
            {
                resultsBox.innerHTML = `
                <div class="no-results"> <span>😔</span> No products found for "<strong>${query}</strong>"</div>
                `;
                return;
            }

          resultsBox.innerHTML = products
            .map(
              (p) => `
              <a href="${p.url}" class="result-item">
                <img src="${p.image}" alt="${p.title}" />
                <span>${p.title}</span>
              </a>
            `
            )
            .join("");
        });
      }, 300);
  });
});
