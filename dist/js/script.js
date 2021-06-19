function getDataAtualFormatada(dataString){
  var data = new Date(dataString),
      dia  = data.getDate().toString().padStart(2, '0'),
      mes  = (data.getMonth()+1).toString().padStart(2, '0'),
      ano  = data.getFullYear();
  return dia + '/' + mes + '/' + ano;
}

function getMoviePorcentagem(vote_count, vote_average) {
  if (vote_count > 0) {
    return vote_average * 10;
  }

  return 100;
}

function getMoviePontuacao(vote_count, vote_average) {
  if (vote_count > 0) {
    return vote_average.toFixed(1);
  }

  return 'NR';
}

function getMovieCor(vote_count, vote_average) {
  if (vote_count <= 0) {
    return '';
  }
  if (vote_average < 4) {
    return 'red';
  }
  if (vote_average < 8) {
    return 'orange'
  }

  return 'green';
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

function setError(responseText) {
  console.log(responseText);
}