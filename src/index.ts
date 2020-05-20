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

    var particles:any[] = new Array(System.particleNumber+1);
    var positions:number[][] = System.getPositions(width);
    for (let i=0;i<=System.particleNumber;i++) {
        particles[i] = draw.circle(System.getRadius(i,width)).attr({ fill: System.particles[i].color });
    };

    var trajectry:number[] = System.getTrajectry(width);
    var trajectryLine = new Array( draw.polyline() );

//  Vue {{{
    var app = new Vue({
        el: '#console',
        data: {
            time: System.t,
            temp: System.temperature,

            labelTemperature: System.bathT,

            isTrajectry: true,
            labelShowTrajectry: "hide",

            isParticles: true,
            labelShowParticles: "hide"
        },
        methods: {
            setTemperature: function () {
                System.bathT = this.labelTemperature;
            },
            showTrajectry: function () {
                this.isTrajectry = !this.isTrajectry;

                if (this.isTrajectry == true) {
                    this.labelShowTrajectry = "hide";
                    for (var t of trajectryLine) { t.show() }
                } else {
                    this.labelShowTrajectry = "show";
                    for (var t of trajectryLine) { t.hide() }
                }
            },
            showParticles: function () {
                this.isParticles = !this.isParticles;

                if (this.isParticles == true) {
                    this.labelShowParticles = "hide";
                    for (var p of particles) { p.show() };
                } else {
                    this.labelShowParticles = "show";
                    for (var p of particles) { p.hide() };
                    particles[particles.length-1].show();
                }
            }
        }
    });
//  }}}

    function loop(timestamp:number) {
        app.time = Number((System.t*1e9).toFixed(3));
        if (Math.floor(System.t*1e13)%5 == 0) {
            app.temp = Number((System.temperature).toFixed(2))
        }

        for (let i=0;i<=5;i++) {
            System.update();
        };

        positions = System.getPositions(width);
        for (let i=0;i<=System.particleNumber;i++) {
            particles[i].move(positions[i][0], positions[i][1]);
        };

        if (Math.floor(System.t*1e13)%5 == 0) {
            var BP_position:number[] = System.getTrajectry(width);
            let i = trajectryLine.length
            trajectryLine[i] = draw.polyline([trajectry[0], trajectry[1], BP_position[0], BP_position[1] ]);
            trajectryLine[i].fill('none');
            trajectryLine[i].clear();
            trajectryLine[i].stroke({ color: '#f06', width: 1 });
            trajectry = BP_position;
//  Vue {{{
            if (app.isTrajectry == true) {
                trajectryLine[i].show();
            } else {
                trajectryLine[i].hide();
            };
//  }}}
        };

        window.requestAnimationFrame((ts) => loop(ts));
    };

    window.requestAnimationFrame((ts) => loop(ts));
};

main();
