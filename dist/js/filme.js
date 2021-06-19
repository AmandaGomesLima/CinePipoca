function setFilmeDetalhes(responseText) {
  var movie = JSON.parse(responseText);
  var $filmeDetalhe = $('#filme-detalhes');
  var $filmeElenco = $('#filme-elenco');
  var $filmeRecomendacoes = $('#filme-relacionados');
      
  $filmeDetalhe.find('.poster').attr('src', 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + movie.poster_path)
                               .attr('alt', movie.title);
  $filmeDetalhe.find('.titulo').html(movie.title);
  $filmeDetalhe.find('.genres').html(getBadgeGeneros(movie.genres));
  $filmeDetalhe.find('.facts').html(getInfos(movie));
  $filmeDetalhe.find('.overview').html(movie.overview);
  $filmeDetalhe.find('.director > .fw-bold').html(getDiretores(movie.credits.crew));
  $filmeDetalhe.find('.screenplay > .fw-bold').html(getRoteiro(movie.credits.crew));
  $filmeDetalhe.find('.user-vote').html(getPontuacao(movie.vote_count, movie.vote_average));
  $filmeElenco.find('.elenco').html(getElenco(movie.credits.cast));
  $filmeRecomendacoes.find('.filme-relacionados-lista').html(getRecomendacoes(movie.recommendations.results));
}

function getBadgeGeneros(generos) {
  var badges = '';

  $.each(generos, function(index, value) {
    badges += '<span class="badge bg-genre">' + value.name + '</span> ';
  });

  return badges;
}

function getInfos(movie) {
  var release = movie.release_dates.results.find(function (element) {
    return element.iso_3166_1 == 'BR';
  });

  var horas = Math.floor(movie.runtime / 60);          
  var minutos = movie.runtime % 60;

  return '<span class="certification">' + release.release_dates[0].certification + '</span> ' + 
         '<span class="release">' + getDataAtualFormatada(release.release_dates[0].release_date) + '</span> ' +
         '<span class="runtime">' + horas + 'h ' + minutos + 'm</span>';
}

function getDiretores(creditos) {
  var diretores = [];

  $.each(creditos, function(index, value) {
    if (value.job === 'Director') {
      diretores.push(value.name);
    }
  });

  return diretores.join(', ');
}

function getRoteiro(creditos) {
  var roteiro = [];

  $.each(creditos, function(index, value) {
    if (value.job === 'Screenplay') {
      roteiro.push(value.name);
    }
  });

  return roteiro.join(', ');
}

function getPontuacao(vote_count, vote_average) {
  return '<svg viewBox="0 0 36 36" class="circular-chart ' + getMovieCor(vote_count, vote_average) + '" preserveAspectRatio="xMinYMin meet">' +
          '<circle cx="18" cy="18" r="18" class="circle-bg"/>' +                    
          '<path class="circle" stroke-dasharray="' + getMoviePorcentagem(vote_count, vote_average) + ', 100"' +
          '  d="M18 2.0845' +
          '    a 15.9155 15.9155 0 1 1 0 31.831' +
          '    a 15.9155 15.9155 0 1 1 0 -31.831"' +
          '/>' +
          '<text x="18" y="20.35" class="pontuacao">' + getMoviePontuacao(vote_count, vote_average) + '</text>'+
        '</svg>';
}

function getElenco(atores) {
  var elenco = '';
  
  $.each(atores.slice(0,10), function(index, value) {
    elenco += '<li class="card">' +
                '<img loading="lazy" class="profile" src="https://www.themoviedb.org/t/p/w138_and_h175_face/' + value.profile_path + '" alt="' + value.name + '">' +
                '<p class="actor">' + value.name + '</p>' +
                '<p class="character">' + value.character + '</p>' +
              '</li>';
  });

  return elenco;
}

function getRecomendacoes(recomendacoes) {
  var filmes = '';
  
  $.each(recomendacoes.slice(0,6), function(index, value) {
    let classe = (index < 5) ? 'mb-3 mb-sm-0' : '';
    filmes += '<div class="col-6 col-sm-2 ' + classe + '">' +
                '<a href="filme.html?id=' + value.id + '">' +
                  '<img class="img-fluid" src="https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + value.poster_path + '" alt="' + value.title + '">' +
                '</a>' +
              '</div>';
  });

  return filmes;
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$(function() {
  var queryString = getUrlVars();
  theMovieDb.movies.getById({'language': 'pt-BR', 'append_to_response': 'release_dates,credits,recommendations', 'id': queryString.id}, setFilmeDetalhes, setError);
});