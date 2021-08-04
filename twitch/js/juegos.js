$("#hora").click(function(e) {
  e.preventDefault();
  d3.selectAll("svg").remove();
  loadGamesHora();
});

$("#dia").click(function(e) {
  e.preventDefault();
  d3.selectAll("svg").remove();
  loadGamesDia();
});

$("#semana").click(function(e) {
  e.preventDefault();
  d3.selectAll("svg").remove();
  loadGamesSemana();
});

$("#mes").click(function(e) {
  e.preventDefault();
  d3.selectAll("svg").remove();
  loadGamesMes();
});

$("#todo").click(function(e) {
  e.preventDefault();
  d3.selectAll("svg").remove();
  loadGamesTodo();
});

let juegosArray = [];
var streamersArray =[];

const loadGamesHora = async () => {
  try {
      const res = await fetch('http://79.143.185.182:3000/api/games/now');
      juegosArray = await res.json();
      drawGraph(juegosArray, "now");
      const resStreamer = await fetch('http://79.143.185.182:3000/api/streamer/');
      streamersArray = await resStreamer.json();
  } catch (err) {
      console.error(err);
  }
};

const loadGamesDia = async () => {
  try {
      const res = await fetch('http://79.143.185.182:3000/api/games/one');
      juegosArray = await res.json();
      drawGraph(juegosArray, "one");
      const resStreamer = await fetch('http://79.143.185.182:3000/api/streamer/');
      streamersArray = await resStreamer.json();
  } catch (err) {
      console.error(err);
  }
};

const loadGamesSemana = async () => {
  try {
      const res = await fetch('http://79.143.185.182:3000/api/games/seven');
      juegosArray = await res.json();
      drawGraph(juegosArray, "seven");
      const resStreamer = await fetch('http://79.143.185.182:3000/api/streamer/');
      streamersArray = await resStreamer.json();
  } catch (err) {
      console.error(err);
  }
};

const loadGamesMes = async () => {
  try {
      const res = await fetch('http://79.143.185.182:3000/api/games/thirty');
      juegosArray = await res.json();
      drawGraph(juegosArray, "thirty");
      const resStreamer = await fetch('http://79.143.185.182:3000/api/streamer/');
      streamersArray = await resStreamer.json();
  } catch (err) {
      console.error(err);
  }
};

const loadGamesTodo = async () => {
  try {
      const res = await fetch('http://79.143.185.182:3000/api/games/all');
      juegosArray = await res.json();
      drawGraph(juegosArray, "all");
      const resStreamer = await fetch('http://79.143.185.182:3000/api/streamer/');
      streamersArray = await resStreamer.json();
  } catch (err) {
      console.error(err);
  }
};

