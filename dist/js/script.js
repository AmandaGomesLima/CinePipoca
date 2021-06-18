function setLancamentos(responseText) {
  var $carouselFilmes = $('#slidesMovieReleases .carousel-inner');
  var $carouselFilmesIndicators = $('.carousel-indicators');
  var json = JSON.parse(responseText);
  
  $carouselFilmes.empty();
  $carouselFilmesIndicators.empty();

  $.each(json.results.slice(0,3), function(index, value) {
    let filme = getCarouselItem(value);
    let filmeIndicador = getCarouselItemIndicator(index);
    
    $carouselFilmes.append(filme);
    $carouselFilmesIndicators.append(filmeIndicador);
    
    theMovieDb.movies.getVideos({'language': 'pt-BR', 'id': value.id}, setLancamentoVideo, setError);
    theMovieDb.movies.getCredits({'language': 'pt-BR', 'id': value.id}, setCreditos, setError)
  });

  $carouselFilmes.children().eq(0).addClass('active');
  $carouselFilmesIndicators.children().eq(0).addClass('active');

  setCarouselItemsHeight();
}

function setLancamentoVideo(responseText) {
  var json = JSON.parse(responseText);
  var $carouselFilmes = $('#slidesMovieReleases .carousel-inner [data-movie-id="' + json.id + '"] .carousel-video');

  $.each(json.results, function(index, value) {
    let videoUrl = 'https://www.youtube.com/embed/' + value.key + '?rel=0&modestbranding=1&autohide=1&showinfo=0';
    $carouselFilmes.attr('src', videoUrl);
  });
}

function setCreditos(responseText) {
  var json = JSON.parse(responseText);
  var diretores = [];
  var roteiro = [];
  var elenco = [];
  var $carouselCreditos = $('#slidesMovieReleases .carousel-inner [data-movie-id="' + json.id + '"] .carousel-credits');

  $.each(json.crew, function(index, value) {
    if (value.job === 'Director') {
      diretores.push(value.name);
    }
    else if (value.job === 'Screenplay') {
      roteiro.push(value.name);
    }
  });

  $.each(json.cast.slice(0,4), function(index, value) {
    elenco.push(value.name);
  });

  var text = $carouselCreditos.html();
  text = text.replace('{DIRETORES}', diretores.join(', '));
  text = text.replace('{ROTEIRO}', roteiro.join(', '));
  text = text.replace('{ELENCO}', elenco.join(', '));
  $carouselCreditos.html(text);
}

function setCarouselItemsHeight() {
  var items = $('#slidesMovieReleases .carousel-item'),
      heights = [],
      tallest;

  items.each(function() {
    $(this).css('min-height', '0'); //reset min-height
  }); 

  items.each(function() { //add heights to array
      heights.push($(this).height()); 
  });
  tallest = Math.max.apply(null, heights); //cache largest value
  items.each(function() {
      $(this).css('min-height', tallest + 'px');
  });
}

function getCarouselItem(movie) {
  var carouselItem =
    '<div class="carousel-item" data-movie-id="' + movie.id + '">' +
      '<div class="container-fluid">' +
        '<div class="row">' +
          '<div class="col-lg-6 pt-lg-3">' +
            '<div class="ratio ratio-16x9">' +
              '<iframe class="carousel-video" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
            '</div>' +
          '</div>' +
          '<div class="col-lg-6">' +
            '<div class="row">' +
              '<div class="col-12">' +
                '<h2 class="text-warning pt-3 pt-lg-0">' + movie.title + '</h2>' +
              '</div>' +
              '<div class="col-md-6 col-lg-12">' +
                '<p>' + movie.overview + '</p>' +
              '</div>' +
              '<div class="col-md-6 col-lg-12">' +
                '<div class="carousel-credits lh-1">' +
                  '<p><span class="fw-bold">Diretor(a):</span> {DIRETORES}</p>' +
                  '<p><span class="fw-bold">Roteiro:</span> {ROTEIRO}</p>' +
                  '<p><span class="fw-bold">Elenco:</span> {ELENCO}</p>' +
                  '<p><span class="fw-bold">Estreia:</span> ' + getDataAtualFormatada(movie.release_date) + '</p>' +
                '</div>' +
                '<div class="carousel-rate fw-bold">' +
                '<svg viewBox="0 0 36 36" class="circular-chart ' + getMovieCor(movie) + '" preserveAspectRatio="xMinYMin meet">' +
                  '<circle cx="18" cy="18" r="18" class="circle-bg"/>' +                    
                  '<path class="circle" stroke-dasharray="' + getMoviePorcentagem(movie) + ', 100"' +
                  '  d="M18 2.0845' +
                  '    a 15.9155 15.9155 0 1 1 0 31.831' +
                  '    a 15.9155 15.9155 0 1 1 0 -31.831"' +
                  '/>' +
                  '<text x="18" y="20.35" class="pontuacao">' + getMoviePontuacao(movie) + '</text>'+
                '</svg>' +
              '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

    return carouselItem;
}

