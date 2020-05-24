import {Parameters} from "./parameter";
import {Molecules} from "./molecular"
import {BrownianMotion} from "./BrownianMotion"
import {SVG} from "@svgdotjs/svg.js"
import Vue from "vue"

function main() {
    const height= 700;
    const width = 700;
    const aspect = width / height;

    var System = new BrownianMotion(aspect);
    var draw = SVG().addTo('#canvas').size(width, height);

// graph {{{
    const margin = 30;
    const graphHeight= 420+2*margin;
    const graphWidth = 420+2*margin;

    var graph = SVG().addTo('#graph').size(graphWidth, graphHeight);
    var axisX = graph.line(margin,margin, margin,graphHeight-margin).stroke({ color: '#333', width: 3, linecap: 'round' });
    var axisY = graph.line(margin,graphHeight-margin, graphWidth-margin,graphHeight-margin).stroke({ color: '#333', width: 3, linecap: 'round' });
    var tempData:number[][] = [] ;
    var graphLine = new Array( graph.circle() );
    let yBathT = graphHeight-margin - Math.floor(System.bathT);
    let labelBathT = graph.text(""+Math.floor(System.bathT)).move(0, yBathT-7);
    var lineBathT = graph.line(margin,yBathT, graphWidth-margin,yBathT).stroke({ color: '#999', width: 2, linecap: 'round' });

    function graphUpdate(t:number, temperature:number) {
        let i = tempData.length
        let x = margin + Math.floor(t*1e13);
        let y = graphHeight-margin - temperature;
        tempData[i] = [x, y];
        if (x > graphWidth - margin) {
            for(let j=0;j<tempData.length-1;j++) {
                tempData[j] = [ tempData[j][0], tempData[j+1][1] ];
                graphLine[j].move(tempData[j][0], tempData[j][1]);
            }
            graphLine[i] = graph.circle(3).fill('#f06').move(tempData[i-1][0], tempData[i][1]);
            tempData.pop();
            graphLine[0].remove();
            graphLine.shift();
        } else {
            graphLine[i] = graph.circle(3).fill('#f06').move(x,y);
        }
    }

    function resetGraph() {
        for(let i=0;i<graphLine.length;i++) { graphLine[i].remove(); }
        tempData = [];
    }

    function setTemperatureGraph(temperature:number) {
        let yBathT = graphHeight-margin - Math.floor(temperature);
        lineBathT.move(margin,yBathT);
        labelBathT.text(""+Math.floor(System.bathT)).move(0, yBathT-7);
    }
// }}}

// particle {{{
    var particles:any[] = new Array(System.particleNumber+1);
    var positions:number[][] = System.getPositions(width);
    for (let i=0;i<=System.particleNumber;i++) {
        particles[i] = draw.circle(System.getRadius(i,width)).attr({ fill: System.particles[i].color });
    };
    function switchShowParticle(isParticles:boolean) {
        if (isParticles == true) {
            for (var p of particles) { p.show() };
        } else {
            for (var p of particles) { p.hide() };
            particles[particles.length-1].show();
        }
    };
// }}}

// Trajectry {{{
    var trajectry:number[] = System.getTrajectry(width);
    var trajectryLine = new Array( draw.polyline() );

    function updateTrajectry(isTrajectry:boolean) {
        var BP_position:number[] = System.getTrajectry(width);
        let i = trajectryLine.length
        trajectryLine[i] = draw.polyline([trajectry[0], trajectry[1], BP_position[0], BP_position[1] ]);
        trajectryLine[i].fill('none');
        trajectryLine[i].clear();
        trajectryLine[i].stroke({ color: '#f06', width: 1 });
        trajectry = BP_position;
        if (isTrajectry == true) {
            trajectryLine[i].show();
        } else {
            trajectryLine[i].hide();
        };
    };

    function resetTrajectry() {
        for (var t of trajectryLine) { t.remove() }
        trajectryLine = new Array( draw.polyline() );
        trajectry = System.getTrajectry(width);
    };

    function switchShowTrajectry(isTrajectry:boolean) {
        if (isTrajectry == true) {
            for (var t of trajectryLine) { t.show() }
        } else {
            for (var t of trajectryLine) { t.hide() }
        }
    };
// }}}

//  Vue {{{
    var app = new Vue({
        el: '#console',
        data: {
            time: System.t,
            temp: System.temperature,

            isRunning: true,
            labelRunning: "pause",

            labelTemperature: System.bathT,

            isTrajectry: true,
            labelShowTrajectry: "hide",

            isParticles: true,
            labelShowParticles: "hide"
        },
        methods: {
            reset: function() {
                System = new BrownianMotion(aspect);
                this.labelTemperature = System.bathT;
                resetTrajectry();
                resetGraph();
                this.isRunning = true;
                this.labelRunning = "pause";
            },
            process: function() {
                this.isRunning = !this.isRunning;
                if (this.isRunning == true) {
                    this.labelRunning = "pause";
                } else {
                    this.labelRunning = "play";
                }
            },
            setTemperature: function () {
                System.bathT = this.labelTemperature;
                setTemperatureGraph(System.bathT);
            },
            showTrajectry: function () {
                this.isTrajectry = !this.isTrajectry;

                if (this.isTrajectry == true) {
                    this.labelShowTrajectry = "hide";
                    switchShowTrajectry(this.isTrajectry);
                } else {
                    this.labelShowTrajectry = "show";
                    switchShowTrajectry(this.isTrajectry);
                }
            },
            showParticles: function () {
                this.isParticles = !this.isParticles;

                if (this.isParticles == true) {
                    this.labelShowParticles = "hide";
                    switchShowParticle(this.isParticles);
                } else {
                    this.labelShowParticles = "show";
                    switchShowParticle(this.isParticles);
                }
            }
        }
    });
//  }}}

    function loop(timestamp:number) {
        if (app.isRunning == true) {
            app.time = Number((System.t*1e9).toFixed(3));
            if (Math.floor(System.t*1e13)%5 == 0) {
                app.temp = Number((System.temperature).toFixed(2));
                graphUpdate(System.t, System.temperature);
            }

            for (let i=0;i<=5;i++) {
                System.update();
            };

            positions = System.getPositions(width);
            for (let i=0;i<=System.particleNumber;i++) {
                particles[i].move(positions[i][0], positions[i][1]);
            };

            if (Math.floor(System.t*1e13)%5 == 0) {
                updateTrajectry(app.isTrajectry);
            };
        };

        window.requestAnimationFrame((ts) => loop(ts));
    };

    window.requestAnimationFrame((ts) => loop(ts));
};

main();
