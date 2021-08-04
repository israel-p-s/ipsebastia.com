var userList = document.getElementById('userList');
var gameList = document.getElementById('gameList');
var languageList = document.getElementById('languageList');
var filtradosList = [];
var streamersArray =[];
var userArray = [];
var gameArray = [];
var languageArray = [];

const inicializar = async () => {
    try {
        const resUser = await fetch('http://79.143.185.182:3000/api/streamer/');
        userArray = await resUser.json();
        await userArray.forEach(function(item) {
            var option = document.createElement('option');
            option.value = item.display_name;
            option.text = item.display_name;
            userList.appendChild(option);
        })


        const resGame = await fetch('http://79.143.185.182:3000/api/games/');
        gameArray = await resGame.json();
        await gameArray.forEach(function(item) {
            var option = document.createElement('option');
            option.value = item.name;
            option.label = item.name;
            gameList.appendChild(option);
        })

        const resLanguage = await fetch('http://79.143.185.182:3000/api/languages/');
        languageArray = await resLanguage.json();
        await languageArray.forEach(function(item) {
            var option = document.createElement('option');
            option.value = translateLanguage(item.language);
            option.label = translateLanguage(item.language);
            languageList.appendChild(option);
        })

        const res = await fetch('http://79.143.185.182:3000/api/streamer/');
        streamersArray = await res.json();
    } catch (err) {
        console.error(err);
    }
};
function translateLevel(level) {
    switch(level) {
        case "partner":
            return "partner";
        case "affiliate":
            return "afiliado";
        case null:
            return "ninguno";
    }
}
function translateLanguage(language) {
  switch(language) {
      case "en":
          return "inglés";
      case "es":
          return "español"
      case "pt":
          return "portugués"
      case "fr":
          return "francés"
      case "de":
          return "alemán"
      case "ru":
          return "ruso"
      case "ko":
          return "coreano"
      case "tr":
          return "turco"
      case "it":
          return "italiano"
      case "pl":
          return "polaco"
      case "zh":
          return "chino"
      case "ja":
          return "japonés"
      case "el":
          return "griego"
      case "no":
          return "noruego"
      case "th":
          return "tailandés"
      case "ar":
          return "árabe"
      case "sk":
          return "eslovaco"
      case "hi":
          return "hindi"
      case "bg":
          return "bulgaro"
      case "cs":
          return "checo"
      case "ms":
          return "malayo"
      case "ca":
          return "catalán"
      case "hu":
          return "hungaro"
      case "zh-hk":
          return "chino de Hong Kong"
      case "uk":
          return "ucraniano"
      case "vi":
          return "vietnamita"
      case "sv":
          return "sueco"
      case "nl":
          return "neerlandés"
      case "ro":
          return "rumano"
      case "asl":
          return "asilulu"
      case "fi":
          return "finlandés"
      case "tl":
          return "tagalo"
      case "da":
          return "danés"
      case "other":
          return "otro"
  }
}

function untranslateLanguage(language) {
    switch(language) {
        case "inglés":
            return "en";
        case "español":
            return "es"
        case "portugués":
            return "pt"
        case "francés":
            return "fr"
        case "alemán":
            return "de"
        case "ruso":
            return "ru"
        case "coreano":
            return "ko"
        case "turco":
            return "tr"
        case "italiano":
            return "it"
        case "polaco":
            return "pl"
        case "chino":
            return "zh"
        case "japonés":
            return "ja"
        case "griego":
            return "el"
        case "noruego":
            return "no"
        case "tailandés":
            return "th"
        case "árabe":
            return "ar"
        case "eslovaco":
            return "sk"
        case "hindi":
            return "hi"
        case "bulgaro":
            return "bg"
        case "checo":
            return "cs"
        case "malayo":
            return "ms"
        case "catalán":
            return "ca"
        case "hungaro":
            return "hu"
        case "chino de Hong Kong":
            return "zh-hk"
        case "ucraniano":
            return "uk"
        case "vietnamita":
            return "vi"
        case "sueco":
            return "sv"
        case "neerlandés":
            return "nl"
        case "rumano":
            return "ro"
        case "asilulu":
            return "asl"
        case "finlandés":
            return "fi"
        case "tagalo":
            return "tl"
        case "danés":
            return "da"
        case "otro":
            return "other"
    }
  }
