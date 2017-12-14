# Information-Design-Project-1-Herkansing

## Concept

Bij het vak Research for Data heb ik als onderwerp dementie gekregen. Ik heb ervoor gekozen om voor dit project ook dit onderwerp te gebruiken, puur omdat ik al veel informatie had en ik me er wel in interesseerde. Het concept voor dit project bestaat uit het visualiseren van bepaalde data waarmee ik wil vertellen hoeveel mensen er tussen 2006 en 2016 overleden zijn aan dementie, wat het percentage mensen is dat bepaalde risicofactoren voor dementie hebben en hoeveel mensen er dementie hebben in bepaalde provincies en steden in Nederland

## Proces

### Stap 1: Grafiek bouwen

#### Grafiek 1

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