function drawGraph(juegos, rango) {
  juegos.forEach(function(d) {
    if(d.game_name == null) {
      d.game_name = "Otros";
    }
  });
  var margin = {top: 10, right: 30, bottom: 90, left: 70},
      width = 800 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

  var svg = d3.select("#grafica")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(juegos.map(function(d) { return d.game_name; }))
            .padding(0.2);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  var y = d3.scaleLinear()
            .domain([0, d3.max(juegos, function(d) { return +d.sum }) ])
            .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  var Tooltip = d3.select("#info")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "#EAF2EF")
                .style("border", "solid")
                .style("border-width", "0px")
                .style("border-radius", "0px")
                .style("padding", "5px")

  var Tooltip2 = d3.select("#grafica")
                  .append("div")
                  .style("opacity", 0)
                  .attr("class", "tooltip")
                  .style("background-color", "#EAF2EF")
                  .style("border", "solid")
                  .style("border-width", "2px")
                  .style("border-radius", "5px")
                  .style("padding", "5px")

  var mouseover = function(d) {
    Tooltip2
      .style("opacity", 1)
      .html(`<h6>${d.game_name}</h6><center><p>${new Intl.NumberFormat().format(d.sum)}</p></center><center><img src="https://static-cdn.jtvnw.net/ttv-boxart/${d.game_name}-70x100.jpg"></img></center>`)
      .style("left", (d3.mouse(this)[0]+250) + "px")
      .style("top", (d3.mouse(this)[1]-100) + "px")
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mouseleave = function(d) {
    Tooltip2
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  var click = function(d) {
    Tooltip
      .style("opacity", 1)
    d3.json("http://79.143.185.182:3000/api/game/" + d.game_id + "/" + rango + "/streamers", function(data) {
      var aux = `<div id="gridinfo"><h3>` + d.game_name + "</h3><br>" + `<div id="streamers"><h4>TOP STREAMERS</h4>`;
      for (let entry of data) {
        let res = streamersArray.find(x => x.id == entry.user_id);
        if(res != undefined) {
          aux += `
            <li class="streamer">
              <h6>${res.display_name}</h6>
              <p>${new Intl.NumberFormat().format(entry.sum)}</p>
              <img src="${res.profile_image_url}"></img>
              <div class="ver"><a href="https://twitch.tv/${res.login}" target="_blank"><i class="fas fa-play-circle"></i> VER AHORA</a></div>
            </li>
            `
        }
      }
      aux += `</div><div id="juegos"><h4>TOP IDIOMAS</h4>`
      d3.json("http://79.143.185.182:3000/api/game/" + d.game_id + "/" + rango + "/languages", function (data)   {
        for (let entry of data) {
          var pic = '../img/flags/' + entry.language + '.svg';
          aux += `
            <li class="streamer">
                <h6>${translateLanguage(entry.language)}</h6>
                <p>${new Intl.NumberFormat().format(entry.sum)}</p>
                <img src="${pic}"></img>
                <div class="ver"><a href="https://www.twitch.tv/directory/game/${d.game_name}" target="_blank"><i class="fas fa-play-circle"></i> VER AHORA</a></div>
            </li>
            `
        }
        aux += "</div></div>"
        Tooltip
          .html(aux)
      });
    });
  }

  svg.selectAll("mybar")
    .data(juegos)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.game_name); })
      .attr("width", x.bandwidth())
      .attr("fill", "#09443B")
      .attr("opacity", 0.7)
      .attr("height", function(d) { return height - y(0); })
      .attr("y", function(d) { return y(0); })
      .on("mouseleave", mouseleave)
      .on("mouseover", mouseover)
      .on("click", click)

  svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function(d) { return y(d.sum); })
    .attr("height", function(d) { return height - y(d.sum); })
    .delay(function(d,i){console.log(i) ; return(i*100)})


  function translateLanguage(language) {
    switch(language) {
      case "en":
          return "Inglés";
      case "es":
          return "Español"
      case "pt":
          return "Portugués"
      case "fr":
          return "Francés"
      case "de":
          return "Alemán"
      case "ru":
          return "Ruso"
      case "ko":
          return "Coreano"
      case "tr":
          return "Turco"
      case "it":
          return "Italiano"
      case "pl":
          return "Polaco"
      case "zh":
          return "Chino"
      case "ja":
          return "Japonés"
      case "el":
          return "Griego"
      case "no":
          return "Noruego"
      case "th":
          return "Tailandés"
      case "ar":
          return "Árabe"
      case "sk":
          return "Eslovaco"
      case "hi":
          return "Hindi"
      case "bg":
          return "Bulgaro"
      case "cs":
          return "Checo"
      case "ms":
          return "Malayo"
      case "ca":
          return "Catalán"
      case "hu":
          return "Hungaro"
      case "zh-hk":
          return "Chino de Hong Kong"
      case "uk":
          return "Ucraniano"
      case "vi":
          return "Vietnamita"
      case "sv":
          return "Sueco"
      case "nl":
          return "Neerlandés"
      case "ro":
          return "Rumano"
      case "asl":
          return "Asilulu"
      case "fi":
          return "Finlandés"
      case "tl":
          return "Tagalo"
      case "da":
          return "Danés"
      case "other":
          return "Otro"
    }
  }
}


loadGamesMes();