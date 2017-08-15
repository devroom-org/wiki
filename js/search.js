---
---

var getText = function(path, success, error) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				if (success)
					success(xhr.responseText);
			} else {
				if (error)
					error(xhr);
			}
		}
	};
	xhr.open("GET", path, true);
	xhr.send();
}

var getParam = function(param) {
	var queryString = window.location.search.substring(1);
	queryString = queryString.replace(/\+/g, "%20");
	queryString = decodeURIComponent(queryString);
	var queries = queryString.split("&");
	for(var i in queries) {
		var pair = queries[i].split("=");
		if(pair[0] == param) {
			return pair[1];
		}
	}
	return null;
}

var onSearchLoad = function() {
	var filters = [];
	var query = getParam('query')
  filters.push(query);
	
	getText('{{ site.baseurl }}/search.json', function(data) {
		data = JSON.parse(data);
		var pages = filterPages(data, filters);
		if(pages.length == 0) {
			noResultsPage(query);
		} else {
			layoutResultsPage(query, pages);
		}
	});
	
}

var noResultsPage = function(query) {
	var header = document.getElementById("search-title");
	var container = document.getElementById("search-results");
	var desc = document.getElementById("search-description");
	header.innerHTML = "검색 결과 없음";
	desc.innerHTML = "'" + query + "'에 대한 검색 결과가 없습니다.";
}

var layoutResultsPage = function(query, pages) {
	var header = document.getElementById("search-title");
	var container = document.getElementById("search-results");
	var desc = document.getElementById("search-description");
  header.innerHTML = "검색 결과";
  desc.innerHTML = "'" + query + "'에 대한 검색 결과입니다.";
	for(var i in pages) {
		var page = pages[i];
		var li = document.createElement("li");
		li.innerHTML = ""
		+ '<a href="{{ site.baseurl }}/' + page.permalink + '">'
		+ page.title
		+ '</a>'
		+ ' ({{ site.baseurl }}' + page.permalink + ')';
		container.appendChild(li);
	}
}

var filterPages = function(pages, filters) {
	var result = [];
  
	pages.pop();
	for(var i in pages) {
		var page = pages[i];
		for(var i in filters) {
      var filter = filters[i];
      if(page.title.includes(filter) || page.permalink.includes(filter)) {
        if(page.title == filter) location.replace('{{ site.baseurl }}/' + page.permalink);
        if(!result.includes(page)) result.push(page);
      }
    }
	}
  
  result.sort(function(a, b) {
    var A = new LCS(filters[0], a.title);
    var B = new LCS(filters[0], b.title);
    const title = B.getLength() - A.getLength();
    A = new LCS(filters[0], a.permalink);
    B = new LCS(filters[0], b.permalink);
    const permalink = B.getLength() - A.getLength();
    if(Math.abs(permalink) >= Math.abs(title)) return permalink;
    else return title;
  });
	
	return result;
}

window.addEventListener('load', onSearchLoad);
