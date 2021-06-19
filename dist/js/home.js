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
                '<a class="carousel-titulo text-warning" href="filme.html?id=' + movie.id + '">' +
                  '<h2 class="pt-3 pt-lg-0">' + movie.title + '</h2>' +
                '</a>' +
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
                  '<svg viewBox="0 0 36 36" class="circular-chart ' + getMovieCor(movie.vote_count, movie.vote_average) + '" preserveAspectRatio="xMinYMin meet">' +
                    '<circle cx="18" cy="18" r="18" class="circle-bg"/>' +                    
                    '<path class="circle" stroke-dasharray="' + getMoviePorcentagem(movie.vote_count, movie.vote_average) + ', 100"' +
                    '  d="M18 2.0845' +
                    '    a 15.9155 15.9155 0 1 1 0 31.831' +
                    '    a 15.9155 15.9155 0 1 1 0 -31.831"' +
                    '/>' +
                    '<text x="18" y="20.35" class="pontuacao">' + getMoviePontuacao(movie.vote_count, movie.vote_average) + '</text>'+
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
    $('#destaque-filmes').empty();
    $('#destaque button').show();
    theMovieDb.discover.getMovies({'language': 'pt-BR', 'include_adult': 'false', 'with_genres': this.value}, setDestaques, setError);
  });
}

function setDestaques(responseText) {
  var $destaqueFilmes = $('#destaque-filmes');
  var json = JSON.parse(responseText);
  var qtdAtual = $destaqueFilmes.children().length;
  var qtdTotal = qtdAtual + 4;

  $.each(json.results.slice(qtdAtual, qtdTotal), function(index, value) {
    let filme = '<div class="col-6 col-sm-3 mb-3">' +
                  '<a href="filme.html?id=' + value.id + '">' +
                    '<img class="img-fluid" src="https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + value.poster_path + '" alt="' + value.title + '">' +
                  '</a>' +
                '</div>';
    $destaqueFilmes.append(filme);
  });

  if (qtdTotal >= 20) {
    $('#destaque button').hide();
  }
}

function setReviews(responseText) {
  var json = JSON.parse(responseText);

  $.each(json.results.slice(0,1), function(index, value) {
    theMovieDb.reviews.getById({'language': 'pt-BR', 'id': value.id}, setReview, setError);
  });
}
function setReview(responseText) {
  var json = JSON.parse(responseText);
  var $avaliacoes = $('.latest-reviews-items');
  var avaliacao = getReview(json);

  $avaliacoes.empty();
  $avaliacoes.append(avaliacao);
}

function getReview(review) {
  return 
    '<div class="col-lg-6 mb-4 mb-md-5 mb-lg-0">' +
      '<div class="d-flex flex-column flex-sm-row align-items-start ps-md-3">' +
        '<img class="rounded-circle mx-auto mb-3 mb-lg-0" src="https://around.createx.studio/img/demo/event-landing/speakers/01.jpg" alt="Ísis Brito" width="75">' +
        '<div class="ms-0 ms-sm-4">' +
          '<h3 class="h5 text-center text-sm-start">' + review.author + '</h3>' +
          '<p class="h6 text-secondary text-center text-sm-start">' + review.media_title + '</p>' +
          '<p class="fs-md mb-0">' + review.content + '</p>' +
          '<p class="text-warning mt-2 mb-0">' + getReviewStars(review) + '</p>' +
        '</div>' +
      '</div>' +
    '</div>';
}

function getReviewStars(review) {
  var stars = '',
      className = '',
      pontuacao = review.author_details.rating;

  for (i = 0; i < 10; i++) {
    className = 'bi-star';
    
    if (pontuacao >= 1) {
      className = 'bi-star-fill'
    } else if (pontuacao > 0) {
      className = 'bi-star-half'
    }

    stars += '<i class="' + className + '"></i>';
    pontuacao--;
  }

  return stars;
}

$(function() {
  $(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top - 56
    }, 500);
  });

  theMovieDb.discover.getMovies({'language': 'pt-BR', 'certification_country': 'BR','ott_region': 'BR','region': 'BR','release_date.gte': '2021-06-23','release_date.lte': '2021-07-15','show_me': '0','sort_by': 'popularity.desc','vote_average.gte': '0','vote_average.lte': '10','vote_count.gte': '0','with_release_type': '3','with_runtime.gte': '0','with_runtime.lte': '400'}, setLancamentos, setError);
  theMovieDb.genres.getMovieList({'language': 'pt-BR'}, setGeneros, setError);
  theMovieDb.discover.getMovies({'language': 'pt-BR', 'include_adult': 'false'}, setDestaques, setError);

  $('#destaque button').on('click', function() {
    let genero = $('#destaque-generos').val();
    theMovieDb.discover.getMovies({'language': 'pt-BR', 'include_adult': 'false', 'with_genres': genero}, setDestaques, setError);
  });
});
