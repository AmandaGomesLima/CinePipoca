function setLista(responseText) {
  var json = JSON.parse(responseText);
  var $filmeDetalhe = $('.pesquisa-lista');
  
  $.each(json.results, function(index, value) {
    let item = '<div class="row">' +
                  '<div class="col-12 col-md-2 d-sm-none d-md-block">' +
                    '<a href="https://www.themoviedb.org/movie/' + value.id + '">' +
                      '<img class="img-fluid" src="https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + value.poster_path + '" alt="' + value.title + '">' +
                    '</a>' +
                  '</div>' +
                  '<div class="col-12 col-md-10">' +
                    '<h3 class="titulo text-warning">' + 
                      '<a href="https://www.themoviedb.org/movie/' + value.id + '">' + value.title + '</a>' +
                    '</h3>' +
                    '<p class="release">' + getDataAtualFormatada(value.release_date) + '</p>' +
                    '<p class="overview">' + value.overview + '</p>' +
                  '</div>' +
                '</div>';
    $filmeDetalhe.append(item);
  });
}

$(function() {
  var queryString = getUrlVars();
  theMovieDb.search.getMovie({'language': 'pt-BR', 'query': queryString.p}, setLista, setError);

  $().html(queryString.p);
});