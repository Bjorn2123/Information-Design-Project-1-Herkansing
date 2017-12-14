/*global d3*/

/*Deze codes zin gebaseerd op onderstaande voorbeelden van Mike Bostock waarvan ik mijn eigen versie gemaakt en code aan toegevoegd heb:

Barchart: https://bl.ocks.org/mbostock/3885304 
Circle Packing: https://bl.ocks.org/mbostock/4063530

*/

//hier maak ik variabelen aan waarmee ik de svg maak
var svg = d3.select(".svgLeft"),
    margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//Met onderstaande code maak ik een variabele aan waarmee ik een div aan de body geef dat als tooltip dient
var tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);


// hier laad ik de data in voor de eerste grafiek
d3.text('index.csv').get(onload);

function onload(err, doc) {

    if (err) {
        throw err

    }

    // Met onderstaande code maak ik de data schoon en selecteer ik het deel waarmee ik verder ga werken
    var header = doc.indexOf('Perioden'),
        footer = doc.indexOf('Centraal Bureau voor de Statistiek') - 2,
        end = doc.indexOf('\n', header);
    doc = doc.substring(end, footer).trim();
    
    
// ik pak dmv slice alleen het deel van de dataset dat ik wil hebben
    var data = d3.csvParseRows(doc, map).slice(10, 21);

    function map(d) {
        return {
            Perioden: Number(d[0]),
            Totaal: Number(d[1]) + Number(d[3]) + Number(d[2]) + Number(d[4]),
            Mannen: Number(d[1]) + Number(d[3]),
            Vrouwen: Number(d[2]) + Number(d[4])
        }

    }



    

// Met onderstaande code maak ik de daadwerkelijke datavisualisatie. Ik maak eerst twee domeinen, 1 voor de x en 1 voor de y as
    x.domain(data.map(function (d) {
        return d.Perioden;
    }));
    y.domain([0, 12000]);
    
    
// Met deze code teken ik de x as
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    
// Met deze code teken ik de Y as
    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10))
        .append("text")
        .attr("y", 6)
        .attr("dy", "-0.20em")
        .attr("dx", "0.20em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Aantal overledenen");


// Met deze code maak ik de bars aan die in de grafiek koimen.
    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.Perioden);
        })
        .attr("y", function (d) {
            return y(d.Totaal);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return height - y(d.Totaal);
        })
        .on('mousemove', function (d) { // Met deze code laat ik de tooltip werken.
            tooltip.transition()
                .duration(200)
                .style('opacity', .9)
            tooltip.html((d.Totaal + '<br>' + ' Overledenen'))
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY - 28) + 'px')
        })
        .on('mouseout', function (d) {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });
    
    

    d3.select("input").on("change", change); // Met deze code selecteer ik de input en geef er een change aan die de functie change laat werken

    d3.select("input").property("unchecked", true).each(change); // Hiermee zeg ik dat de input begint als ongecheckt

    
    
// Met deze functie laat ik het sorteren daadwerkelijk in z'n werk gaan
    function change() {


        var x0 = x.domain(data.sort(this.checked ? function (a, b) {
                    return b.Totaal - a.Totaal;
                } : function (a, b) {
                    return d3.ascending(a.Perioden, b.Perioden);
                })
                .map(function (d) {
                    return d.Perioden;
                }))
            .copy();

        svg.selectAll(".bar")
            .sort(function (a, b) {
                return x0(a.Perioden) - x0(b.Perioden);
            });

        var transition = svg.transition().duration(750),
            delay = function (d, i) {
                return i * 50;
            };

        transition.selectAll(".bar")
            .delay(delay)
            .ease(d3.easeBounce)
            .duration(1000)
            .attr("x", function (d) {
                return x0(d.Perioden);
            });

        transition.select(".axis--x")
            .call(d3.axisBottom(x0))
            .selectAll("g")
            .delay(delay);
    }


};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Grafiek2

//Met onderstaande code maak ik de tweede grafiek aan en selecteer ik de rechtergrafiek uit mijn html
var svgRight = d3.select(".svgRight"),
    marginRight = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    widthRight = +svgRight.attr("width") - marginRight.left - marginRight.right,
    heightRight = +svgRight.attr("height") - marginRight.top - marginRight.bottom,
    groupRight = svgRight.append("g").attr("transform", "translate(" + marginRight.left + "," + marginRight.top + ")");

var x0 = d3.scaleBand()
    .rangeRound([0, widthRight]);

var yRight = d3.scaleLinear()
    .rangeRound([heightRight, 0]);

var tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);


//Ook hier laad ik weer mijn data in en maak ik een functie aan.
d3.csv("data.csv")
    .get(onload2);