const filtrar = async (user, game, language, rango) => {
    console.log(user);
    if(user == ''){ 
        user = 'all'
    } else {
        var aux = userArray.find(x => x.display_name == user);
        user = aux.id;
    }
    if(game == ''){ 
      game = 'all'
    } else {
        var aux = gameArray.find(x => x.name == game);
        game = aux.id;
    }
    if(language == ''){
        language = 'all'
    } else {
        language = untranslateLanguage(language);
    }
    if(rango == ''){ rango = 'all'}

    var url = "http://79.143.185.182:3000/api/filtrar/" + user + "/" + game + "/" + language + "/" + rango;
    console.log(url)
    await d3.json(url, 
        function(data) { 
            filtradosList = data;
            displayStreamers(filtradosList, streamersArray, rango);
        })
}

const displayStreamers = (filtrados, streamers, rango) => {
    const htmlString = filtrados
    .map((filtrado) => {
        let streamer = streamers.find(x => x.id == filtrado.user_id);
        if(streamer != undefined) {
            return `
                <li class="streamer">
                    <h2>${streamer.display_name}</h2>
                    <div class="datos" id="datos${streamer.id}" style="display: none;"><p>Nivel del streamer: ${translateLevel(streamer.broadcaster_type)}</p><p>Visitas: ${new Intl.NumberFormat().format(streamer.view_count)}</p><p>Fecha de inicio: ${streamer.created_at.substring(8,10) + "-" + streamer.created_at.substring(5,7) + "-" + streamer.created_at.substring(0,4)}</p></div>
                    <div class="grafica" id="grafica${streamer.id}"><button id="button" onclick="drawGraph(\'${streamer.id}\', \'${rango}\'); this.style.display = \'none\'; document.getElementById('datos${streamer.id}').style.display = 'block'; document.getElementById('perfil${streamer.id}').style.display = 'block'; document.getElementById('info${streamer.id}').style.display = 'block';"><em class="fas fa-spinner"><p></p></em> Haz click para cargar la información</button></div>
                    <img id="perfil${streamer.id}" src="${streamer.profile_image_url}" style="display: none;"></img>
                    <div class="ver"><a href="https://twitch.tv/${streamer.login}" target="_blank"><i class="fas fa-play-circle"></i> VER AHORA</a></div>
                    <div class="info" id="info${streamer.id}" style="display: none;"><p>Desliza en los puntos de la gráfica para más info.</p></div>
                </li>
            `;
        } }
    )
    .join('');
    streamersList.innerHTML = htmlString;
};
  
