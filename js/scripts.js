
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
       return $.ajax(apiUrl, {datatype: 'json'}).then(function (response){
         response.results.forEach(function (item){
           var pokemon = {
             name: item.name,
             detailsUrl: item.url,
           };
           add(pokemon);
         })
       });
  };



  function loadDetails(item) {
      var url = item.detailsUrl;
      return $.ajax(url, {datatype: 'json'}).then(function (response) {
        response.results.then(function (details){
          item.imageUrl = details.sprites.front_default;
          item.height = details.height;
          item.types = Object.keys(details.types);
        });
    });
  };

  return {
    add: add,
    getAll: getAll,
    loadList: loadList,
    loadDetails: loadDetails,
  };
})();

function addListItem(pokemon){
  var $entry = $('<li class = "button">'+pokemon.name+'</li>');
  $entry.on('click', function (event){
    showDetails(pokemon);
  });
  $('.pokedex-list').append($entry);
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
    console.log(pokemon.name)

    var closeButton = $('<div class = "closeButton" >Close</div>');
    closeButton.add('modal-close');
    closeButton.on('click', hideModal);

    var nameElement = $('<h1>' + pokemon.name + '</h1>');
    //nameElement.innerText = pokemon.name;

    var heightElement = $('<p>' + pokemon.height +'</p>');
    //heightElement.innerText = pokemon.height;

    var imageElement = $('<img>'+pokemon.imageUrl+'</img>');
    //imageElement.setAttribute('src', pokemon.imageUrl);

    modal.append(closeButton);
    modal.append(nameElement);
    modal.append(heightElement);
    modal.append(imageElement);
    modalContainer.append(modal);

    modalContainer.add('is-visible');

  function hideModal(){
    modalContainer.remove('is-visible');
  };

  $('.button').on('click', () => {
    showModal(pokemon.name, pokemon.height, pokemon.imageUrl);
  });

  $(window).on('keydown', (e) => {
      if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
        hideModal();
      }
    });

    modalContainer.on('click', (e) => {
      var target = e.target;
      if (target === modalContainer) {
        hideModal();
      }
    });
  }

    return {
      showModal: showModal
    }
  })();
