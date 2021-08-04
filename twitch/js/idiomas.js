$("#hora").click(function(e) {
    e.preventDefault();
    d3.selectAll("svg").remove();
    d3.selectAll("streamers").remove();
    d3.selectAll("juegos").remove();
    loadLanguagesHora();
});

$("#dia").click(function(e) {
    e.preventDefault();
    d3.selectAll("svg").remove();
    d3.selectAll("streamers").remove();
    d3.selectAll("juegos").remove();
    loadLanguagesDia();
});

$("#semana").click(function(e) {
    e.preventDefault();
    d3.selectAll("svg").remove();
    d3.selectAll("streamers").remove();
    d3.selectAll("juegos").remove();
    loadLanguagesSemana();
});

$("#mes").click(function(e) {
    e.preventDefault();
    d3.selectAll("svg").remove();
    d3.selectAll("streamers").remove();
    d3.selectAll("juegos").remove();
    loadLanguagesMes();
});

$("#todo").click(function(e) {
    e.preventDefault();
    d3.selectAll("svg").remove();
    d3.selectAll("streamers").remove();
    d3.selectAll("juegos").remove();
    loadLanguagesTodo();
});


let languagesArray = [];
var streamersArray =[];

const loadLanguagesHora = async () => {
  try {
      const res = await fetch('http://79.143.185.182:3000/api/languages/now');
      languagesArray = await res.json();
      drawGraph(languagesArray, "now");
      const resStreamer = await fetch('http://79.143.185.182:3000/api/streamer/');
      streamersArray = await resStreamer.json();
  } catch (err) {
      console.error(err);
  }
};

const loadLanguagesDia = async () => {
  try {
      const res = await fetch('http://79.143.185.182:3000/api/languages/one');
      languagesArray = await res.json();
      drawGraph(languagesArray, "one");
      const resStreamer = await fetch('http://79.143.185.182:3000/api/streamer/');
      streamersArray = await resStreamer.json();
  } catch (err) {
      console.error(err);
  }
};

const loadLanguagesSemana = async () => {
  try {
      const res = await fetch('http://79.143.185.182:3000/api/languages/seven');
      languagesArray = await res.json();
      drawGraph(languagesArray, "seven");
      const resStreamer = await fetch('http://79.143.185.182:3000/api/streamer/');
      streamersArray = await resStreamer.json();
  } catch (err) {
      console.error(err);
  }
};

const loadLanguagesMes = async () => {
  try {
      const res = await fetch('http://79.143.185.182:3000/api/languages/thirty');
      languagesArray = await res.json();
      drawGraph(languagesArray, "thirty");
      const resStreamer = await fetch('http://79.143.185.182:3000/api/streamer/');
      streamersArray = await resStreamer.json();
  } catch (err) {
      console.error(err);
  }
};

const loadLanguagesTodo = async () => {
  try {
      const res = await fetch('http://79.143.185.182:3000/api/languages/all');
      languagesArray = await res.json();
      drawGraph(languagesArray, "all");
      const resStreamer = await fetch('http://79.143.185.182:3000/api/streamer/');
      streamersArray = await resStreamer.json();
  } catch (err) {
      console.error(err);
  }
};



function drawGraph(languages, rango) {
    var espectadores = languages.map(function(d) { return +d.sum; });
    var espectadoresExtent = d3.extent(espectadores);
    var width = 800,
        height = 800;
    var svg,
        circles,
        circleSize = { min: 20, max: 200 };
    var circleRadiusScale = d3.scaleSqrt()
        .domain(espectadoresExtent)
        .range([circleSize.min, circleSize.max]);

    var forceSimulation;

    svg = d3.select("#grafica")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

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

    var click = function(d) {
    Tooltip
        .style("opacity", 1)
    d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
        d3.json("http://79.143.185.182:3000/api/language/" + d.language + "/" + rango + "/streamers", function(data) {
            var aux = `<div id="gridinfo"><h3>` + translateLanguage(d.language) + "</h3><br>" + `<div id="streamers"><h4>TOP STREAMERS</h4>`;
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
                }}
                aux += `</div><div id="juegos"><h4>TOP JUEGOS</h4>`

            d3.json("http://79.143.185.182:3000/api/language/" + d.language + "/" + rango + "/games", function (data)   {
                for (let entry of data) {
                    var pic = `https://static-cdn.jtvnw.net/ttv-boxart/${entry.game_name}-350x500.jpg`
                    aux += `
                        <li class="streamer">
                            <h6>${entry.game_name}</h6>
                            <p>${new Intl.NumberFormat().format(entry.sum)}</p>
                            <img src="${pic}"></img>
                            <div class="ver"><a href="https://www.twitch.tv/directory/game/${entry.game_name}" target="_blank"><i class="fas fa-play-circle"></i> VER AHORA</a></div>
                        </li>
                        `
                }
                aux += "</div></div>"
                Tooltip
                    .html(aux)
            });
        });
    }

    var mouseover = function(d) {
        Tooltip2
            .style("opacity", 1)
            .html(`<h6>${translateLanguage(d.language)}</h6><center><p>${new Intl.NumberFormat().format(d.sum)}</p></center>`)
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

    circles = svg.selectAll("image")
                .data(languages)
                .enter()
                    .append("image")
                    .attr('class', 'myCircle')
                    .attr("width", function(d) { return circleRadiusScale(d.sum); })
                    .attr("heigth", function(d) { return circleRadiusScale(d.sum); })
                    .style("stroke", "none")
                    .style("opacity", 0.8)
                    .attr("xlink:href", function(d) {
                        return '../img/flags/' + d.language + '.svg'; })

    forceSimulation = d3.forceSimulation()
                        .force("x", d3.forceX(width / 2).strength(0.05))
                        .force("y", d3.forceY(height / 2).strength(0.05))
                        .force("collide", d3.forceCollide(function(d) {return circleRadiusScale(d.sum)}));
    forceSimulation.nodes(languages)
        .on("tick", function() {
            circles
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; })
                .on("click", click)
                .on("mouseleave", mouseleave)
                .on("mouseover", mouseover)
        });

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

loadLanguagesMes();