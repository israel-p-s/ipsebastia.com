$("#hora").click(function(e) {
    e.preventDefault();
    loadStreamersHora();
});

$("#dia").click(function(e) {
    e.preventDefault();
    loadStreamersDia();
});

$("#semana").click(function(e) {
    e.preventDefault();
    loadStreamersSemana();
});

$("#mes").click(function(e) {
    e.preventDefault();
    loadStreamersMes();
});

$("#todo").click(function(e) {
    e.preventDefault();
    loadStreamersTodo();
});

const streamersList = document.getElementById('streamersList');
const searchBar = document.getElementById('searchBar');
let streamersArray = [];

const loadStreamersHora = async () => {
    try {
        const res = await fetch('http://79.143.185.182:3000/api/streamers/now');
        streamersArray = await res.json();
        displayStreamers(streamersArray, "now");
    } catch (err) {
        console.error(err);
    }
};

const loadStreamersDia = async () => {
    try {
        const res = await fetch('http://79.143.185.182:3000/api/streamers/one');
        streamersArray = await res.json();
        displayStreamers(streamersArray, "one");
    } catch (err) {
        console.error(err);
    }
};

const loadStreamersSemana = async () => {
    try {
        const res = await fetch('http://79.143.185.182:3000/api/streamers/seven');
        streamersArray = await res.json();
        displayStreamers(streamersArray, "seven");
    } catch (err) {
        console.error(err);
    }
};

const loadStreamersMes = async () => {
    try {
        const res = await fetch('http://79.143.185.182:3000/api/streamers/thirty');
        streamersArray = await res.json();
        displayStreamers(streamersArray, "thirty");
    } catch (err) {
        console.error(err);
    }
};

const loadStreamersTodo = async () => {
    try {
        const res = await fetch('http://79.143.185.182:3000/api/streamers/all');
        streamersArray = await res.json();
        displayStreamers(streamersArray, "all");
    } catch (err) {
        console.error(err);
    }
};

const displayStreamers = (streamers, rango) => {
    const htmlString = streamers
        .map((streamer) => {
            i++;
            return `
            <li class="streamer">
                <h2>${streamer.user_name} : ${new Intl.NumberFormat().format(streamer.sum)}</h2>
                <div class="grafica" id="grafica${streamer.user_id}"></div>
                <div class="info" id="info${streamer.user_id}"><p>Desliza en los puntos de la gráfica para más info.</p></div>
                <div class="ver"><a href="https://twitch.tv/${streamer.user_name}" target="_blank"><i class="fas fa-play-circle"></i> VER AHORA</a></div>
            </li>
        `;
        })
        .join('');
    streamersList.innerHTML = htmlString;
    for (var i = 0; i < streamers.length; i++) {
        drawGraph(streamers[i].user_id, rango);
    }
};

const drawGraph = async (streamer, rango) => {
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = (window.screen.availWidth * 0.5) - margin.left - margin.right,
        height = (window.screen.availHeight * 0.4) - margin.top - margin.bottom;
    var	parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
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
                    .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));

            var y = d3.scaleLinear()
                    .domain( d3.extent(data, function(d) { return +d.viewer_count; }) )
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

loadStreamersMes();
