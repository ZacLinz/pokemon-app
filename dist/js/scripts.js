var pokemonRepository = (function() {
  var pokemonArray = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  function add(pokemon) {
    pokemonArray.push(pokemon);
  }
  function getAll() {
    return pokemonArray;
  }
  function loadList(item) {
    return $.ajax(apiUrl, { datatype: "json" }).then(function(response) {
      response.results.forEach(function(item) {
        var pokemon = { name: item.name, detailsUrl: item.url };
        add(pokemon);
      });
    });
  }
  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url, { datatype: "json" }).then(function(response) {
      item.imageUrl = response.sprites.front_default;
      item.height = response.height;
      item.types = Object.keys(response.types);
    });
  }
  return {
    add: add,
    getAll: getAll,
    loadList: loadList,
    loadDetails: loadDetails
  };
})();
function addListItem(pokemon) {
  var $entry = $('<li class = "button">' + pokemon.name + "</li>");
  $entry.on("click", function(event) {
    showDetails(pokemon);
  });
  $(".pokedex-list").append($entry);
}
function showDetails(pokemon) {
  pokemonRepository.loadDetails(pokemon).then(function() {
    modalControls.showModal(pokemon);
  });
}
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    addListItem(pokemon);
  });
});
var modalControls = (function() {
  var modalContainer = $(".modal-container");
  function showModal(pokemon) {
    modalContainer.empty();
    var modal = $('<div class = "modal"></div>');
    var closeButton = $('<button class = "modal-close" >Close</div>').on(
      "click",
      hideModal
    );
    var nameElement = $("<h1>" + pokemon.name + "</h1>");
    var heightElement = $("<p>" + pokemon.height + "</p>");
    var imageElement = $("<img src=" + pokemon.imageUrl + " />");
    modal
      .append(closeButton)
      .append(nameElement)
      .append(heightElement)
      .append(imageElement);
    modalContainer.append(modal).addClass("is-visible");
  }
  function hideModal() {
    modalContainer.removeClass("is-visible");
  }
  $("li").on("click", () => {
    showModal(pokemon.name, pokemon.height, pokemon.imageUrl);
  });
  $(window).keydown(function(e) {
    if (e.key === "Escape" && modalContainer.hasClass("is-visible")) {
      hideModal();
    }
  });
  modalContainer.click(function(e) {
    var target = e.target;
    if (target.classList.contains("is-visible")) {
      hideModal();
    }
  });
  return { showModal: showModal };
})();