function getCarouselItemIndicator(index) {
  return '<button type="button" data-bs-target="#slidesMovieReleases" data-bs-slide-to="' + index + '" aria-current="true" aria-label="Slide ' + index + '"></button>';
}

function getDataAtualFormatada(dataString){
  var data = new Date(dataString),
      dia  = data.getDate().toString().padStart(2, '0'),
      mes  = (data.getMonth()+1).toString().padStart(2, '0'),
      ano  = data.getFullYear();
  return dia + '/' + mes + '/' + ano;
}

function getMoviePorcentagem(movie) {
  if (movie.vote_count > 0) {
    return movie.vote_average * 10;
  }

  return 100;
}

function getMoviePontuacao(movie) {
  if (movie.vote_count > 0) {
    return movie.vote_average.toFixed(1);
  }

  return 'NR';
}

function getMovieCor(movie) {
  if (movie.vote_count <= 0) {
    return '';
  }
  if (movie.vote_average < 40) {
    return 'red';
  }
  if (movie.vote_average < 80) {
    return 'orange'
  }

  return 'green';
}

function setGeneros(responseText) {
  var $destaqueGeneros = $('#destaque-generos');
  var json = JSON.parse(responseText);
  var opcaoTodos = $destaqueGeneros.find('option').eq(0).clone()
  
  $destaqueGeneros.empty();
  $destaqueGeneros.append(opcaoTodos);

  $.each(json.genres, function(index, value) {
    $destaqueGeneros
      .append($("<option></option>")
      .attr("value", value.id)
      .text(value.name)); 
  });

  $destaqueGeneros.on('change', function() {
    theMovieDb.discover.getMovies({'language': 'pt-BR', 'include_adult': 'false', 'with_genres': this.value}, setDestaques, setError);
  });
}

function setDestaques(responseText) {
  var $destaqueFilmes = $('#destaque-filmes');
  var json = JSON.parse(responseText);

  $.each(json.results.slice(0,4), function(index, value) {
    let $filme = $destaqueFilmes.find('div').eq(index);
    $filme.find('a').attr('href', 'filme.html?id=' + value.id);
    $filme.find('img')
      .attr('src', 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + value.poster_path)
      .attr('alt', value.title);
  });
}

function setError(responseText) {
  console.log(responseText);
}

$(function() {
  theMovieDb.discover.getMovies({'language': 'pt-BR', 'certification_country': 'BR','ott_region': 'BR','region': 'BR','release_date.gte': '2021-06-23','release_date.lte': '2021-07-15','show_me': '0','sort_by': 'popularity.desc','vote_average.gte': '0','vote_average.lte': '10','vote_count.gte': '0','with_release_type': '3','with_runtime.gte': '0','with_runtime.lte': '400'}, setLancamentos, setError);
  theMovieDb.genres.getMovieList({'language': 'pt-BR'}, setGeneros, setError);
  theMovieDb.discover.getMovies({'language': 'pt-BR', 'include_adult': 'false'}, setDestaques, setError);

  $(window).on('resize orientationchange', function () {
    setCarouselItemsHeight(); 
  });
});
