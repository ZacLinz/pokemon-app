
var pokemonRepository = (function () {
  var pokemonArray =[];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function add(pokemon){
    pokemonArray.push(pokemon);
  }

  function getAll(){
    return pokemonArray
  }

  function loadList(item) {
       $.ajax(apiUrl, {datatype: 'json'}).then(function (response){
         console.log(response.responeJSON);
       });
  };



  function loadDetails(item) {
      var url = item.detailsUrl;
      return fetch(url).then(function (response) {
          return response.json();
      }).then(function (details) {
          item.imageUrl = details.sprites.front_default;
          item.height = details.height;
          item.types = Object.keys(details.types);
      }).catch(function (e) {
          console.error(e);
      });
  }

  return {
    add: add,
    getAll: getAll,
    loadList: loadList,
    loadDetails: loadDetails,
  };
})();

function addListItem(pokemon){
  var $entry = $('<li></li>');
  var pokeName = $('<button>' + pokemon.name + '</button>')
  $('.pokedex-list').append($entry);
  $($entry).append(pokeName);
  $($entry).on('click', function (event){
    showDetails(pokemon);
  });
};

function showDetails(pokemon){
  pokemonRepository.loadDetails(pokemon).then(function (){
      modalControls.showModal(pokemon);
  });
};

pokemonRepository.loadList().then(function() {
pokemonRepository.getAll().forEach(function(pokemon){
  addListItem(pokemon);
  });
});


var modalControls = (function(){
  var modalContainer = $('modal-container');

  function showModal(pokemon) {
    var modal = $('<div class = "modal"></div>');

    var closeButton = $('<div class = closeButton>Close</div>');
    closeButton.add('modal-close');
    closeButton.on('click', hideModal);

    var nameElement = $('<h1>' + pokemon.name + '</h1>');
    //nameElement.innerText = pokemon.name;

    var heightElement = $('<p>' + pokemon.height +'</p>');
    //heightElement.innerText = pokemon.height;

    var imageElement = $('<img>'+ pokemon.imageUrl + '</img>');
    //imageElement.setAttribute('src', pokemon.imageUrl);

    modal.append(closeButton);
    modal.append(nameElement);
    modal.append(heightElement);
    modal.append(imageElement);
    $(modalContainer).append(modal);

    $(modalContainer).add('is-visible');

  function hideModal(){
    $($modalContainer).remove('is-visible');
  };

  $('button').on('click', () => {
    showModal(pokemon.name, pokemon.height, pokemon.imageUrl);
  });

  $(window).on('keydown', (e) => {
      if (e.key === 'Escape' && $modalContainer.classList.contains('is-visible')) {
        hideModal();
      }
    });

    $(modalContainer).on('click', (e) => {
      var target = e.target;
      if (target === $modalContainer) {
        hideModal();
      }
    });
  }

    return {
      showModal: showModal
    }
  })();