const drawGraph = async (streamer, rango) => {
      var margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = (window.screen.availWidth * 0.5) - margin.left - margin.right,
      height = (window.screen.availHeight * 0.4) - margin.top - margin.bottom;
      var parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
      var grafica = "#grafica" + streamer;
      var svg = d3.select(grafica)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
        if(rango == '1 HORA') {
            rango = `now`
        } else if(rango == '1 DÍA') {
            rango = `one`
        } else if(rango == '1 SEMANA') {
            rango = `seven`
        } else if(rango == '1 MES') {
            rango = `thirty`
        } else if(rango == 'TODO') {
            rango = `all`
        }

    d3.json("http://79.143.185.182:3000/api/streamer/" + streamer + "/" + rango, 
        function(data) { 
            data.forEach(function(d) {
                d.time = parseDate(d.time);
                d.viewer_count = +d.viewer_count;
            });
            data.forEach(function(d) {
                if(d.title == null) {
                    d.title = "Desconocido";
                }
                if(d.game_name == null) {
                    d.game_name = "Desconocido";
                }
            });
            data.sort(function(a, b){
                return a["time"]-b["time"];
            })
            if(data.length > 1) {
                var x = d3.scaleTime()
                    .domain(d3.extent(data, function(d) { return d.time; }))
                    .range([ 0, width ]);
                xAxis = svg.append("g")
                    .attr("transform", "translate(0," + (height+5) + ")")
                    .call(d3.axisBottom(x).tickSizeOuter(0));

                var y = d3.scaleLinear()
                    .domain( d3.extent(data, function(d) { return +d.viewer_count; }))
                    .range([ height, 0 ]);
                yAxis = svg.append("g")
                    .call(d3.axisLeft(y).tickSizeOuter(0));

                var clip = svg.append("defs").append("svg:clipPath")
                    .attr("id", "clip")
                    .append("svg:rect")
                    .attr("width", width )
                    .attr("height", height )
                    .attr("x", 0)
                    .attr("y", 0);

                var brush = d3.brushX()
                    .extent( [ [0,0], [width,height] ] )
                    .on("end", updateChart)

                var area = svg.append('g')
                    .attr("clip-path", "url(#clip)")

                var areaGenerator = d3.area()
                    .x(function(d) { return x(d.time) })
                    .y0(y(0))
                    .y1(function(d) { return y(d.viewer_count) })

                area.append("path")
                    .datum(data)
                    .attr("class", "myArea")
                    .attr("fill", "#09443B")
                    .attr("fill-opacity", 0.7)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .attr("d", areaGenerator )

                area.append("g")
                    .attr("class", "brush")
                    .call(brush);

                var informacion = "#info" + streamer;
                var Tooltip = d3.select(informacion)
                    .selectAll("p")
                    .attr("class", "tooltip")
                    .style("opacity", 1)

                var mouseover = function(d) {
                    d3.select(this)
                        .style("fill", "white")
                        .style("opacity", 1)
                        .style("r", 4.5)
                    var format = d3.timeFormat("%I:%M %p / %d-%m-%Y");
                    Tooltip
                        .style("opacity", 1)
                        .html(d.title.substring(0,40) + "<br>" + "Fecha y hora: " + format(d.time) + "<br>" + "Visitas: " + new Intl.NumberFormat().format(d.viewer_count) + "<br>" + "Juego: " + d. game_name + "<br>" + "Idioma: " + translateLanguage(d.language) + "<br>" + "Comienzo del streaming: " + format(parseDate(d.started_at)))
                }

                var mouseleave = function(d) {
                    d3.select(this)
                        .style("fill", "#D63384")
                        .style("opacity", 0.8)
                        .style("r", 3)
                }

                var dot = svg.append('g')
                    .attr("clip-path", "url(#clip)")
                    .selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                        .attr("class", "myCircle")
                        .attr("fill", "#D63384")
                        .attr("stroke", "none")
                        .attr("opacity", 0.8)
                        .attr("cx", function(d) { return x(d.time) })
                        .attr("cy", function(d) { return y(d.viewer_count) })
                        .attr("r", 3)
                        .on("mouseover", mouseover)
                        .on("mouseleave", mouseleave)


                var idleTimeout
                function idled() { idleTimeout = null; }

                function updateChart() {

                    extent = d3.event.selection
                    if(!extent){
                        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); 
                        x.domain([ 4,8])
                     }else{
                        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
                        area.select(".brush").call(brush.move, null) 
                    }

                    xAxis.transition().duration(1000).call(d3.axisBottom(x))
                    area.select('.myArea')
                        .transition()
                        .duration(1000)
                        .attr("d", areaGenerator)

                    dot.transition()
                        .duration(1000)
                        .attr("cx", function(d) { return x(d.time) })
                        .attr("cy", function(d) { return y(d.viewer_count) })
                }
                svg.on("dblclick",function(){
                    x.domain(d3.extent(data, function(d) { return d.time; }))
                    xAxis.transition().call(d3.axisBottom(x))
                    area.select('.myArea')
                        .transition()
                        .attr("d", areaGenerator)

                    dot.transition()
                        .duration(1000)
                        .attr("cx", function(d) { return x(d.time) })
                        .attr("cy", function(d) { return y(d.viewer_count) })
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
        } else {
            d3.select(grafica)
                .text('No hay suficiente información para mostrar la gráfica.')
            var info = "info" + streamer;
            document.getElementById(info).style.display = 'none'
        }
    })
}

inicializar();