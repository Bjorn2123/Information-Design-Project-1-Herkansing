# Information-Design-Project-1-Herkansing

## Concept

Bij het vak Research for Data heb ik als onderwerp dementie gekregen. Ik heb ervoor gekozen om voor dit project ook dit onderwerp te gebruiken, puur omdat ik al veel informatie had en ik me er wel in interesseerde. Het concept voor dit project bestaat uit het visualiseren van bepaalde data waarmee ik wil vertellen hoeveel mensen er tussen 2006 en 2016 overleden zijn aan dementie, wat het percentage mensen is dat bepaalde risicofactoren voor dementie hebben en hoeveel mensen er dementie hebben in bepaalde provincies en steden in Nederland

## Proces

### Stap 1: Grafiek bouwen

#### Grafiek 1 (voor grafiek 2 heb ik dit op dezelfde manier gedaan)

Om het aantal mensen dat overleden is aan dementie tussen 2006 en 2016 te laten zien heb ik voor een [Bar Chart](https://bl.ocks.org/mbostock/3885304) van Mike Bostock.


Allereerst heb ik variabelen aangemaakt, zie onderstaande code, waarmee ik later een grafiek ga maken.

```js
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


var tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

```
    
Hierna ben ik mijn data in gaan laden en heb ik deze schoongemaakt.

```js
d3.text('index.csv').get(onload);

function onload(err, doc) {

    if (err) {
        throw err

    }

    var header = doc.indexOf('Perioden'),
        footer = doc.indexOf('Centraal Bureau voor de Statistiek') - 2,
        end = doc.indexOf('\n', header);
    doc = doc.substring(end, footer).trim();

    var data = d3.csvParseRows(doc, map).slice(10, 21);

    function map(d) {
        return {
            Perioden: Number(d[0]),
            Totaal: Number(d[1]) + Number(d[3]) + Number(d[2]) + Number(d[4]),
            Mannen: Number(d[1]) + Number(d[3]),
            Vrouwen: Number(d[2]) + Number(d[4])
        }

    }
```

Vervolgens ben ik domeinen gaan maken voor X en de Y as en heb ik deze assen plus de bijbehorende bars gemaakt.

```js

    x.domain(data.map(function (d) {
        return d.Perioden;
    }));
    y.domain([0, 12000]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

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
        .on('mousemove', function (d) {
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
```

#### Grafiek 2 & 3


Voor het maken van grafiek 2 en 3 heb ik de codes geschreven op dezelfde manier als die van grafiek 1. Uitgebreide uitleg over deze codes staan gecomment in mijn js. file
Ik heb voor grafiek 3 gekozen voor [Circle Packing](https://bl.ocks.org/mbostock/4063530). Grafiek 2 heb ik helemaal zelf gemaakt met grafiek 1 als voorbeeld. 

### Stap 2: Interactie

Om mijn verhaal te kunnen vertellen door middel van de datavisualitaties heb ik interactie toegevoegd. Deze interactie bestaat uit het klikken op een bar uit grafiek 1 die meerdere data laat zien in grafiek 2 voor het aangeklikte jaar. Dit heb ik gedaan door middel van onderstaande codes.

Ik heb hier een onclick aan alle rectangles met class bar uit grafiek 1 gegeven die na het klikken function Onchange in z'n werk laat gaan. 

Ik heb een variabele aangemaakt waarmee ik het jaar selecteer. Vervolgens heb ik een if else statement gemaakt waarmee ik de interactie laat werken. Zie codes

```js
   d3.selectAll(".bar").on('click', onChange);

    function onChange(e) {
        var selectedYear = e.Perioden

        if (selectedYear < 2014) {
            window.alert("Van " + selectedYear + " is helaas geen data van beschikbaar");
        } else {
            var dataUpdate = dataRight.filter(function (d) {
                return Number(d.Perioden) === Number(selectedYear);
            });
            console.log(dataUpdate)

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
```

#### Stap 3: Sorteerfunctie

Tevens heb ik code geschreven waarmee ik grafiek 1 laat sorteren van oplopend naar aflopend. Dit heb ik gedaan met onderstaande code.

Ik heb allereerst een label aangemaakt met een checkboxtype input:

```html
 <label>
        <input type="checkbox"> Sorteer
        </label>
```
Om dit te laten werken heb ik de volgende codes geschreven

```js
 d3.select("input").on("change", change);

    d3.select("input").property("unchecked", true).each(change);


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
```

### Stap 4: Tooltip

Als laatst heb ik op de twee bar charts een tooltip toegepast die wanneer er over en bar gehovert wordt de bijbehorende waardes laat zien in een kleine box. Dit heb ik gedaan met onderstaande codes.

Ik heb eerst een variabelen aangemaakt waarmee ik een div aan de body geef.
```js
var tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);
```
Om deze tooltip bij de juiste bars te laten werken heb ik gebruik gemaakt van mousemove & mouseout.

```js
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
        .on('mousemove', function (d) {
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
 ```
 
 ### Bronnen
 
 [Dataset 1](http://statline.cbs.nl/Statweb/publication/?DM=SLNL&PA=7233&D1=422%2c424&D2=1-2&D3=0&D4=10-20&HDR=G2%2cG1%2cG3&STB=T&VW=T)
 
 [Dataset 2](http://statline.cbs.nl/Statweb/publication/?DM=SLNL&PA=83021ned&D1=0%2c16%2c50%2c56%2c71&D2=1-2&D3=0&D4=a&HDR=T&STB=G1%2cG2%2cG3&VW=T)
 
 [Bar chart](https://bl.ocks.org/mbostock/3885304)
 
 [Circle Packing](https://bl.ocks.org/mbostock/4063530)