function onload2(error, dataRight) {
    if (error) {
        throw error

    }

// Wederom maak ik twee domeinen aan voor de X en de Y as
    x0.domain(dataRight.map(function (d) {
        return d.Risico;
    }));

    yRight.domain([0, 100]) // hiermee bepaal ik de range van de Y as

    //hiermee maak ik daadwerkelijk de x as aan
    svgRight.append("g")
        .attr("class", "Xas")
        .attr("transform", "translate(" + marginRight.left + "," + (heightRight + 20) + ")")
        .call(d3.axisBottom(x0));
    
// Hiermee maak ik de y as aan
    svgRight.append("g")
        .attr("class", "Yas")
        .attr("transform", "translate(" + marginRight.left + ", 20)")
        .call(d3.axisLeft(yRight))
        .append("text")
    .attr("y", 6)
        .attr("dy", "-0.20em")
        .attr("dx", "0.30em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Percentage personen met risico");

//Met onderstaande code zorg ik ervoor dat de eerste data die je in de rechter grafiek ziet het jaar 2014 is.
    var dataFilter = dataRight.filter(function (d) {
        return d.Perioden == 2014;

    });

// Met onderstaande code maak ik als het ware een grouped bar chart. Ik maak eerst een bar aan voor de mannen.
    svgRight.selectAll(".barMan")
        .data(dataFilter)
        .enter().append("rect")
        .attr("class", "barMan")
        .attr("width", (x0.bandwidth() - 20) / 2)
        .attr("y", function (d) {
            return yRight(d.Mannen);
        })
        .attr("height", function (d) {
            return heightRight - yRight(d.Mannen) + 20;
        })
        .attr("x", function (d) {
            return marginRight.left + x0(d.Risico) + 9;
        }).on('mousemove', function (d) {
            tooltip.transition()
                .duration(150)
                .style('opacity', .9)
            tooltip.html((d.Mannen + '%'))
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY - 28) + 'px')
        })
        .on('mouseout', function (d) {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        })
        .attr("fill", "#00a8cf");
 
//Omdat ik dus een grouped bar chart wil maak ik ook een bar aan voor de vrouwen met de bijbehorende waarde.
    svgRight.selectAll(".barVrouw")
        .data(dataFilter)
        .enter().append("rect")
        .attr("class", "barVrouw")
        .attr("width", (x0.bandwidth() - 20) / 2)
        .attr("y", function (d) {
            return yRight(d.Vrouwen);
        })
        .attr("height", function (d) {
            return heightRight - yRight(d.Vrouwen) + 20;
        })
        .attr("x", function (d) {
            return marginRight.left + x0(d.Risico) + 11 + ((x0.bandwidth() - 20) / 2);
        }).on('mousemove', function (d) {
            tooltip.transition()
                .duration(150)
                .style('opacity', .9)
            tooltip.html((d.Vrouwen + '%'))
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY - 28) + 'px')
        })
        .on('mouseout', function (d) {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        })
        .attr("fill", "#0086a5");


//Met onderstaande code zorg ik ervoor dat wanneer er op een rect met class bar wordt geclikt dat de rechter grafiek geupdate wordt en dus andere waarden laat zien. 

    d3.selectAll(".bar").on('click', onChange);

    function onChange(e) {
        var selectedYear = e.Perioden
//Wanneer er geklikt wordt op een bar lager dan 2014 wordt er een alert gegeven.
        if (selectedYear < 2014) {
            window.alert("Van " + selectedYear + " is helaas geen data van beschikbaar");
        } else {
            var dataUpdate = dataRight.filter(function (d) {
                return Number(d.Perioden) === Number(selectedYear);
            });
    

            var barMannen = svgRight.selectAll(".barMan");

            barMannen.data(dataUpdate).transition().duration(750).ease(d3.easeBounce)
                .attr("class", "barMan")
                .attr("width", (x0.bandwidth() - 20) / 2)
                .attr("y", function (d) {
                    return yRight(d.Mannen);
                })
                .attr("height", function (d) {
                    return heightRight - yRight(d.Mannen) + 20;
                })
                .attr("x", function (d) {
                    return marginRight.left + x0(d.Risico) + 9;
                })
                .attr("fill", "#00a8cf");


            var barVrouwen = svgRight.selectAll(".barVrouw");

            barVrouwen.data(dataUpdate).transition().duration(750).ease(d3.easeBounce)
                .attr("class", "barVrouw")
                .attr("width", (x0.bandwidth() - 20) / 2)
                .attr("y", function (d) {
                    return yRight(d.Vrouwen);
                })
                .attr("height", function (d) {
                    return heightRight - yRight(d.Vrouwen) + 20;
                })
                .attr("x", function (d) {
                    return marginRight.left + x0(d.Risico) + 11 + ((x0.bandwidth() - 20) / 2);
                })
                .attr("fill", "#0086a5");

        }
    }

};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Grafiek 3

// Ook hier maak ik weer variabelen aan waarmee ik de derde grafiek maak
var svgDrie = d3.select(".svgdrie"),
    diameter = +svgDrie.attr("width"),
    gCircle = svgDrie.append("g").attr("transform", "translate(2,2)"),
    format = d3.format(",d");

//hiermee bepaald ik de diameter van de datavisualisatie
var pack = d3.pack()
    .size([diameter - 4, diameter - 4]);

//Wederom laad ik mijn data in waarmee ik vervolgens ga werken.
d3.json("data.json", function (error, root) {
    if (error) throw error;

    root = d3.hierarchy(root)
        .sum(function (d) {
            return d.size;
        })
        .sort(function (a, b) {
            return b.value - a.value;
        });

    var node = gCircle.selectAll(".node")
        .data(pack(root).descendants())
        .enter().append("g")
        .attr("class", function (d) {
            return d.children ? "node" : "leaf node";
        })
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    node.append("title")
        .text(function (d) {
            return d.data.name + "\n" + format(d.value);
        });

    node.append("circle")
        .attr("r", function (d) {
            return d.r;
        });

    node.filter(function (d) {
            return !d.children;
        }).append("text").attr("class", "textcircle")
        .attr("dy", "0.3em")
        .text(function (d) {
            return d.data.name.substring(0, d.r / 3);
        });
});
